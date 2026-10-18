-- Private notes and pins for the signed-in daily ten-question wrong-answer notebook.
create table if not exists public.daily_wrong_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  exam_slug text not null,
  subject_id text not null,
  question_id text not null,
  note text not null default '' check (char_length(note) <= 1200),
  pinned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, exam_slug, subject_id, question_id)
);

create index if not exists daily_wrong_notes_owner_subject_idx
  on public.daily_wrong_notes (user_id, exam_slug, subject_id, pinned desc, updated_at desc);

alter table public.daily_wrong_notes enable row level security;

revoke all on table public.daily_wrong_notes from anon;
grant select, insert, update, delete on table public.daily_wrong_notes to authenticated;

create policy "본인 특별한 오답 메모 조회"
  on public.daily_wrong_notes for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "본인 특별한 오답 메모 생성"
  on public.daily_wrong_notes for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "본인 특별한 오답 메모 수정"
  on public.daily_wrong_notes for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "본인 특별한 오답 메모 삭제"
  on public.daily_wrong_notes for delete
  to authenticated
  using ((select auth.uid()) = user_id);

create trigger daily_wrong_notes_updated_at
  before update on public.daily_wrong_notes
  for each row execute function public.update_updated_at();
