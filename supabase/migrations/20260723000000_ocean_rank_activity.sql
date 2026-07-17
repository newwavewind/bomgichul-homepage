-- 바다 레벨 활동 점수
-- 일일 출석 +1, 게시글 +2, 모두의 개념 +3, 댓글 +1, 받은 좋아요 +2

create table if not exists public.user_daily_logins (
  user_id uuid not null references public.profiles(id) on delete cascade,
  login_date date not null default ((now() at time zone 'Asia/Seoul')::date),
  created_at timestamptz not null default now(),
  primary key (user_id, login_date)
);

alter table public.user_daily_logins enable row level security;

create policy "본인 로그인 기록만 조회"
  on public.user_daily_logins for select
  using (auth.uid() = user_id);

create table if not exists public.post_likes (
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create index if not exists post_likes_user_idx
  on public.post_likes (user_id);

alter table public.post_likes enable row level security;

create policy "게시글 좋아요 누구나 조회"
  on public.post_likes for select using (true);

create policy "로그인 사용자 게시글 좋아요"
  on public.post_likes for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.posts p
      where p.id = post_id and p.author_id <> auth.uid()
    )
  );

create policy "본인 게시글 좋아요만 취소"
  on public.post_likes for delete
  using (auth.uid() = user_id);

create table if not exists public.comment_likes (
  comment_id uuid not null references public.comments(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (comment_id, user_id)
);

create index if not exists comment_likes_user_idx
  on public.comment_likes (user_id);

create index if not exists ocean_rank_posts_author_idx on public.posts (author_id);
create index if not exists ocean_rank_comments_author_idx on public.comments (author_id);
create index if not exists ocean_rank_concept_posts_user_idx on public.concept_community_posts (user_id);
create index if not exists ocean_rank_concept_comments_user_idx on public.concept_community_post_comments (user_id);
create index if not exists ocean_rank_memos_user_idx on public.question_public_memos (user_id);
create index if not exists ocean_rank_memo_comments_user_idx on public.question_public_memo_comments (user_id);

alter table public.comment_likes enable row level security;

create policy "댓글 좋아요 누구나 조회"
  on public.comment_likes for select using (true);

create policy "로그인 사용자 댓글 좋아요"
  on public.comment_likes for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.comments c
      where c.id = comment_id and c.author_id <> auth.uid()
    )
  );

create policy "본인 댓글 좋아요만 취소"
  on public.comment_likes for delete
  using (auth.uid() = user_id);

create or replace function public.record_daily_login()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  me uuid := auth.uid();
begin
  if me is null then
    raise exception '로그인이 필요합니다';
  end if;

  insert into public.user_daily_logins (user_id, login_date)
  values (me, (now() at time zone 'Asia/Seoul')::date)
  on conflict (user_id, login_date) do nothing;
end;
$$;

revoke all on function public.record_daily_login() from public;
grant execute on function public.record_daily_login() to authenticated;

