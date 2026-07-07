-- 기출문제 북마크
-- 문제 데이터는 DB가 아닌 정적 JSON(src/data/exam-questions)에 있으므로
-- subject + year + question_no 조합으로 문제를 식별합니다.

create table if not exists public.question_bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  subject text not null,
  year int not null,
  question_no int not null,
  created_at timestamptz default now() not null,
  unique (user_id, subject, year, question_no)
);

create index if not exists question_bookmarks_user_idx
  on public.question_bookmarks(user_id, created_at desc);

alter table public.question_bookmarks enable row level security;

create policy "본인 북마크만 조회"
  on public.question_bookmarks for select using (auth.uid() = user_id);

create policy "본인 북마크만 생성"
  on public.question_bookmarks for insert with check (auth.uid() = user_id);

create policy "본인 북마크만 삭제"
  on public.question_bookmarks for delete using (auth.uid() = user_id);
