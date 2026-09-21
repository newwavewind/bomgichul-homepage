-- chat next-15: threads, search, gallery, gate, checkin, mock_invite, official, notifications, poll lock, timer end

-- ── message kinds ──
alter table public.dm_messages drop constraint if exists dm_messages_message_kind_check;
alter table public.dm_messages
  add constraint dm_messages_message_kind_check
  check (message_kind in (
    'text','exam_card','wrong_share','timer','poll','voice','system','mock_invite','checkin'
  ));

alter table public.dm_messages
  add column if not exists thread_root_id uuid references public.dm_messages(id) on delete set null;

create extension if not exists pg_trgm;

create index if not exists dm_messages_thread_root_idx
  on public.dm_messages (conversation_id, thread_root_id, created_at)
  where thread_root_id is not null and deleted_at is null;

create index if not exists dm_messages_content_trgm_idx
  on public.dm_messages using gin (content gin_trgm_ops);

-- ── checkins ──
create table if not exists public.chat_checkins (
  user_id uuid not null references public.profiles(id) on delete cascade,
  conversation_id uuid not null references public.dm_conversations(id) on delete cascade,
  day date not null,
  count integer not null default 1 check (count > 0),
  created_at timestamptz not null default now(),
  primary key (user_id, conversation_id, day)
);
alter table public.chat_checkins enable row level security;
drop policy if exists "본인 체크인 조회" on public.chat_checkins;
create policy "본인 체크인 조회" on public.chat_checkins for select
  using (user_id = auth.uid() or public.is_dm_conversation_member(conversation_id));
drop policy if exists "본인 체크인 작성" on public.chat_checkins;
create policy "본인 체크인 작성" on public.chat_checkins for insert
  with check (user_id = auth.uid() and public.is_dm_conversation_member(conversation_id));
drop policy if exists "본인 체크인 수정" on public.chat_checkins;
create policy "본인 체크인 수정" on public.chat_checkins for update
  using (user_id = auth.uid());

-- ── notifications: chat types ──
alter table public.notifications
  add column if not exists conversation_id uuid references public.dm_conversations(id) on delete cascade,
  add column if not exists dm_message_id uuid references public.dm_messages(id) on delete cascade;

alter table public.notifications drop constraint if exists notifications_type_check;
alter table public.notifications
  add constraint notifications_type_check
  check (type in ('comment','memo_comment','dm_mention','dm_message','friend','chat_system'));

-- ── official room ──
do $$
declare
  conv_id uuid;
begin
  select id into conv_id from public.dm_conversations where topic_key = 'official';
  if conv_id is null then
    insert into public.dm_conversations (
      title, is_group, kind, topic_key, topic_label, is_public, invite_code
    ) values (
      '봄기출 공식 공지', true, 'topic', 'official', '공식 공지', true,
      substr(md5('official-bomgichul'), 1, 10)
    );
  end if;
end $$;