create or replace function public.get_user_activity_scores(target_user_ids uuid[])
returns table (
  user_id uuid,
  login_days bigint,
  post_count bigint,
  comment_count bigint,
  likes_received bigint,
  score bigint
)
language sql
stable
security definer
set search_path = public
as $$
  with requested as (
    select distinct unnest(target_user_ids[1:100]) as user_id
  ),
  login_totals as (
    select l.user_id, count(*)::bigint as count
    from public.user_daily_logins l
    join requested r on r.user_id = l.user_id
    group by l.user_id
  ),
  all_posts as (
    select p.author_id as user_id, 2::bigint as points
    from public.posts p join requested r on r.user_id = p.author_id
    union all
    select p.user_id, 3::bigint
    from public.concept_community_posts p join requested r on r.user_id = p.user_id
    union all
    select m.user_id, 2::bigint
    from public.question_public_memos m join requested r on r.user_id = m.user_id
  ),
  post_totals as (
    select p.user_id, count(*)::bigint as count, sum(p.points)::bigint as score
    from all_posts p group by p.user_id
  ),
  all_comments as (
    select c.author_id as user_id from public.comments c join requested r on r.user_id = c.author_id
    union all
    select c.user_id from public.concept_community_post_comments c join requested r on r.user_id = c.user_id
    union all
    select c.user_id from public.question_public_memo_comments c join requested r on r.user_id = c.user_id
  ),
  comment_totals as (
    select c.user_id, count(*)::bigint as count from all_comments c group by c.user_id
  ),
  all_received_likes as (
    select p.author_id as user_id
    from public.post_likes l
    join public.posts p on p.id = l.post_id
    join requested r on r.user_id = p.author_id
    union all
    select c.author_id
    from public.comment_likes l
    join public.comments c on c.id = l.comment_id
    join requested r on r.user_id = c.author_id
    union all
    select p.user_id
    from public.concept_community_post_likes l
    join public.concept_community_posts p on p.id = l.post_id
    join requested r on r.user_id = p.user_id
    where l.user_id <> p.user_id
    union all
    select m.user_id
    from public.question_public_memo_likes l
    join public.question_public_memos m on m.id = l.memo_id
    join requested r on r.user_id = m.user_id
    where l.user_id <> m.user_id
  ),
  like_totals as (
    select l.user_id, count(*)::bigint as count from all_received_likes l group by l.user_id
  )
  select
    r.user_id,
    coalesce(ld.count, 0)::bigint as login_days,
    coalesce(pt.count, 0)::bigint as post_count,
    coalesce(ct.count, 0)::bigint as comment_count,
    coalesce(lt.count, 0)::bigint as likes_received,
    (
      coalesce(ld.count, 0)
      + coalesce(pt.score, 0)
      + coalesce(ct.count, 0)
      + coalesce(lt.count, 0) * 2
    )::bigint as score
  from requested r
  left join login_totals ld on ld.user_id = r.user_id
  left join post_totals pt on pt.user_id = r.user_id
  left join comment_totals ct on ct.user_id = r.user_id
  left join like_totals lt on lt.user_id = r.user_id;
$$;

revoke all on function public.get_user_activity_scores(uuid[]) from public;
grant execute on function public.get_user_activity_scores(uuid[]) to anon, authenticated;

create or replace function public.get_community_like_state(
  target_post_id uuid,
  target_comment_ids uuid[]
)
returns table (
  target_type text,
  target_id uuid,
  like_count bigint,
  liked_by_viewer boolean
)
language sql
stable
security definer
set search_path = public
as $$
  select
    'post'::text,
    target_post_id,
    count(l.user_id)::bigint,
    coalesce(bool_or(l.user_id = auth.uid()), false)
  from (select 1) seed
  left join public.post_likes l on l.post_id = target_post_id
  union all
  select
    'comment'::text,
    ids.id,
    count(l.user_id)::bigint,
    coalesce(bool_or(l.user_id = auth.uid()), false)
  from (
    select distinct unnest(target_comment_ids[1:100]) as id
  ) ids
  left join public.comment_likes l on l.comment_id = ids.id
  group by ids.id;
$$;

revoke all on function public.get_community_like_state(uuid, uuid[]) from public;
grant execute on function public.get_community_like_state(uuid, uuid[]) to anon, authenticated;

-- 기존 개념/메모 좋아요도 자기 콘텐츠에는 새로 누를 수 없게 통일합니다.
drop policy if exists "로그인 사용자 모두의 개념 좋아요" on public.concept_community_post_likes;
create policy "로그인 사용자 모두의 개념 좋아요"
  on public.concept_community_post_likes for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.concept_community_posts p
      where p.id = post_id and p.user_id <> auth.uid()
    )
  );

drop policy if exists "로그인 사용자 좋아요" on public.question_public_memo_likes;
create policy "로그인 사용자 좋아요"
  on public.question_public_memo_likes for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.question_public_memos m
      where m.id = memo_id and m.user_id <> auth.uid()
    )
  );
