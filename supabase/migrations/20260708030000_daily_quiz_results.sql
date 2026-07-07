-- 일일 기출 O/X 퀴즈 결과 (연속 참여 스트릭 계산용)
create table if not exists public.daily_quiz_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  quiz_date date not null,
  total int not null,
  correct int not null,
  created_at timestamptz default now() not null,
  unique (user_id, quiz_date)
);

create index if not exists daily_quiz_results_user_date_idx
  on public.daily_quiz_results(user_id, quiz_date desc);

alter table public.daily_quiz_results enable row level security;

create policy "본인 퀴즈결과만 조회"
  on public.daily_quiz_results for select using (auth.uid() = user_id);

create policy "본인 퀴즈결과만 생성"
  on public.daily_quiz_results for insert with check (auth.uid() = user_id);

create policy "본인 퀴즈결과만 수정"
  on public.daily_quiz_results for update using (auth.uid() = user_id);
