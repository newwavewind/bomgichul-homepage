-- 봄기출 채팅 2.0: 읽음, 답장, 수정/삭제, 신고/차단, 푸시, 검색/반응,
-- 일반 파일, 스터디 도구, 그룹 관리

alter table public.dm_messages
  add column if not exists reply_to_id uuid references public.dm_messages(id) on delete set null,
  add column if not exists edited_at timestamptz,
  add column if not exists deleted_at timestamptz;

alter table public.dm_conversations
  add column if not exists pinned_message_id uuid references public.dm_messages(id) on delete set null,
  add column if not exists invite_code text unique,
  add column if not exists slow_mode_seconds integer not null default 0 check (slow_mode_seconds between 0 and 3600),
  add column if not exists study_dday date,
  add column if not exists study_goal text;

alter table public.dm_conversation_members
  add column if not exists muted_until timestamptz,
  add column if not exists notifications_enabled boolean not null default true;

alter table public.dm_message_attachments drop constraint if exists dm_message_attachments_kind_check;
alter table public.dm_message_attachments
  add constraint dm_message_attachments_kind_check check (kind in ('image', 'video', 'file'));

create table if not exists public.dm_message_reactions (
  message_id uuid not null references public.dm_messages(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  emoji text not null check (emoji in ('👍','❤️','😂','🔥','👏','😮')),
  created_at timestamptz not null default now(),
  primary key (message_id, user_id, emoji)
);
alter table public.dm_message_reactions enable row level security;
create policy "대화 참여자만 반응 조회" on public.dm_message_reactions for select
  using (exists (select 1 from public.dm_messages m where m.id = message_id and public.is_dm_conversation_member(m.conversation_id)));
create policy "대화 참여자만 반응 추가" on public.dm_message_reactions for insert
  with check (user_id = auth.uid() and exists (select 1 from public.dm_messages m where m.id = message_id and public.is_dm_conversation_member(m.conversation_id)));
create policy "본인 반응 삭제" on public.dm_message_reactions for delete using (user_id = auth.uid());

create table if not exists public.user_blocks (
  blocker_id uuid not null references public.profiles(id) on delete cascade,
  blocked_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  check (blocker_id <> blocked_id)
);
alter table public.user_blocks enable row level security;
create policy "본인 차단만 조회" on public.user_blocks for select using (blocker_id = auth.uid());
create policy "본인이 차단" on public.user_blocks for insert with check (blocker_id = auth.uid());
create policy "본인이 차단 해제" on public.user_blocks for delete using (blocker_id = auth.uid());

create table if not exists public.chat_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  reported_user_id uuid not null references public.profiles(id) on delete cascade,
  conversation_id uuid not null references public.dm_conversations(id) on delete cascade,
  message_id uuid references public.dm_messages(id) on delete set null,
  reason text not null check (reason in ('spam','abuse','sexual','illegal','privacy','other')),
  details text not null default '',
  status text not null default 'open' check (status in ('open','reviewing','resolved','dismissed')),
  created_at timestamptz not null default now(),
  check (reporter_id <> reported_user_id)
);
alter table public.chat_reports enable row level security;
create policy "본인 신고 조회" on public.chat_reports for select using (reporter_id = auth.uid());
create policy "대화 참여자가 신고" on public.chat_reports for insert
  with check (reporter_id = auth.uid() and public.is_dm_conversation_member(conversation_id));

