-- 칠판 강의 조회수. 로그인하지 않은 사람도 셀 수 있게 한다.
-- 같은 브라우저(방문자 쿠키)는 12시간에 한 번만 올린다.

create table if not exists public.lecture_stats (
  lecture_id text primary key,
  view_count int not null default 0 check (view_count >= 0),
  updated_at timestamptz not null default now()
);

create table if not exists public.lecture_view_receipts (
  lecture_id text not null,
  viewer_key text not null,
  viewed_at timestamptz not null default now(),
  primary key (lecture_id, viewer_key)
);

alter table public.lecture_stats enable row level security;
alter table public.lecture_view_receipts enable row level security;

drop policy if exists "강의 조회수는 누구나 읽기" on public.lecture_stats;
create policy "강의 조회수는 누구나 읽기"
  on public.lecture_stats for select using (true);

revoke all on public.lecture_view_receipts from public, anon, authenticated;
grant select on public.lecture_stats to anon, authenticated, service_role;

create or replace function public.increment_lecture_view(p_lecture_id text, p_viewer_key text)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  new_count int;
  counted int;
begin
  if p_lecture_id is null or p_lecture_id !~ '^[A-Za-z0-9_-]{3,80}$' then
    raise exception 'invalid lecture id';
  end if;
  if p_viewer_key is null or length(p_viewer_key) < 8 or length(p_viewer_key) > 128 then
    raise exception 'invalid viewer';
  end if;

  insert into public.lecture_view_receipts (lecture_id, viewer_key, viewed_at)
  values (p_lecture_id, p_viewer_key, now())
  on conflict (lecture_id, viewer_key) do update
    set viewed_at = now()
    where public.lecture_view_receipts.viewed_at < now() - interval '12 hours';

  get diagnostics counted = row_count;

  if counted > 0 then
    insert into public.lecture_stats (lecture_id, view_count, updated_at)
    values (p_lecture_id, 1, now())
    on conflict (lecture_id) do update
      set view_count = public.lecture_stats.view_count + 1,
          updated_at = now();
  end if;

  select view_count into new_count
  from public.lecture_stats
  where lecture_id = p_lecture_id;

  return coalesce(new_count, 0);
end;
$$;

revoke all on function public.increment_lecture_view(text, text) from public, anon, authenticated;
grant execute on function public.increment_lecture_view(text, text) to service_role;
