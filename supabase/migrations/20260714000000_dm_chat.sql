-- 1:1 DM + 대화 저장 (홈페이지 실시간 채팅)

create table if not exists public.dm_conversations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.dm_conversation_members (
  conversation_id uuid not null references public.dm_conversations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  last_read_at timestamptz not null default now(),
  joined_at timestamptz not null default now(),
  primary key (conversation_id, user_id)
);

create index if not exists dm_conversation_members_user_idx
  on public.dm_conversation_members (user_id, joined_at desc);

create table if not exists public.dm_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.dm_conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  content text not null check (char_length(trim(content)) > 0),
  created_at timestamptz not null default now()
);

create index if not exists dm_messages_conversation_created_idx
  on public.dm_messages (conversation_id, created_at asc);

alter table public.dm_conversations enable row level security;
alter table public.dm_conversation_members enable row level security;
alter table public.dm_messages enable row level security;

create policy "대화방은 참여자만 조회"
  on public.dm_conversations for select
  using (
    exists (
      select 1 from public.dm_conversation_members m
      where m.conversation_id = id and m.user_id = auth.uid()
    )
  );

create policy "대화 참여자만 조회"
  on public.dm_conversation_members for select
  using (
    conversation_id in (
      select conversation_id from public.dm_conversation_members
      where user_id = auth.uid()
    )
  );

create policy "메시지는 참여자만 조회"
  on public.dm_messages for select
  using (
    exists (
      select 1 from public.dm_conversation_members m
      where m.conversation_id = dm_messages.conversation_id
        and m.user_id = auth.uid()
    )
  );

create policy "참여자만 메시지 전송"
  on public.dm_messages for insert
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.dm_conversation_members m
      where m.conversation_id = dm_messages.conversation_id
        and m.user_id = auth.uid()
    )
  );

create trigger dm_conversations_updated_at
  before update on public.dm_conversations
  for each row execute function public.update_updated_at();

create or replace function public.touch_dm_conversation_on_message()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.dm_conversations
  set updated_at = now()
  where id = new.conversation_id;
  return new;
end;
$$;

create trigger dm_messages_touch_conversation
  after insert on public.dm_messages
  for each row execute function public.touch_dm_conversation_on_message();

create or replace function public.get_or_create_dm_conversation(other_user_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  conv_id uuid;
  me uuid := auth.uid();
begin
  if me is null then
    raise exception '로그인이 필요합니다';
  end if;
  if other_user_id is null or me = other_user_id then
    raise exception '잘못된 대화 상대입니다';
  end if;

  if not exists (
    select 1 from public.profiles p
    where p.id = other_user_id and p.username_set = true
  ) then
    raise exception '대화할 수 없는 사용자입니다';
  end if;

  select cm1.conversation_id into conv_id
  from public.dm_conversation_members cm1
  join public.dm_conversation_members cm2
    on cm1.conversation_id = cm2.conversation_id
  where cm1.user_id = me
    and cm2.user_id = other_user_id
  limit 1;

  if conv_id is not null then
    return conv_id;
  end if;

  insert into public.dm_conversations default values returning id into conv_id;
  insert into public.dm_conversation_members (conversation_id, user_id)
  values (conv_id, me), (conv_id, other_user_id);

  return conv_id;
end;
$$;

create or replace function public.mark_dm_conversation_read(p_conversation_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception '로그인이 필요합니다';
  end if;

  update public.dm_conversation_members
  set last_read_at = now()
  where conversation_id = p_conversation_id
    and user_id = auth.uid();
end;
$$;

revoke all on function public.get_or_create_dm_conversation(uuid) from public;
revoke all on function public.mark_dm_conversation_read(uuid) from public;
grant execute on function public.get_or_create_dm_conversation(uuid) to authenticated;
grant execute on function public.mark_dm_conversation_read(uuid) to authenticated;

alter publication supabase_realtime add table public.dm_messages;
