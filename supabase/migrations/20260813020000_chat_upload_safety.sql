-- 채팅 첨부 안전장치: 서버 측 파일/일일/월간 한도와 업로드 예약

create table if not exists public.chat_upload_reservations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  conversation_id uuid not null references public.dm_conversations(id) on delete cascade,
  file_path text not null unique,
  file_name text not null,
  file_size bigint not null check (file_size > 0),
  mime_type text not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '30 minutes'),
  completed_at timestamptz
);

create index if not exists chat_upload_reservations_user_created_idx
  on public.chat_upload_reservations (user_id, created_at desc);

alter table public.chat_upload_reservations enable row level security;

create policy "본인 업로드 예약 조회"
  on public.chat_upload_reservations for select
  using (user_id = auth.uid());

update storage.buckets set
  file_size_limit = 104857600
where id = 'chat-media';

create or replace function public.reserve_chat_upload(
  p_conversation_id uuid,
  p_file_name text,
  p_file_size bigint,
  p_mime_type text
)
returns table(reservation_id uuid, file_path text)
language plpgsql
security definer
set search_path = public
as $$
declare
  me uuid := auth.uid();
  is_admin_user boolean := false;
  max_file_size bigint;
  daily_used bigint;
  monthly_used bigint;
  reservation uuid := gen_random_uuid();
  safe_extension text;
  target_path text;
begin
  if me is null then raise exception '로그인이 필요합니다'; end if;
  if not public.is_dm_conversation_member(p_conversation_id) then
    raise exception '대화 참여자만 파일을 올릴 수 있습니다';
  end if;
  if p_file_size <= 0 then raise exception '빈 파일은 올릴 수 없습니다'; end if;

  select exists(select 1 from public.admin_users where user_id = me)
    into is_admin_user;

  max_file_size := case
    when p_mime_type like 'image/%' then 10485760
    when p_mime_type like 'video/%' then 104857600
    else 31457280
  end;
  if not is_admin_user and p_file_size > max_file_size then
    raise exception '파일 허용 용량을 초과했습니다';
  end if;

  -- 동시에 여러 탭에서 예약해도 할당량을 넘지 않도록 사용자 단위로 직렬화한다.
  perform pg_advisory_xact_lock(hashtextextended(me::text, 0));
  delete from public.chat_upload_reservations
  where user_id = me and completed_at is null and expires_at <= now();

  if not is_admin_user then
    select coalesce(sum(file_size), 0) into daily_used from (
      select file_size from public.dm_message_attachments
        where uploader_id = me and created_at >= now() - interval '24 hours'
      union all
      select file_size from public.chat_upload_reservations
        where user_id = me and completed_at is null and expires_at > now()
          and created_at >= now() - interval '24 hours'
    ) usage;

    select coalesce(sum(file_size), 0) into monthly_used from (
      select file_size from public.dm_message_attachments
        where uploader_id = me and created_at >= date_trunc('month', now())
      union all
      select file_size from public.chat_upload_reservations
        where user_id = me and completed_at is null and expires_at > now()
          and created_at >= date_trunc('month', now())
    ) usage;

    if daily_used + p_file_size > 314572800 then
      raise exception '하루 첨부 한도 300MB를 초과했습니다';
    end if;
    if monthly_used + p_file_size > 2147483648 then
      raise exception '이번 달 첨부 한도 2GB를 초과했습니다';
    end if;
  end if;

  safe_extension := lower(coalesce(substring(p_file_name from '(\.[a-zA-Z0-9]{1,10})$'), ''));
  target_path := p_conversation_id::text || '/' || me::text || '/' || reservation::text || safe_extension;

  insert into public.chat_upload_reservations
    (id, user_id, conversation_id, file_path, file_name, file_size, mime_type)
  values
    (reservation, me, p_conversation_id, target_path, left(p_file_name, 180), p_file_size, p_mime_type);

  return query select reservation, target_path;
end;
$$;

create or replace function public.complete_chat_upload(
  p_reservation_id uuid,
  p_message_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  reservation public.chat_upload_reservations%rowtype;
  attachment_id uuid;
begin
  select * into reservation
  from public.chat_upload_reservations
  where id = p_reservation_id and user_id = auth.uid()
  for update;

  if reservation.id is null or reservation.expires_at <= now() or reservation.completed_at is not null then
    raise exception '유효하지 않은 업로드 예약입니다';
  end if;
  if not exists (
    select 1 from public.dm_messages
    where id = p_message_id
      and conversation_id = reservation.conversation_id
      and sender_id = auth.uid()
  ) then
    raise exception '메시지와 업로드 정보가 일치하지 않습니다';
  end if;

  insert into public.dm_message_attachments
    (message_id, conversation_id, uploader_id, kind, file_name, file_path, file_size, mime_type)
  values (
    p_message_id,
    reservation.conversation_id,
    reservation.user_id,
    case when reservation.mime_type like 'image/%' then 'image'
         when reservation.mime_type like 'video/%' then 'video'
         else 'file' end,
    reservation.file_name,
    reservation.file_path,
    reservation.file_size,
    reservation.mime_type
  ) returning id into attachment_id;

  delete from public.chat_upload_reservations where id = reservation.id;
  return attachment_id;
end;
$$;

create or replace function public.cancel_chat_upload(p_reservation_id uuid)
returns void language sql security definer set search_path = public as $$
  delete from public.chat_upload_reservations
  where id = p_reservation_id and user_id = auth.uid() and completed_at is null;
$$;

revoke all on function public.reserve_chat_upload(uuid,text,bigint,text) from public;
revoke all on function public.complete_chat_upload(uuid,uuid) from public;
revoke all on function public.cancel_chat_upload(uuid) from public;
grant execute on function public.reserve_chat_upload(uuid,text,bigint,text) to authenticated;
grant execute on function public.complete_chat_upload(uuid,uuid) to authenticated;
grant execute on function public.cancel_chat_upload(uuid) to authenticated;

create or replace function public.delete_dm_message(p_message_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (
    select 1 from public.dm_messages
    where id = p_message_id and sender_id = auth.uid() and deleted_at is null
      and created_at > now() - interval '24 hours'
  ) then
    delete from public.dm_message_attachments where message_id = p_message_id;
    update public.dm_messages set content = '', deleted_at = now(), edited_at = null
    where id = p_message_id;
  end if;
end; $$;

drop policy if exists "대화 참여자만 본인 폴더에 채팅 미디어 업로드" on storage.objects;
create policy "예약된 채팅 미디어만 업로드"
  on storage.objects for insert
  with check (
    bucket_id = 'chat-media'
    and exists (
      select 1 from public.chat_upload_reservations r
      where r.file_path = name
        and r.user_id = auth.uid()
        and r.completed_at is null
        and r.expires_at > now()
    )
  );
