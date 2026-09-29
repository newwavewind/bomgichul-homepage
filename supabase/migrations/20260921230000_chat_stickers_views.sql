-- Study stickers (expanded reactions) + exam/wrong view ribbon

alter table public.dm_message_reactions
  drop constraint if exists dm_message_reactions_emoji_check;

alter table public.dm_message_reactions
  add constraint dm_message_reactions_emoji_check
  check (emoji in (
    '👍','❤️','😂','🔥','👏','😮',
    '⭕','❌','⚠️','📌','💡','🔄'
  ));

create table if not exists public.dm_message_views (
  message_id uuid not null references public.dm_messages(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (message_id, user_id)
);

alter table public.dm_message_views enable row level security;

drop policy if exists "대화 참여자만 열람 조회" on public.dm_message_views;
create policy "대화 참여자만 열람 조회" on public.dm_message_views for select
  using (
    exists (
      select 1 from public.dm_messages m
      where m.id = message_id
        and public.is_dm_conversation_member(m.conversation_id)
    )
  );

drop policy if exists "대화 참여자만 열람 기록" on public.dm_message_views;
create policy "대화 참여자만 열람 기록" on public.dm_message_views for insert
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.dm_messages m
      where m.id = message_id
        and public.is_dm_conversation_member(m.conversation_id)
    )
  );

create or replace function public.record_dm_message_view(p_message_id uuid)
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
    where m.id = p_message_id
      and public.is_dm_conversation_member(m.conversation_id)
  ) then
    raise exception 'not a member';
  end if;

  insert into public.dm_message_views (message_id, user_id)
  values (p_message_id, auth.uid())
  on conflict (message_id, user_id) do nothing;

  select count(*)::integer into v_count
  from public.dm_message_views
  where message_id = p_message_id;

  return v_count;
end;
$$;

revoke all on function public.record_dm_message_view(uuid) from public;
grant execute on function public.record_dm_message_view(uuid) to authenticated;
