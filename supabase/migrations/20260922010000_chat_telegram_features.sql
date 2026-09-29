-- Telegram-inspired: channels, multi-pin, mock_result kind

alter table public.dm_conversations
  add column if not exists posting_mode text not null default 'open'
    check (posting_mode in ('open', 'admin_only'));

update public.dm_conversations
set posting_mode = 'admin_only'
where topic_key = 'official' or posting_mode is null and topic_key = 'official';

update public.dm_conversations
set posting_mode = 'admin_only'
where topic_key = 'official';

-- Seed subject broadcast channels (admin posts only)
insert into public.dm_conversations (
  title, is_group, kind, topic_key, topic_label, gate_subject, is_public, invite_code, posting_mode
)
select v.title, true, 'topic', v.topic_key, v.topic_label, null, true, encode(gen_random_bytes(4), 'hex'), 'admin_only'
from (values
  ('민법 공지 채널', 'channel-civil-law', '민법 채널'),
  ('행정법 공지 채널', 'channel-admin-law', '행정법 채널'),
  ('부동산 공지 채널', 'channel-realestate', '부동산 채널')
) as v(title, topic_key, topic_label)
where not exists (
  select 1 from public.dm_conversations c where c.topic_key = v.topic_key
);

create or replace function public.enforce_official_room_send()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  mode text;
begin
  select posting_mode into mode from public.dm_conversations where id = new.conversation_id;
  if mode = 'admin_only' then
    if not coalesce(public.is_profile_admin(auth.uid()), false) then
      raise exception '채널은 운영자만 글을 올릴 수 있습니다';
    end if;
  end if;
  return new;
end;
$$;

drop function if exists public.list_topic_rooms();

create or replace function public.list_topic_rooms()
returns table (
  id uuid,
  title text,
  topic_key text,
  topic_label text,
  gate_subject text,
  invite_code text,
  member_count bigint,
  joined boolean,
  posting_mode text
)
language sql
security definer
set search_path = public
as $$
  select
    c.id,
    c.title,
    c.topic_key,
    c.topic_label,
    c.gate_subject,
    c.invite_code,
    (select count(*) from public.dm_conversation_members m where m.conversation_id = c.id) as member_count,
    exists (
      select 1 from public.dm_conversation_members m
      where m.conversation_id = c.id and m.user_id = auth.uid()
    ) as joined,
    c.posting_mode
  from public.dm_conversations c
  where c.kind = 'topic' and c.is_public = true
  order by
    case when c.posting_mode = 'admin_only' then 0 else 1 end,
    c.topic_label;
$$;

alter table public.dm_messages drop constraint if exists dm_messages_message_kind_check;
alter table public.dm_messages
  add constraint dm_messages_message_kind_check
  check (message_kind in (
    'text','exam_card','wrong_share','timer','poll','voice','system',
    'mock_invite','checkin','schedule_share','reminder','mock_result'
  ));

create table if not exists public.dm_pinned_messages (
  conversation_id uuid not null references public.dm_conversations(id) on delete cascade,
  message_id uuid not null references public.dm_messages(id) on delete cascade,
  pinned_by uuid references public.profiles(id) on delete set null,
  pinned_at timestamptz not null default now(),
  primary key (conversation_id, message_id)
);

create index if not exists dm_pinned_messages_conv_idx
  on public.dm_pinned_messages (conversation_id, pinned_at desc);

alter table public.dm_pinned_messages enable row level security;

drop policy if exists dm_pinned_messages_select on public.dm_pinned_messages;
create policy dm_pinned_messages_select on public.dm_pinned_messages
  for select to authenticated
  using (public.is_dm_conversation_member(conversation_id));

create or replace function public.list_dm_pinned_messages(p_conversation_id uuid)
returns table (
  message_id uuid,
  content text,
  message_kind text,
  pinned_at timestamptz,
  pinned_by uuid
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_dm_conversation_member(p_conversation_id) then
    raise exception '참여자가 아닙니다';
  end if;
  return query
    select p.message_id, m.content, m.message_kind, p.pinned_at, p.pinned_by
    from public.dm_pinned_messages p
    join public.dm_messages m on m.id = p.message_id
    where p.conversation_id = p_conversation_id
      and m.deleted_at is null
    order by p.pinned_at desc
    limit 20;
end;
$$;

create or replace function public.add_dm_pinned_message(
  p_conversation_id uuid,
  p_message_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  pin_count integer;
begin
  if auth.uid() is null then raise exception '로그인이 필요합니다'; end if;
  if not public.is_dm_conversation_member(p_conversation_id) then
    raise exception '참여자가 아닙니다';
  end if;
  if not exists (
    select 1 from public.dm_messages
    where id = p_message_id and conversation_id = p_conversation_id and deleted_at is null
  ) then
    raise exception '메시지를 찾을 수 없습니다';
  end if;
  select count(*) into pin_count from public.dm_pinned_messages where conversation_id = p_conversation_id;
  if pin_count >= 10 then
    raise exception '고정은 방당 최대 10개까지예요';
  end if;
  insert into public.dm_pinned_messages (conversation_id, message_id, pinned_by)
  values (p_conversation_id, p_message_id, auth.uid())
  on conflict do nothing;
  update public.dm_conversations
  set pinned_message_id = coalesce(pinned_message_id, p_message_id)
  where id = p_conversation_id;
end;
$$;

create or replace function public.remove_dm_pinned_message(
  p_conversation_id uuid,
  p_message_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_dm_conversation_member(p_conversation_id) then
    raise exception '참여자가 아닙니다';
  end if;
  delete from public.dm_pinned_messages
  where conversation_id = p_conversation_id and message_id = p_message_id;
  update public.dm_conversations c
  set pinned_message_id = (
    select p.message_id from public.dm_pinned_messages p
    where p.conversation_id = c.id
    order by p.pinned_at desc
    limit 1
  )
  where c.id = p_conversation_id;
end;
$$;

-- Keep primary pin RPC in sync with multi-pin table
create or replace function public.set_dm_pinned_message(
  p_conversation_id uuid,
  p_message_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_dm_conversation_member(p_conversation_id) then
    raise exception '참여자가 아닙니다';
  end if;
  if p_message_id is null then
    delete from public.dm_pinned_messages where conversation_id = p_conversation_id;
    update public.dm_conversations set pinned_message_id = null where id = p_conversation_id;
    return;
  end if;
  perform public.add_dm_pinned_message(p_conversation_id, p_message_id);
end;
$$;

revoke all on function public.list_dm_pinned_messages(uuid) from public;
revoke all on function public.add_dm_pinned_message(uuid, uuid) from public;
revoke all on function public.remove_dm_pinned_message(uuid, uuid) from public;
grant execute on function public.list_dm_pinned_messages(uuid) to authenticated;
grant execute on function public.add_dm_pinned_message(uuid, uuid) to authenticated;
grant execute on function public.remove_dm_pinned_message(uuid, uuid) to authenticated;
grant execute on function public.list_topic_rooms() to authenticated;
