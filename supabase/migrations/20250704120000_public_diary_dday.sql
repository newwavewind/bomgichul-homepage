-- 수험일기: D-day 기준 공개 피드
alter table public.study_diaries
  add column if not exists days_until_exam int;

-- 기존 데이터: 2026-10-31 시험 기준으로 백필
update public.study_diaries
set days_until_exam = ('2026-10-31'::date - diary_date)
where days_until_exam is null;

alter table public.study_diaries
  alter column days_until_exam set not null;

create index if not exists study_diaries_dday_idx
  on public.study_diaries(days_until_exam, diary_date desc);

-- 공개 조회
drop policy if exists "본인 일기만 조회" on public.study_diaries;
create policy "일기는 누구나 조회 가능"
  on public.study_diaries for select using (true);
