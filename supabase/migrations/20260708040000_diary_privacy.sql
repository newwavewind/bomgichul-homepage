-- 수험일기 비공개 옵션
alter table public.study_diaries
  add column if not exists is_public boolean not null default true;

drop policy if exists "일기는 누구나 조회 가능" on public.study_diaries;

create policy "공개 일기이거나 본인 일기만 조회"
  on public.study_diaries for select
  using (is_public or auth.uid() = author_id);
