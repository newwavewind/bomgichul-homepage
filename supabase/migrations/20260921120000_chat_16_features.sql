-- 채팅 16기능: 토픽방·리치 메시지·예약·음성·북마크·보관·DND·멘션·초대코드

-- ── conversations ──
alter table public.dm_conversations
  add column if not exists kind text not null default 'dm'
    check (kind in ('dm','group','self','topic')),
  add column if not exists topic_key text,
  add column if not exists topic_label text,
  add column if not exists gate_subject text,
  add column if not exists is_public boolean not null default false;

create unique index if not exists dm_conversations_topic_key_uidx
  on public.dm_conversations (topic_key) where topic_key is not null;

-- ── members: archive / mute already has muted_until ──
alter table public.dm_conversation_members
  add column if not exists archived_at timestamptz,
  add column if not exists mention_only boolean not null default false;

-- ── messages: rich payload + schedule + mentions ──
alter table public.dm_messages
  add column if not exists message_kind text not null default 'text'
    check (message_kind in ('text','exam_card','wrong_share','timer','poll','voice','system')),
  add column if not exists payload jsonb not null default '{}'::jsonb,
  add column if not exists scheduled_for timestamptz,
  add column if not exists published_at timestamptz,
  add column if not exists mention_user_ids uuid[] not null default '{}';

create index if not exists dm_messages_scheduled_idx
  on public.dm_messages (scheduled_for)
  where scheduled_for is not null and published_at is null and deleted_at is null;

create index if not exists dm_messages_payload_gin
  on public.dm_messages using gin (payload);

-- attachment: voice
alter table public.dm_message_attachments drop constraint if exists dm_message_attachments_kind_check;
alter table public.dm_message_attachments
  add constraint dm_message_attachments_kind_check
  check (kind in ('image','video','file','audio'));

-- ── bookmarks ──
create table if not exists public.dm_message_bookmarks (
  user_id uuid not null references public.profiles(id) on delete cascade,
  message_id uuid not null references public.dm_messages(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, message_id)
);
alter table public.dm_message_bookmarks enable row level security;
drop policy if exists "본인 북마크 조회" on public.dm_message_bookmarks;
create policy "본인 북마크 조회" on public.dm_message_bookmarks for select using (user_id = auth.uid());
drop policy if exists "본인 북마크 추가" on public.dm_message_bookmarks;
create policy "본인 북마크 추가" on public.dm_message_bookmarks for insert
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.dm_messages m
      where m.id = message_id and public.is_dm_conversation_member(m.conversation_id)
    )
  );
drop policy if exists "본인 북마크 삭제" on public.dm_message_bookmarks;
create policy "본인 북마크 삭제" on public.dm_message_bookmarks for delete using (user_id = auth.uid());

-- ── user chat prefs (DND, presence, keywords, daily goal) ──
create table if not exists public.user_chat_prefs (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  dnd_until timestamptz,
  hide_presence boolean not null default false,
  keyword_alerts text[] not null default '{}',
  daily_goal_count integer not null default 40 check (daily_goal_count between 0 and 500),
  daily_done_count integer not null default 0 check (daily_done_count >= 0),
  daily_done_on date,
  updated_at timestamptz not null default now()
);
alter table public.user_chat_prefs enable row level security;
drop policy if exists "본인 채팅 설정" on public.user_chat_prefs;
create policy "본인 채팅 설정" on public.user_chat_prefs for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ── study events: allow timer + weekly ──
alter table public.chat_study_events drop constraint if exists chat_study_events_kind_check;
alter table public.chat_study_events
  add constraint chat_study_events_kind_check
  check (kind in ('notice','schedule','goal','checkin','poll','timer','weekly'));
alter table public.chat_study_events
  add column if not exists recurrence text
    check (recurrence is null or recurrence in ('weekly')),
  add column if not exists weekday smallint check (weekday is null or weekday between 0 and 6),
  add column if not exists time_of_day time;

-- ── seed topic rooms ──
do $$
declare
  topics text[][] := array[
    array['civil-law','민법',null],
    array['broker-law','공인중개사법',null],
    array['registry-law','부동산공시법령',null],
    array['public-law','부동산공법',null],
    array['tax-law','세법',null],
    array['admin-law','행정법','haengjeongbeop'],
    array['police','경찰학',null],
    array['english','영어',null],
    array['history','한국사',null],
    array['housing','주택관리사',null]
  ];
  t text[];
  conv_id uuid;
begin
  foreach t slice 1 in array topics loop
    select id into conv_id from public.dm_conversations where topic_key = t[1];
    if conv_id is null then
      insert into public.dm_conversations (
        title, is_group, kind, topic_key, topic_label, gate_subject, is_public, invite_code
      ) values (
        t[2] || ' 스터디방', true, 'topic', t[1], t[2],
        nullif(t[3], ''), true,
        substr(md5(t[1] || '-bomgichul-topic'), 1, 10)
      ) returning id into conv_id;
    end if;
  end loop;
end $$;

