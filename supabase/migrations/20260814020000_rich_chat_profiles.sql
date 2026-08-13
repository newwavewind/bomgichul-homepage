alter table public.profiles
  add column if not exists status_message text,
  add column if not exists profile_background_url text;

create table if not exists public.profile_media (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null check (kind in ('avatar', 'background')),
  file_path text not null unique,
  created_at timestamptz not null default now()
);
create index if not exists profile_media_user_idx on public.profile_media(user_id, kind, created_at desc);
alter table public.profile_media enable row level security;
create policy "로그인 회원 프로필 미디어 조회" on public.profile_media for select using (auth.role() = 'authenticated');
create policy "내 프로필 미디어 추가" on public.profile_media for insert with check (auth.uid() = user_id);
create policy "내 프로필 미디어 삭제" on public.profile_media for delete using (auth.uid() = user_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('profile-media', 'profile-media', false, 10485760, array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do update set public=false, file_size_limit=excluded.file_size_limit, allowed_mime_types=excluded.allowed_mime_types;
create policy "로그인 회원 프로필 파일 조회" on storage.objects for select using (bucket_id='profile-media' and auth.role()='authenticated');
create policy "본인 프로필 파일 업로드" on storage.objects for insert with check (bucket_id='profile-media' and auth.uid()::text=(storage.foldername(name))[1]);
create policy "본인 프로필 파일 삭제" on storage.objects for delete using (bucket_id='profile-media' and auth.uid()::text=(storage.foldername(name))[1]);
