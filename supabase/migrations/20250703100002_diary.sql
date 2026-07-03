-- 수험일기
-- Supabase SQL Editor에서 schema.sql 실행 후 이 파일도 실행하세요.

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
