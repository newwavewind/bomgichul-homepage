-- 문항별 공개 메모 (누구나 조회, 로그인 후 작성·좋아요·댓글)

create table if not exists public.question_public_memos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  subject text not null,
  year int not null,
  question_no int not null,
  content text not null check (char_length(trim(content)) > 0),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index if not exists question_public_memos_lookup_idx
  on public.question_public_memos (subject, year, question_no, created_at desc);

alter table public.question_public_memos enable row level security;

create policy "공개 메모 누구나 조회"
  on public.question_public_memos for select using (true);

create policy "로그인 사용자 메모 작성"
  on public.question_public_memos for insert
  with check (auth.uid() = user_id);

create policy "본인 메모만 수정"
  on public.question_public_memos for update
  using (auth.uid() = user_id);

create policy "본인 메모만 삭제"
  on public.question_public_memos for delete
  using (auth.uid() = user_id);

create trigger question_public_memos_updated_at
  before update on public.question_public_memos
  for each row execute function public.update_updated_at();

create table if not exists public.question_public_memo_likes (
  memo_id uuid not null references public.question_public_memos(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz default now() not null,
  primary key (memo_id, user_id)
);

alter table public.question_public_memo_likes enable row level security;

create policy "메모 좋아요 누구나 조회"
  on public.question_public_memo_likes for select using (true);

create policy "로그인 사용자 좋아요"
  on public.question_public_memo_likes for insert
  with check (auth.uid() = user_id);

create policy "본인 좋아요만 취소"
  on public.question_public_memo_likes for delete
  using (auth.uid() = user_id);

create table if not exists public.question_public_memo_comments (
  id uuid primary key default gen_random_uuid(),
  memo_id uuid not null references public.question_public_memos(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null check (char_length(trim(content)) > 0),
  created_at timestamptz default now() not null
);

create index if not exists question_public_memo_comments_memo_idx
  on public.question_public_memo_comments (memo_id, created_at asc);

alter table public.question_public_memo_comments enable row level security;

create policy "메모 댓글 누구나 조회"
  on public.question_public_memo_comments for select using (true);

create policy "로그인 사용자 댓글 작성"
  on public.question_public_memo_comments for insert
  with check (auth.uid() = user_id);

create policy "본인 댓글만 삭제"
  on public.question_public_memo_comments for delete
  using (auth.uid() = user_id);
