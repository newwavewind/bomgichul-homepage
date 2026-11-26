create table public.english_wordbook_rank_answers (
  user_id uuid not null references public.profiles(id) on delete cascade,
  session_id uuid not null,
  position integer not null check (position between 1 and 10000),
  word_id text not null,
  is_correct boolean not null,
  study_date date not null default (now() at time zone 'Asia/Seoul')::date,
  primary key (user_id, session_id, position),
  unique (user_id, session_id, word_id)
);

create index english_wordbook_rank_answers_day
  on public.english_wordbook_rank_answers (study_date, user_id)
  where is_correct;

alter table public.english_wordbook_rank_answers enable row level security;
revoke all on public.english_wordbook_rank_answers from public, anon, authenticated;
grant select, insert on public.english_wordbook_rank_answers to service_role;

create function public.english_wordbook_board(p_day date, p_viewer uuid)
returns table (
  rank bigint,
  nickname text,
  score bigint,
  best_combo bigint,
  is_me boolean
)
language sql stable security invoker
set search_path = ''
as $$
  with correct as (
    select a.user_id, a.study_date, a.word_id, a.session_id,
           a.position - row_number() over (
             partition by a.user_id, a.study_date, a.session_id order by a.position
           ) as run
    from public.english_wordbook_rank_answers a
    where a.is_correct and (p_day is null or a.study_date = p_day)
  ),
  streaks as (
    select user_id, count(*) as length
    from correct
    group by user_id, study_date, session_id, run
  ),
  best as (
    select user_id, max(length) as best_combo from streaks group by user_id
  ),
  scores as (
    select user_id, count(distinct (study_date, word_id)) as score
    from correct
    group by user_id
  ),
  ordered as (
    select rank() over (order by s.score desc, b.best_combo desc) as rank,
           row_number() over (order by s.score desc, b.best_combo desc, s.user_id) as row_no,
           p.nickname, s.score, b.best_combo, coalesce(s.user_id = p_viewer, false) as is_me
    from scores s
    join best b on b.user_id = s.user_id
    join public.profiles p on p.id = s.user_id and p.username_set
  )
  select r.rank, r.nickname, r.score, r.best_combo, r.is_me
  from ordered r
  where r.row_no <= 100 or r.is_me
  order by r.row_no
$$;

revoke all on function public.english_wordbook_board(date, uuid) from public, anon, authenticated;
grant execute on function public.english_wordbook_board(date, uuid) to service_role;
