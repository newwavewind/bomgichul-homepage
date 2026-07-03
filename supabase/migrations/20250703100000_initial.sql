-- 초기 스키마: profiles, posts, comments, triggers
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
