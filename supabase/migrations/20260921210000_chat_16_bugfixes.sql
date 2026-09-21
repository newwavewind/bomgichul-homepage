-- chat-16 bugfixes: audio upload kind, scheduled SELECT, poll RPCs, publish grant

-- 1) complete_chat_upload: map audio/* → audio
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
  attachment_kind text;
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

  attachment_kind := case
    when reservation.mime_type like 'image/%' then 'image'
    when reservation.mime_type like 'video/%' then 'video'
    when reservation.mime_type like 'audio/%' then 'audio'
    else 'file'
  end;

  insert into public.dm_message_attachments
    (message_id, conversation_id, uploader_id, kind, file_name, file_path, file_size, mime_type)
  values (
    p_message_id,
    reservation.conversation_id,
    reservation.user_id,
    attachment_kind,
    reservation.file_name,
    reservation.file_path,
    reservation.file_size,
    reservation.mime_type
  ) returning id into attachment_id;

  delete from public.chat_upload_reservations where id = reservation.id;
  return attachment_id;
end;
$$;

-- 2) Scheduled drafts: members only see published (or own drafts)
drop policy if exists "메시지는 참여자만 조회" on public.dm_messages;
create policy "메시지는 참여자만 조회"
  on public.dm_messages for select
  using (
    public.is_dm_conversation_member(conversation_id)
    and (
      published_at is not null
      or scheduled_for is null
      or sender_id = auth.uid()
    )
  );

drop policy if exists "예약 메시지 본인 조회" on public.dm_messages;

-- 3) Poll: attach eventId after create (security definer)
create or replace function public.attach_poll_event_to_message(
  p_message_id uuid,
  p_event_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  msg public.dm_messages%rowtype;
begin
  select * into msg from public.dm_messages where id = p_message_id;
  if msg.id is null then raise exception '메시지를 찾을 수 없습니다'; end if;
  if msg.sender_id <> auth.uid() then raise exception '본인 메시지만 연결할 수 있습니다'; end if;
  if msg.message_kind <> 'poll' then raise exception '폴 메시지가 아닙니다'; end if;
  if not exists (
    select 1 from public.chat_study_events e
    where e.id = p_event_id
      and e.conversation_id = msg.conversation_id
      and e.creator_id = auth.uid()
      and e.kind = 'poll'
  ) then
    raise exception '폴 이벤트를 찾을 수 없습니다';
  end if;

  update public.dm_messages
  set payload = coalesce(payload, '{}'::jsonb)
    || jsonb_build_object(
      'eventId', p_event_id,
      'tallies', coalesce(payload->'tallies', '{"O":0,"X":0}'::jsonb)
    )
  where id = p_message_id;
end;
$$;

-- 4) Poll vote + tallies
create or replace function public.vote_chat_poll(
  p_message_id uuid,
  p_option_key text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  msg public.dm_messages%rowtype;
  event_uuid uuid;
  tallies jsonb := '{}'::jsonb;
  row_rec record;
  next_payload jsonb;
begin
  if auth.uid() is null then raise exception '로그인이 필요합니다'; end if;
  select * into msg from public.dm_messages where id = p_message_id and deleted_at is null;
  if msg.id is null then raise exception '메시지를 찾을 수 없습니다'; end if;
  if not public.is_dm_conversation_member(msg.conversation_id) then
    raise exception '참여자가 아닙니다';
  end if;
  if msg.message_kind <> 'poll' then raise exception '폴 메시지가 아닙니다'; end if;

  event_uuid := nullif(msg.payload->>'eventId', '')::uuid;
  if event_uuid is null then raise exception '투표 이벤트를 찾을 수 없습니다'; end if;

  insert into public.chat_study_event_responses (event_id, user_id, response)
  values (event_uuid, auth.uid(), left(trim(p_option_key), 32))
  on conflict (event_id, user_id) do update
    set response = excluded.response, created_at = now();

  for row_rec in
    select response, count(*)::int as cnt
    from public.chat_study_event_responses
    where event_id = event_uuid
    group by response
  loop
    tallies := tallies || jsonb_build_object(row_rec.response, row_rec.cnt);
  end loop;

  next_payload := coalesce(msg.payload, '{}'::jsonb)
    || jsonb_build_object('tallies', tallies, 'myVote', left(trim(p_option_key), 32));

  update public.dm_messages set payload = next_payload where id = p_message_id;
  return next_payload;
end;
$$;

revoke all on function public.attach_poll_event_to_message(uuid, uuid) from public;
revoke all on function public.vote_chat_poll(uuid, text) from public;
grant execute on function public.attach_poll_event_to_message(uuid, uuid) to authenticated;
grant execute on function public.vote_chat_poll(uuid, text) to authenticated;

-- 5) publish_due: cron/service only (not every logged-in user)
revoke all on function public.publish_due_scheduled_dm_messages() from public;
revoke all on function public.publish_due_scheduled_dm_messages() from authenticated;
grant execute on function public.publish_due_scheduled_dm_messages() to service_role;
