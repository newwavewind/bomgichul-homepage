-- 매일 10문제 결과의 공개 글. 출제 날짜가 아닌 원본 문항 ID에 연결한다.
create table if not exists public.daily_question_comments (
  id uuid primary key default gen_random_uuid(),
  question_id text not null check (char_length(question_id) between 1 and 300),
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null check (char_length(trim(content)) between 1 and 1000),
  created_at timestamptz not null default now()
);

create index if not exists daily_question_comments_question_created_idx
  on public.daily_question_comments (question_id, created_at desc, id desc);
create index if not exists daily_question_comments_user_idx
  on public.daily_question_comments (user_id);

alter table public.daily_question_comments enable row level security;

create policy "매일 문항 글 누구나 조회"
  on public.daily_question_comments for select
  to anon, authenticated using (true);

create policy "로그인 사용자 매일 문항 글 작성"
  on public.daily_question_comments for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
    and coalesce((select auth.jwt()->>'is_anonymous'), 'false') <> 'true'
  );

create policy "본인 매일 문항 글 삭제"
  on public.daily_question_comments for delete
  to authenticated using ((select auth.uid()) = user_id);

grant select on public.daily_question_comments to anon;
grant select, insert, delete on public.daily_question_comments to authenticated;
