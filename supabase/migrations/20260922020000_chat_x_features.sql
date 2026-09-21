-- X-inspired chat: note_card / live_session, bookmark folders, profile follows, reposts

alter table public.dm_messages drop constraint if exists dm_messages_message_kind_check;
alter table public.dm_messages
  add constraint dm_messages_message_kind_check
  check (message_kind in (
    'text','exam_card','wrong_share','timer','poll','voice','system',
    'mock_invite','checkin','schedule_share','reminder','mock_result',
    'note_card','live_session'
  ));

-- Bookmark folders
create table if not exists public.dm_bookmark_folders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 40),
  sort integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists dm_bookmark_folders_user_idx
  on public.dm_bookmark_folders (user_id, sort, created_at);

alter table public.dm_bookmark_folders enable row level security;

drop policy if exists dm_bookmark_folders_owner on public.dm_bookmark_folders;
create policy dm_bookmark_folders_owner on public.dm_bookmark_folders
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

alter table public.dm_message_bookmarks
  add column if not exists folder_id uuid references public.dm_bookmark_folders(id) on delete set null;

create index if not exists dm_message_bookmarks_folder_idx
  on public.dm_message_bookmarks (user_id, folder_id);

drop policy if exists "본인 북마크 수정" on public.dm_message_bookmarks;
create policy "본인 북마크 수정" on public.dm_message_bookmarks
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Profile follows (friend-free)
create table if not exists public.profile_follows (
  follower_id uuid not null references public.profiles(id) on delete cascade,
  following_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, following_id),
  check (follower_id <> following_id)
);

create index if not exists profile_follows_following_idx
  on public.profile_follows (following_id, created_at desc);

alter table public.profile_follows enable row level security;

drop policy if exists profile_follows_select on public.profile_follows;
create policy profile_follows_select on public.profile_follows
  for select to authenticated
  using (follower_id = auth.uid() or following_id = auth.uid());

drop policy if exists profile_follows_insert on public.profile_follows;
create policy profile_follows_insert on public.profile_follows
  for insert to authenticated
  with check (follower_id = auth.uid());

drop policy if exists profile_follows_delete on public.profile_follows;
create policy profile_follows_delete on public.profile_follows
  for delete to authenticated
  using (follower_id = auth.uid());

create or replace function public.toggle_profile_follow(p_following_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_exists boolean;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  if p_following_id = auth.uid() then
    raise exception 'cannot follow yourself';
  end if;
  select exists (
    select 1 from public.profile_follows
    where follower_id = auth.uid() and following_id = p_following_id
  ) into v_exists;
  if v_exists then
    delete from public.profile_follows
    where follower_id = auth.uid() and following_id = p_following_id;
    return false;
  end if;
  insert into public.profile_follows (follower_id, following_id)
  values (auth.uid(), p_following_id);
  return true;
end;
$$;

revoke all on function public.toggle_profile_follow(uuid) from public;
grant execute on function public.toggle_profile_follow(uuid) to authenticated;

-- Repost / quote counts (mirror views)
create table if not exists public.dm_message_reposts (
  id uuid primary key default gen_random_uuid(),
  source_message_id uuid not null references public.dm_messages(id) on delete cascade,
  repost_message_id uuid not null references public.dm_messages(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (repost_message_id)
);

create index if not exists dm_message_reposts_source_idx
  on public.dm_message_reposts (source_message_id, created_at desc);

alter table public.dm_message_reposts enable row level security;

drop policy if exists dm_message_reposts_select on public.dm_message_reposts;
create policy dm_message_reposts_select on public.dm_message_reposts
  for select to authenticated
  using (
    exists (
      select 1 from public.dm_messages m
      where m.id = source_message_id
        and public.is_dm_conversation_member(m.conversation_id)
    )
  );

create or replace function public.record_dm_message_repost(
  p_source_message_id uuid,
  p_repost_message_id uuid
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  if not exists (
    select 1 from public.dm_messages m
    where m.id = p_source_message_id
      and public.is_dm_conversation_member(m.conversation_id)
  ) then
    raise exception 'not a member of source';
  end if;
  if not exists (
    select 1 from public.dm_messages m
    where m.id = p_repost_message_id
      and m.sender_id = auth.uid()
  ) then
    raise exception 'repost message not owned';
  end if;

  insert into public.dm_message_reposts (source_message_id, repost_message_id, user_id)
  values (p_source_message_id, p_repost_message_id, auth.uid())
  on conflict (repost_message_id) do nothing;

  select count(*)::integer into v_count
  from public.dm_message_reposts
  where source_message_id = p_source_message_id;

  return v_count;
end;
$$;

revoke all on function public.record_dm_message_repost(uuid, uuid) from public;
grant execute on function public.record_dm_message_repost(uuid, uuid) to authenticated;
