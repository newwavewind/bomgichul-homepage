-- 문제별 개인 메모
create table if not exists public.question_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  subject text not null,
  year int not null,
  question_no int not null,
  content text not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique (user_id, subject, year, question_no)
);

alter table public.question_notes enable row level security;

create policy "본인 메모만 조회"
  on public.question_notes for select using (auth.uid() = user_id);

create policy "본인 메모만 생성"
  on public.question_notes for insert with check (auth.uid() = user_id);

create policy "본인 메모만 수정"
  on public.question_notes for update using (auth.uid() = user_id);

create policy "본인 메모만 삭제"
  on public.question_notes for delete using (auth.uid() = user_id);

create trigger question_notes_updated_at
  before update on public.question_notes
  for each row execute function public.update_updated_at();