create table if not exists public.web_push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  user_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.web_push_subscriptions enable row level security;
create policy "본인 푸시 구독 관리" on public.web_push_subscriptions for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create table if not exists public.chat_study_events (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.dm_conversations(id) on delete cascade,
  creator_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null check (kind in ('notice','schedule','goal','checkin','poll')),
  title text not null,
  body text not null default '',
  due_at timestamptz,
  options jsonb not null default '[]'::jsonb,
  pinned boolean not null default false,
  created_at timestamptz not null default now()
);
create table if not exists public.chat_study_event_responses (
  event_id uuid not null references public.chat_study_events(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  response text not null,
  created_at timestamptz not null default now(),
  primary key (event_id, user_id)
);
alter table public.chat_study_events enable row level security;
alter table public.chat_study_event_responses enable row level security;
create policy "참여자만 스터디 도구 조회" on public.chat_study_events for select using (public.is_dm_conversation_member(conversation_id));
create policy "참여자만 스터디 도구 생성" on public.chat_study_events for insert with check (creator_id = auth.uid() and public.is_dm_conversation_member(conversation_id));
create policy "작성자가 스터디 도구 수정" on public.chat_study_events for update using (creator_id = auth.uid());
create policy "작성자가 스터디 도구 삭제" on public.chat_study_events for delete using (creator_id = auth.uid());
create policy "참여자만 스터디 응답 조회" on public.chat_study_event_responses for select
  using (exists (select 1 from public.chat_study_events e where e.id = event_id and public.is_dm_conversation_member(e.conversation_id)));
create policy "참여자 본인 응답" on public.chat_study_event_responses for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create or replace function public.update_dm_message(p_message_id uuid, p_content text)
returns void language plpgsql security definer set search_path = public as $$
begin
  update public.dm_messages set content = left(trim(p_content), 5000), edited_at = now()
  where id = p_message_id and sender_id = auth.uid() and deleted_at is null
    and created_at > now() - interval '24 hours';
end; $$;

create or replace function public.delete_dm_message(p_message_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  update public.dm_messages set content = '', deleted_at = now(), edited_at = null
  where id = p_message_id and sender_id = auth.uid() and deleted_at is null
    and created_at > now() - interval '24 hours';
end; $$;

create or replace function public.manage_dm_group(
  p_conversation_id uuid,
  p_action text,
  p_target_user_id uuid default null,
  p_value text default null
)
returns void language plpgsql security definer set search_path = public as $$
declare my_role text;
begin
  select role into my_role from public.dm_conversation_members
  where conversation_id = p_conversation_id and user_id = auth.uid();
  if my_role not in ('owner','admin') then raise exception '관리 권한이 없습니다'; end if;

  if p_action = 'rename' then
    update public.dm_conversations set title = left(trim(p_value), 40) where id = p_conversation_id and is_group;
  elsif p_action = 'slow_mode' then
    update public.dm_conversations set slow_mode_seconds = greatest(0, least(3600, p_value::integer)) where id = p_conversation_id;
  elsif p_action = 'remove' then
    delete from public.dm_conversation_members where conversation_id = p_conversation_id and user_id = p_target_user_id and role <> 'owner';
  elsif p_action = 'promote' and my_role = 'owner' then
    update public.dm_conversation_members set role = 'admin' where conversation_id = p_conversation_id and user_id = p_target_user_id;
  elsif p_action = 'transfer' and my_role = 'owner' then
    update public.dm_conversation_members set role = 'member' where conversation_id = p_conversation_id and user_id = auth.uid();
    update public.dm_conversation_members set role = 'owner' where conversation_id = p_conversation_id and user_id = p_target_user_id;
  elsif p_action = 'pin' then
    update public.dm_conversations set pinned_message_id = p_value::uuid where id = p_conversation_id;
  end if;
end; $$;

revoke all on function public.update_dm_message(uuid,text) from public;
revoke all on function public.delete_dm_message(uuid) from public;
revoke all on function public.manage_dm_group(uuid,text,uuid,text) from public;
grant execute on function public.update_dm_message(uuid,text) to authenticated;
grant execute on function public.delete_dm_message(uuid) to authenticated;
grant execute on function public.manage_dm_group(uuid,text,uuid,text) to authenticated;

update storage.buckets set
  allowed_mime_types = array[
    'image/jpeg','image/png','image/webp','image/gif','image/heic','image/heif',
    'video/mp4','video/webm','video/quicktime','application/pdf','application/zip',
    'application/x-zip-compressed','application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint','application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/x-hwp','application/haansofthwp','text/plain'
  ]
where id = 'chat-media';