-- public topic rooms: authenticated users can see & join
create or replace function public.list_topic_rooms()
returns table (
  id uuid,
  title text,
  topic_key text,
  topic_label text,
  gate_subject text,
  invite_code text,
  member_count bigint,
  joined boolean
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
    ) as joined
  from public.dm_conversations c
  where c.kind = 'topic' and c.is_public = true
  order by c.topic_label;
$$;

create or replace function public.join_topic_room(p_topic_key text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  conv_id uuid;
  me uuid := auth.uid();
begin
  if me is null then raise exception '로그인이 필요합니다'; end if;
  select id into conv_id from public.dm_conversations
  where kind = 'topic' and is_public and topic_key = p_topic_key;
  if conv_id is null then raise exception '스터디방을 찾을 수 없습니다'; end if;
  insert into public.dm_conversation_members (conversation_id, user_id, role)
  values (conv_id, me, 'member')
  on conflict do nothing;
  return conv_id;
end;
$$;

create or replace function public.join_dm_by_invite(p_invite_code text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  conv_id uuid;
  me uuid := auth.uid();
begin
  if me is null then raise exception '로그인이 필요합니다'; end if;
  select id into conv_id from public.dm_conversations
  where invite_code = lower(trim(p_invite_code));
  if conv_id is null then raise exception '초대 코드가 올바르지 않습니다'; end if;
  insert into public.dm_conversation_members (conversation_id, user_id, role)
  values (conv_id, me, 'member')
  on conflict do nothing;
  return conv_id;
end;
$$;

create or replace function public.ensure_group_invite_code(p_conversation_id uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  code text;
  my_role text;
begin
  select role into my_role from public.dm_conversation_members
  where conversation_id = p_conversation_id and user_id = auth.uid();
  if my_role not in ('owner','admin') then raise exception '관리 권한이 없습니다'; end if;
  select invite_code into code from public.dm_conversations where id = p_conversation_id;
  if code is null or code = '' then
    code := substr(replace(gen_random_uuid()::text, '-', ''), 1, 10);
    update public.dm_conversations set invite_code = code where id = p_conversation_id;
  end if;
  return code;
end;
$$;

create or replace function public.set_dm_conversation_archived(p_conversation_id uuid, p_archived boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_dm_conversation_member(p_conversation_id) then
    raise exception '참여자가 아닙니다';
  end if;
  update public.dm_conversation_members
  set archived_at = case when p_archived then now() else null end
  where conversation_id = p_conversation_id and user_id = auth.uid();
end;
$$;

create or replace function public.set_dm_conversation_muted(p_conversation_id uuid, p_muted boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_dm_conversation_member(p_conversation_id) then
    raise exception '참여자가 아닙니다';
  end if;
  update public.dm_conversation_members
  set
    muted_until = case when p_muted then now() + interval '100 years' else null end,
    notifications_enabled = not p_muted
  where conversation_id = p_conversation_id and user_id = auth.uid();
end;
$$;

create or replace function public.publish_due_scheduled_dm_messages()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  n integer;
begin
  update public.dm_messages
  set published_at = now(), created_at = now()
  where scheduled_for is not null
    and scheduled_for <= now()
    and published_at is null
    and deleted_at is null;
  get diagnostics n = row_count;
  return n;
end;
$$;

-- allow selecting scheduled own drafts + published messages for members
-- (existing select policy already covers members; drafts visible to sender via extra policy)
drop policy if exists "예약 메시지 본인 조회" on public.dm_messages;
create policy "예약 메시지 본인 조회" on public.dm_messages for select
  using (sender_id = auth.uid() and scheduled_for is not null);

revoke all on function public.list_topic_rooms() from public;
revoke all on function public.join_topic_room(text) from public;
revoke all on function public.join_dm_by_invite(text) from public;
revoke all on function public.ensure_group_invite_code(uuid) from public;
revoke all on function public.set_dm_conversation_archived(uuid,boolean) from public;
revoke all on function public.set_dm_conversation_muted(uuid,boolean) from public;
revoke all on function public.publish_due_scheduled_dm_messages() from public;

grant execute on function public.list_topic_rooms() to authenticated;
grant execute on function public.join_topic_room(text) to authenticated;
grant execute on function public.join_dm_by_invite(text) to authenticated;
grant execute on function public.ensure_group_invite_code(uuid) to authenticated;
grant execute on function public.set_dm_conversation_archived(uuid,boolean) to authenticated;
grant execute on function public.set_dm_conversation_muted(uuid,boolean) to authenticated;
grant execute on function public.publish_due_scheduled_dm_messages() to authenticated, service_role;

-- storage: allow audio
update storage.buckets set
  allowed_mime_types = array[
    'image/jpeg','image/png','image/webp','image/gif','image/heic','image/heif',
    'video/mp4','video/webm','video/quicktime',
    'audio/webm','audio/mp4','audio/mpeg','audio/ogg','audio/wav','audio/x-m4a','audio/aac',
    'application/pdf','application/zip','application/x-zip-compressed','application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint','application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/x-hwp','application/haansofthwp','text/plain'
  ]
where id = 'chat-media';
