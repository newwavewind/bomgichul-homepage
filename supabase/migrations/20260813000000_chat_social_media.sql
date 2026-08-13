-- 채팅 고도화: 그룹 대화, 친구, 원본 사진·동영상, 프로필 사진

alter table public.dm_conversations
  add column if not exists title text,
  add column if not exists is_group boolean not null default false,
  add column if not exists created_by uuid references public.profiles(id) on delete set null,
  add column if not exists avatar_url text;

alter table public.dm_conversation_members
  add column if not exists role text not null default 'member'
    check (role in ('owner', 'admin', 'member'));

alter table public.dm_messages drop constraint if exists dm_messages_content_check;
alter table public.dm_messages alter column content set default '';

create table if not exists public.dm_message_attachments (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.dm_messages(id) on delete cascade,
  conversation_id uuid not null references public.dm_conversations(id) on delete cascade,
  uploader_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null check (kind in ('image', 'video')),
  file_name text not null,
  file_path text not null unique,
  file_size bigint not null check (file_size > 0),
  mime_type text not null,
  width integer,
  height integer,
  duration_seconds numeric,
  created_at timestamptz not null default now()
);

create index if not exists dm_message_attachments_message_idx
  on public.dm_message_attachments (message_id, created_at);

alter table public.dm_message_attachments enable row level security;

create policy "첨부파일은 대화 참여자만 조회"
  on public.dm_message_attachments for select
  using (public.is_dm_conversation_member(conversation_id));

create policy "첨부파일 메타데이터는 발신자만 생성"
  on public.dm_message_attachments for insert
  with check (
    uploader_id = auth.uid()
    and public.is_dm_conversation_member(conversation_id)
    and exists (
      select 1 from public.dm_messages m
      where m.id = message_id
        and m.conversation_id = dm_message_attachments.conversation_id
        and m.sender_id = auth.uid()
    )
  );

create table if not exists public.friendships (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles(id) on delete cascade,
  addressee_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted')),
  created_at timestamptz not null default now(),
  accepted_at timestamptz,
  check (requester_id <> addressee_id)
);

create unique index if not exists friendships_pair_unique
  on public.friendships (
    least(requester_id::text, addressee_id::text),
    greatest(requester_id::text, addressee_id::text)
  );
create index if not exists friendships_requester_idx on public.friendships (requester_id, status);
create index if not exists friendships_addressee_idx on public.friendships (addressee_id, status);

alter table public.friendships enable row level security;

create policy "친구 관계 당사자만 조회"
  on public.friendships for select
  using (auth.uid() = requester_id or auth.uid() = addressee_id);

create policy "본인이 친구 요청"
  on public.friendships for insert
  with check (auth.uid() = requester_id and requester_id <> addressee_id);

create policy "친구 관계 당사자가 삭제"
  on public.friendships for delete
  using (auth.uid() = requester_id or auth.uid() = addressee_id);

create or replace function public.respond_friend_request(p_friendship_id uuid, p_accept boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_accept then
    update public.friendships
    set status = 'accepted', accepted_at = now()
    where id = p_friendship_id
      and addressee_id = auth.uid()
      and status = 'pending';
  else
    delete from public.friendships
    where id = p_friendship_id
      and addressee_id = auth.uid()
      and status = 'pending';
  end if;
end;
$$;

create or replace function public.create_group_dm_conversation(
  p_title text,
  p_member_ids uuid[]
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  conv_id uuid;
  me uuid := auth.uid();
  member_id uuid;
begin
  if me is null then raise exception '로그인이 필요합니다'; end if;
  if char_length(trim(coalesce(p_title, ''))) < 2 then
    raise exception '그룹 이름은 2자 이상이어야 합니다';
  end if;
  if coalesce(array_length(p_member_ids, 1), 0) < 2 then
    raise exception '친구를 2명 이상 선택해주세요';
  end if;
  if array_length(p_member_ids, 1) > 49 then
    raise exception '그룹은 최대 50명까지 참여할 수 있습니다';
  end if;

  insert into public.dm_conversations (title, is_group, created_by)
  values (left(trim(p_title), 40), true, me)
  returning id into conv_id;

  insert into public.dm_conversation_members (conversation_id, user_id, role)
  values (conv_id, me, 'owner');

  foreach member_id in array p_member_ids loop
    if member_id <> me and exists (
      select 1 from public.friendships f
      where f.status = 'accepted'
        and ((f.requester_id = me and f.addressee_id = member_id)
          or (f.addressee_id = me and f.requester_id = member_id))
    ) then
      insert into public.dm_conversation_members (conversation_id, user_id)
      values (conv_id, member_id)
      on conflict do nothing;
    end if;
  end loop;

  if (select count(*) from public.dm_conversation_members where conversation_id = conv_id) < 3 then
    raise exception '수락된 친구를 2명 이상 선택해주세요';
  end if;

  return conv_id;
end;
$$;

revoke all on function public.respond_friend_request(uuid, boolean) from public;
revoke all on function public.create_group_dm_conversation(text, uuid[]) from public;
grant execute on function public.respond_friend_request(uuid, boolean) to authenticated;
grant execute on function public.create_group_dm_conversation(text, uuid[]) to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'chat-media', 'chat-media', false, 262144000,
  array['image/jpeg','image/png','image/webp','image/gif','image/heic','image/heif','video/mp4','video/webm','video/quicktime']
)
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "대화 참여자만 채팅 미디어 조회"
  on storage.objects for select
  using (
    bucket_id = 'chat-media'
    and public.is_dm_conversation_member(((storage.foldername(name))[1])::uuid)
  );

create policy "대화 참여자만 본인 폴더에 채팅 미디어 업로드"
  on storage.objects for insert
  with check (
    bucket_id = 'chat-media'
    and auth.uid()::text = (storage.foldername(name))[2]
    and public.is_dm_conversation_member(((storage.foldername(name))[1])::uuid)
  );

create policy "업로더가 채팅 미디어 삭제"
  on storage.objects for delete
  using (
    bucket_id = 'chat-media'
    and auth.uid()::text = (storage.foldername(name))[2]
  );

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'profile-avatars', 'profile-avatars', true, 26214400,
  array['image/jpeg','image/png','image/webp','image/gif','image/heic','image/heif']
)
on conflict (id) do update set
  public = true,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "프로필 사진은 누구나 조회"
  on storage.objects for select using (bucket_id = 'profile-avatars');
create policy "본인 프로필 사진 업로드"
  on storage.objects for insert
  with check (bucket_id = 'profile-avatars' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "본인 프로필 사진 수정"
  on storage.objects for update
  using (bucket_id = 'profile-avatars' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "본인 프로필 사진 삭제"
  on storage.objects for delete
  using (bucket_id = 'profile-avatars' and auth.uid()::text = (storage.foldername(name))[1]);

