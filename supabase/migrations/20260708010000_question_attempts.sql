-- 오답노트: 사용자가 정답 확인 후 스스로 맞았는지/틀렸는지 기록
create table if not exists public.question_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  subject text not null,
  year int not null,
  question_no int not null,
  result text not null check (result in ('correct', 'wrong')),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique (user_id, subject, year, question_no)
);

create index if not exists question_attempts_user_wrong_idx
  on public.question_attempts(user_id, result, updated_at desc);

alter table public.question_attempts enable row level security;

create policy "본인 기록만 조회"
  on public.question_attempts for select using (auth.uid() = user_id);

create policy "본인 기록만 생성"
  on public.question_attempts for insert with check (auth.uid() = user_id);

create policy "본인 기록만 수정"
  on public.question_attempts for update using (auth.uid() = user_id);

create policy "본인 기록만 삭제"
  on public.question_attempts for delete using (auth.uid() = user_id);

create trigger question_attempts_updated_at
  before update on public.question_attempts
  for each row execute function public.update_updated_at();