-- ── join_topic with soft gate (entitlement preferred; homepage free subjects always ok) ──
create or replace function public.join_topic_room(p_topic_key text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  conv_id uuid;
  me uuid := auth.uid();
  gate text;
  entitled boolean;
begin
  if me is null then raise exception '로그인이 필요합니다'; end if;
  select id, gate_subject into conv_id, gate
  from public.dm_conversations
  where kind = 'topic' and is_public and topic_key = p_topic_key;
  if conv_id is null then raise exception '스터디방을 찾을 수 없습니다'; end if;

  if gate is not null and gate <> '' then
    select exists (
      select 1 from public.user_entitlements e
      where e.user_id = me
        and e.revoked_at is null
        and (
          e.subject = gate
          or e.subject = 'all'
          or e.product_id ilike '%' || gate || '%'
        )
        and (e.expires_at is null or e.expires_at > now())
    ) into entitled;
    -- homepage is free study web: allow join but mark via notice only when not entitled
    -- still join; UI shows lock badge. Hard-block only for official room non-admin posts.
  end if;

  insert into public.dm_conversation_members (conversation_id, user_id, role)
  values (conv_id, me, 'member')
  on conflict do nothing;
  return conv_id;
end;
$$;

-- official: only admins may insert messages
create or replace function public.enforce_official_room_send()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  tkey text;
begin
  select topic_key into tkey from public.dm_conversations where id = new.conversation_id;
  if tkey = 'official' then
    if not coalesce(public.is_profile_admin(auth.uid()), false) then
      raise exception '공식 공지 채널은 운영자만 글을 올릴 수 있습니다';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_official_room_send on public.dm_messages;
create trigger trg_official_room_send
  before insert on public.dm_messages
  for each row execute function public.enforce_official_room_send();

-- auto-join all authenticated users to official? skip — they join from topics list

-- ── search ──
create or replace function public.search_dm_messages(p_query text, p_limit integer default 40)
returns table (
  id uuid,
  conversation_id uuid,
  conversation_title text,
  sender_id uuid,
  sender_nickname text,
  content text,
  created_at timestamptz,
  message_kind text
)
language sql
security definer
set search_path = public
as $$
  select
    m.id,
    m.conversation_id,
    coalesce(c.title, c.topic_label, '대화') as conversation_title,
    m.sender_id,
    coalesce(p.nickname, '익명') as sender_nickname,
    m.content,
    m.created_at,
    m.message_kind
  from public.dm_messages m
  join public.dm_conversations c on c.id = m.conversation_id
  left join public.profiles p on p.id = m.sender_id
  where public.is_dm_conversation_member(m.conversation_id)
    and m.deleted_at is null
    and (m.published_at is not null or m.scheduled_for is null or m.sender_id = auth.uid())
    and length(trim(p_query)) >= 2
    and m.content ilike '%' || trim(p_query) || '%'
  order by m.created_at desc
  limit least(greatest(coalesce(p_limit, 40), 1), 80);
$$;

-- ── gallery ──
create or replace function public.list_dm_room_media(p_conversation_id uuid, p_limit integer default 60)
returns table (
  id uuid,
  message_id uuid,
  kind text,
  file_name text,
  file_path text,
  mime_type text,
  created_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select a.id, a.message_id, a.kind, a.file_name, a.file_path, a.mime_type, m.created_at
  from public.dm_message_attachments a
  join public.dm_messages m on m.id = a.message_id
  where a.conversation_id = p_conversation_id
    and public.is_dm_conversation_member(p_conversation_id)
    and m.deleted_at is null
    and a.kind in ('image','video','audio')
  order by m.created_at desc
  limit least(greatest(coalesce(p_limit, 60), 1), 120);
$$;

-- ── thread list ──
create or replace function public.list_dm_thread(p_root_id uuid)
returns setof public.dm_messages
language sql
security definer
set search_path = public
as $$
  select m.*
  from public.dm_messages m
  where m.deleted_at is null
    and (
      m.id = p_root_id
      or m.thread_root_id = p_root_id
      or m.reply_to_id = p_root_id
    )
    and public.is_dm_conversation_member(m.conversation_id)
  order by m.created_at asc;
$$;

-- ── checkin RPC ──
create or replace function public.chat_checkin(p_conversation_id uuid, p_note text default '')
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  me uuid := auth.uid();
  today date := (timezone('Asia/Seoul', now()))::date;
  streak int := 0;
  d date;
  msg_id uuid;
begin
  if me is null then raise exception '로그인이 필요합니다'; end if;
  if not public.is_dm_conversation_member(p_conversation_id) then
    raise exception '참여자가 아닙니다';
  end if;

  insert into public.chat_checkins (user_id, conversation_id, day, count)
  values (me, p_conversation_id, today, 1)
  on conflict (user_id, conversation_id, day) do update
    set count = public.chat_checkins.count + 1;

  d := today;
  loop
    exit when not exists (
      select 1 from public.chat_checkins
      where user_id = me and conversation_id = p_conversation_id and day = d
    );
    streak := streak + 1;
    d := d - 1;
  end loop;

  insert into public.dm_messages (
    conversation_id, sender_id, content, message_kind, payload, published_at
  ) values (
    p_conversation_id, me,
    coalesce(nullif(trim(p_note), ''), '오늘 학습 인증했어요'),
    'checkin',
    jsonb_build_object('streak', streak, 'day', today::text),
    now()
  ) returning id into msg_id;

  return jsonb_build_object('messageId', msg_id, 'streak', streak, 'day', today);
end;
$$;

-- ── pin for members (topic/group) ──
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
  if p_message_id is not null and not exists (
    select 1 from public.dm_messages
    where id = p_message_id and conversation_id = p_conversation_id and deleted_at is null
  ) then
    raise exception '메시지를 찾을 수 없습니다';
  end if;
  update public.dm_conversations
  set pinned_message_id = p_message_id
  where id = p_conversation_id;
end;
$$;

-- ── vote lock after due ──
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
  due timestamptz;
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

  due := coalesce(
    nullif(msg.payload->>'dueAt', '')::timestamptz,
    (select due_at from public.chat_study_events where id = event_uuid)
  );
  if due is not null and due <= now() then
    raise exception '투표가 마감되었습니다';
  end if;

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

-- ── mention → notification trigger ──
create or replace function public.notify_dm_mentions()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid;
begin
  if new.mention_user_ids is null or cardinality(new.mention_user_ids) = 0 then
    return new;
  end if;
  if new.scheduled_for is not null and new.published_at is null then
    return new;
  end if;
  foreach uid in array new.mention_user_ids loop
    if uid is distinct from new.sender_id then
      insert into public.notifications (
        recipient_id, actor_id, type, conversation_id, dm_message_id
      ) values (
        uid, new.sender_id, 'dm_mention', new.conversation_id, new.id
      );
    end if;
  end loop;
  return new;
end;
$$;

drop trigger if exists trg_notify_dm_mentions on public.dm_messages;
create trigger trg_notify_dm_mentions
  after insert on public.dm_messages
  for each row execute function public.notify_dm_mentions();

-- also on publish update
create or replace function public.notify_dm_mentions_on_publish()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid;
begin
  if old.published_at is null and new.published_at is not null
     and new.mention_user_ids is not null
     and cardinality(new.mention_user_ids) > 0 then
    foreach uid in array new.mention_user_ids loop
      if uid is distinct from new.sender_id then
        insert into public.notifications (
          recipient_id, actor_id, type, conversation_id, dm_message_id
        ) values (
          uid, new.sender_id, 'dm_mention', new.conversation_id, new.id
        );
      end if;
    end loop;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_notify_dm_mentions_publish on public.dm_messages;
create trigger trg_notify_dm_mentions_publish
  after update of published_at on public.dm_messages
  for each row execute function public.notify_dm_mentions_on_publish();

-- ── timer end dispatcher ──
create or replace function public.dispatch_ended_chat_timers()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  r record;
  n integer := 0;
  marker text;
begin
  for r in
    select id, conversation_id, sender_id, payload, content
    from public.dm_messages
    where message_kind = 'timer'
      and deleted_at is null
      and published_at is not null
      and coalesce(payload->>'ended', 'false') <> 'true'
      and nullif(payload->>'endsAt', '')::timestamptz <= now()
    limit 50
  loop
    marker := 'timer-end:' || r.id::text;
    update public.dm_messages
    set payload = coalesce(payload, '{}'::jsonb) || jsonb_build_object('ended', true)
    where id = r.id;

    insert into public.dm_messages (
      conversation_id, sender_id, content, message_kind, payload, published_at
    ) values (
      r.conversation_id, r.sender_id,
      '⏱ 타이머가 끝났어요 · ' || coalesce(r.payload->>'label', r.content, '집중 완료'),
      'system',
      jsonb_build_object('reminderKey', marker, 'timerMessageId', r.id),
      now()
    );
    n := n + 1;
  end loop;
  return n;
end;
$$;

-- ── poll close dispatcher ──
create or replace function public.dispatch_closed_chat_polls()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  r record;
  n integer := 0;
  tallies jsonb;
  row_rec record;
  event_uuid uuid;
begin
  for r in
    select id, conversation_id, sender_id, payload, content
    from public.dm_messages
    where message_kind = 'poll'
      and deleted_at is null
      and published_at is not null
      and coalesce(payload->>'closed', 'false') <> 'true'
      and nullif(payload->>'dueAt', '')::timestamptz is not null
      and nullif(payload->>'dueAt', '')::timestamptz <= now()
    limit 40
  loop
    event_uuid := nullif(r.payload->>'eventId', '')::uuid;
    tallies := coalesce(r.payload->'tallies', '{}'::jsonb);
    if event_uuid is not null then
      tallies := '{}'::jsonb;
      for row_rec in
        select response, count(*)::int as cnt
        from public.chat_study_event_responses
        where event_id = event_uuid
        group by response
      loop
        tallies := tallies || jsonb_build_object(row_rec.response, row_rec.cnt);
      end loop;
    end if;
    update public.dm_messages
    set payload = coalesce(payload, '{}'::jsonb)
      || jsonb_build_object('closed', true, 'tallies', tallies)
    where id = r.id;
    insert into public.dm_messages (
      conversation_id, sender_id, content, message_kind, payload, published_at
    ) values (
      r.conversation_id, r.sender_id,
      '📊 폴이 마감되었어요 · ' || left(coalesce(r.content, 'OX 폴'), 80),
      'system',
      jsonb_build_object('pollMessageId', r.id, 'tallies', tallies),
      now()
    );
    n := n + 1;
  end loop;
  return n;
end;
$$;

revoke all on function public.search_dm_messages(text, integer) from public;
revoke all on function public.list_dm_room_media(uuid, integer) from public;
revoke all on function public.list_dm_thread(uuid) from public;
revoke all on function public.chat_checkin(uuid, text) from public;
revoke all on function public.set_dm_pinned_message(uuid, uuid) from public;
revoke all on function public.dispatch_ended_chat_timers() from public;
revoke all on function public.dispatch_closed_chat_polls() from public;

grant execute on function public.search_dm_messages(text, integer) to authenticated;
grant execute on function public.list_dm_room_media(uuid, integer) to authenticated;
grant execute on function public.list_dm_thread(uuid) to authenticated;
grant execute on function public.chat_checkin(uuid, text) to authenticated;
grant execute on function public.set_dm_pinned_message(uuid, uuid) to authenticated;
grant execute on function public.dispatch_ended_chat_timers() to service_role;
grant execute on function public.dispatch_closed_chat_polls() to service_role;
grant execute on function public.join_topic_room(text) to authenticated;
