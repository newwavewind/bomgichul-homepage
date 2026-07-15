-- 개념 상세 「모두의 개념」: 개념/암기 팁 공유 · 댓글 · 좋아요 · 추천 · 조회수

create table if not exists public.concept_community_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  subject text not null,
  concept_slug text not null,
  content text not null check (char_length(trim(content)) > 0 and char_length(content) <= 4000),
  view_count int not null default 0 check (view_count >= 0),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index if not exists concept_community_posts_lookup_idx
  on public.concept_community_posts (subject, concept_slug, created_at desc);

alter table public.concept_community_posts enable row level security;

create policy "모두의 개념 누구나 조회"
  on public.concept_community_posts for select using (true);

create policy "로그인 사용자 모두의 개념 작성"
  on public.concept_community_posts for insert
  with check (auth.uid() = user_id);

create policy "본인 모두의 개념만 수정"
  on public.concept_community_posts for update
  using (auth.uid() = user_id);

create policy "본인 모두의 개념만 삭제"
  on public.concept_community_posts for delete
  using (auth.uid() = user_id);

create trigger concept_community_posts_updated_at
  before update on public.concept_community_posts
  for each row execute function public.update_updated_at();

create table if not exists public.concept_community_post_likes (
  post_id uuid not null references public.concept_community_posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz default now() not null,
  primary key (post_id, user_id)
);

alter table public.concept_community_post_likes enable row level security;

create policy "모두의 개념 좋아요 누구나 조회"
  on public.concept_community_post_likes for select using (true);

create policy "로그인 사용자 모두의 개념 좋아요"
  on public.concept_community_post_likes for insert
  with check (auth.uid() = user_id);

create policy "본인 모두의 개념 좋아요만 취소"
  on public.concept_community_post_likes for delete
  using (auth.uid() = user_id);

create table if not exists public.concept_community_post_recommends (
  post_id uuid not null references public.concept_community_posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz default now() not null,
  primary key (post_id, user_id)
);

alter table public.concept_community_post_recommends enable row level security;

create policy "모두의 개념 추천 누구나 조회"
  on public.concept_community_post_recommends for select using (true);

create policy "로그인 사용자 모두의 개념 추천"
  on public.concept_community_post_recommends for insert
  with check (auth.uid() = user_id);

create policy "본인 모두의 개념 추천만 취소"
  on public.concept_community_post_recommends for delete
  using (auth.uid() = user_id);

create table if not exists public.concept_community_post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.concept_community_posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null check (char_length(trim(content)) > 0 and char_length(content) <= 1000),
  created_at timestamptz default now() not null
);

create index if not exists concept_community_post_comments_post_idx
  on public.concept_community_post_comments (post_id, created_at asc);

alter table public.concept_community_post_comments enable row level security;

create policy "모두의 개념 댓글 누구나 조회"
  on public.concept_community_post_comments for select using (true);

create policy "로그인 사용자 모두의 개념 댓글 작성"
  on public.concept_community_post_comments for insert
  with check (auth.uid() = user_id);

create policy "본인 모두의 개념 댓글만 삭제"
  on public.concept_community_post_comments for delete
  using (auth.uid() = user_id);

-- 조회수 +1 (누구나 호출 가능)
create or replace function public.increment_concept_community_post_view(p_post_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.concept_community_posts
  set view_count = view_count + 1
  where id = p_post_id;
end;
$$;

revoke all on function public.increment_concept_community_post_view(uuid) from public;
grant execute on function public.increment_concept_community_post_view(uuid) to anon, authenticated;
