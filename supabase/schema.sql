-- 봄기출 커뮤니티 DB 스키마
-- Supabase SQL Editor에서 실행하세요.

-- 프로필 (auth.users 확장)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text not null,
  avatar_url text,
  created_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "프로필은 누구나 조회 가능"
  on public.profiles for select using (true);

create policy "본인 프로필만 수정 가능"
  on public.profiles for update using (auth.uid() = id);

create policy "본인 프로필만 생성 가능"
  on public.profiles for insert with check (auth.uid() = id);

-- 게시글
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  category text not null check (category in ('question', 'resource', 'chat', 'info')),
  title text not null,
  content text not null,
  view_count int default 0 not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index posts_category_idx on public.posts(category);
create index posts_created_at_idx on public.posts(created_at desc);

alter table public.posts enable row level security;

create policy "게시글은 누구나 조회 가능"
  on public.posts for select using (true);

create policy "로그인 사용자만 게시글 작성"
  on public.posts for insert with check (auth.uid() = author_id);

create policy "본인 게시글만 수정"
  on public.posts for update using (auth.uid() = author_id);

create policy "본인 게시글만 삭제"
  on public.posts for delete using (auth.uid() = author_id);

-- 댓글
create table public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz default now() not null
);

create index comments_post_id_idx on public.comments(post_id);

alter table public.comments enable row level security;

create policy "댓글은 누구나 조회 가능"
  on public.comments for select using (true);

create policy "로그인 사용자만 댓글 작성"
  on public.comments for insert with check (auth.uid() = author_id);

create policy "본인 댓글만 수정"
  on public.comments for update using (auth.uid() = author_id);

create policy "본인 댓글만 삭제"
  on public.comments for delete using (auth.uid() = author_id);

-- 회원가입 시 프로필 자동 생성
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nickname)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nickname', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- updated_at 자동 갱신
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger posts_updated_at
  before update on public.posts
  for each row execute function public.update_updated_at();

-- 자료실: 첨부파일 + 메타데이터
alter table public.posts
  add column if not exists subject text,
  add column if not exists resource_type text check (
    resource_type is null or resource_type in ('past_exam', 'note', 'summary', 'other')
  );

create index if not exists posts_resource_type_idx on public.posts(resource_type);
create index if not exists posts_subject_idx on public.posts(subject);

create table if not exists public.post_attachments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  file_name text not null,
  file_path text not null,
  file_size bigint not null default 0,
  mime_type text not null default 'application/octet-stream',
  created_at timestamptz default now() not null
);

create index if not exists post_attachments_post_id_idx on public.post_attachments(post_id);

alter table public.post_attachments enable row level security;

create policy "첨부파일은 누구나 조회 가능"
  on public.post_attachments for select using (true);

create policy "로그인 사용자만 첨부파일 등록"
  on public.post_attachments for insert
  with check (
    exists (
      select 1 from public.posts
      where posts.id = post_id and posts.author_id = auth.uid()
    )
  );

create policy "본인 게시글 첨부만 삭제"
  on public.post_attachments for delete
  using (
    exists (
      select 1 from public.posts
      where posts.id = post_id and posts.author_id = auth.uid()
    )
  );

-- Storage: Supabase Dashboard > Storage에서 'archive' public 버킷 생성 후 storage policies 적용
-- (supabase/migrations/002_archive.sql 참고)

-- 수험일기 (본인만 조회·작성)
create table if not exists public.study_diaries (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  diary_date date not null,
  content text not null,
  mood text check (mood is null or mood in ('great', 'good', 'okay', 'tired', 'hard')),
  study_minutes int default 0 not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique (author_id, diary_date)
);

create index if not exists study_diaries_author_date_idx
  on public.study_diaries(author_id, diary_date desc);

alter table public.study_diaries enable row level security;

create policy "본인 일기만 조회"
  on public.study_diaries for select using (auth.uid() = author_id);

create policy "본인 일기만 작성"
  on public.study_diaries for insert with check (auth.uid() = author_id);

create policy "본인 일기만 수정"
  on public.study_diaries for update using (auth.uid() = author_id);

create policy "본인 일기만 삭제"
  on public.study_diaries for delete using (auth.uid() = author_id);

create trigger study_diaries_updated_at
  before update on public.study_diaries
  for each row execute function public.update_updated_at();
