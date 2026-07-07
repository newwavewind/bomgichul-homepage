-- 봄기출 커뮤니티 DB 스키마
-- Supabase SQL Editor에서 실행하세요.

-- 프로필 (auth.users 확장)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text not null,
  avatar_url text,
  username_set boolean not null default false,
  created_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "프로필은 누구나 조회 가능"
  on public.profiles for select using (true);

create policy "본인 프로필만 수정 가능"
  on public.profiles for update using (auth.uid() = id);

create policy "본인 프로필만 생성 가능"
  on public.profiles for insert with check (auth.uid() = id);

-- 게시글
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  category text not null check (category in ('question', 'resource', 'chat', 'info', 'bug', 'feedback')),
  title text not null,
  content text not null,
  view_count int default 0 not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index posts_category_idx on public.posts(category);
create index posts_created_at_idx on public.posts(created_at desc);

alter table public.posts enable row level security;

create policy "게시글은 누구나 조회 가능"
  on public.posts for select using (true);

create policy "로그인 사용자만 게시글 작성"
  on public.posts for insert with check (auth.uid() = author_id);

create policy "본인 게시글만 수정"
  on public.posts for update using (auth.uid() = author_id);

create policy "본인 게시글만 삭제"
  on public.posts for delete using (auth.uid() = author_id);

-- 댓글
create table public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz default now() not null
);

create index comments_post_id_idx on public.comments(post_id);

alter table public.comments enable row level security;

create policy "댓글은 누구나 조회 가능"
  on public.comments for select using (true);

create policy "로그인 사용자만 댓글 작성"
  on public.comments for insert with check (auth.uid() = author_id);

create policy "본인 댓글만 수정"
  on public.comments for update using (auth.uid() = author_id);

create policy "본인 댓글만 삭제"
  on public.comments for delete using (auth.uid() = author_id);

-- 회원가입 시 프로필 자동 생성 (Google 실명·사진 미사용, 아이디는 onboarding에서 설정)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nickname, avatar_url, username_set)
  values (
    new.id,
    '수험생' || left(replace(new.id::text, '-', ''), 6),
    null,
    false
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- updated_at 자동 갱신
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger posts_updated_at
  before update on public.posts
  for each row execute function public.update_updated_at();

-- 자료실: 첨부파일 + 메타데이터
alter table public.posts
  add column if not exists subject text,
  add column if not exists resource_type text check (
    resource_type is null or resource_type in ('past_exam', 'note', 'summary', 'other')
  );

create index if not exists posts_resource_type_idx on public.posts(resource_type);
create index if not exists posts_subject_idx on public.posts(subject);

create table if not exists public.post_attachments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  file_name text not null,
  file_path text not null,
  file_size bigint not null default 0,
  mime_type text not null default 'application/octet-stream',
  created_at timestamptz default now() not null
);

create index if not exists post_attachments_post_id_idx on public.post_attachments(post_id);

alter table public.post_attachments enable row level security;

create policy "첨부파일은 누구나 조회 가능"
  on public.post_attachments for select using (true);

create policy "로그인 사용자만 첨부파일 등록"
  on public.post_attachments for insert
  with check (
    exists (
      select 1 from public.posts
      where posts.id = post_id and posts.author_id = auth.uid()
    )
  );

create policy "본인 게시글 첨부만 삭제"
  on public.post_attachments for delete
  using (
    exists (
      select 1 from public.posts
      where posts.id = post_id and posts.author_id = auth.uid()
    )
  );

-- Storage: archive public 버킷 (자료실)
insert into storage.buckets (id, name, public)
values ('archive', 'archive', true)
on conflict (id) do update set public = true;

create policy "누구나 archive 파일 조회"
  on storage.objects for select using (bucket_id = 'archive');

create policy "로그인 사용자 archive 업로드"
  on storage.objects for insert
  with check (bucket_id = 'archive' and auth.role() = 'authenticated');

create policy "본인 archive 파일 삭제"
  on storage.objects for delete
  using (bucket_id = 'archive' and auth.uid()::text = (storage.foldername(name))[1]);

-- 수험일기 (D-day 기준 공개, 작성·수정·삭제는 본인만)
create table if not exists public.study_diaries (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  diary_date date not null,
  days_until_exam int not null,
  content text not null,
  mood text check (mood is null or mood in ('great', 'good', 'okay', 'tired', 'hard')),
  study_minutes int default 0 not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique (author_id, diary_date)
);

create index if not exists study_diaries_author_date_idx
  on public.study_diaries(author_id, diary_date desc);

create index if not exists study_diaries_dday_idx
  on public.study_diaries(days_until_exam, diary_date desc);

alter table public.study_diaries enable row level security;

create policy "일기는 누구나 조회 가능"
  on public.study_diaries for select using (true);

create policy "본인 일기만 작성"
  on public.study_diaries for insert with check (auth.uid() = author_id);

create policy "본인 일기만 수정"
  on public.study_diaries for update using (auth.uid() = author_id);

create policy "본인 일기만 삭제"
  on public.study_diaries for delete using (auth.uid() = author_id);

create trigger study_diaries_updated_at
  before update on public.study_diaries
  for each row execute function public.update_updated_at();

-- 기출문제 북마크 (문제 데이터는 정적 JSON에 있어 subject+year+question_no로 식별)
create table if not exists public.question_bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  subject text not null,
  year int not null,
  question_no int not null,
  created_at timestamptz default now() not null,
  unique (user_id, subject, year, question_no)
);

create index if not exists question_bookmarks_user_idx
  on public.question_bookmarks(user_id, created_at desc);

alter table public.question_bookmarks enable row level security;

create policy "본인 북마크만 조회"
  on public.question_bookmarks for select using (auth.uid() = user_id);

create policy "본인 북마크만 생성"
  on public.question_bookmarks for insert with check (auth.uid() = user_id);

create policy "본인 북마크만 삭제"
  on public.question_bookmarks for delete using (auth.uid() = user_id);

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

-- 수험일기 비공개 옵션
alter table public.study_diaries
  add column if not exists is_public boolean not null default true;

drop policy if exists "일기는 누구나 조회 가능" on public.study_diaries;

create policy "공개 일기이거나 본인 일기만 조회"
  on public.study_diaries for select
  using (is_public or auth.uid() = author_id);

-- 댓글 알림 (내 글에 댓글이 달리면 알림 생성)
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  actor_id uuid not null references public.profiles(id) on delete cascade,
  post_id uuid not null references public.posts(id) on delete cascade,
  comment_id uuid references public.comments(id) on delete cascade,
  type text not null default 'comment' check (type in ('comment')),
  read_at timestamptz,
  created_at timestamptz default now() not null
);

create index if not exists notifications_recipient_idx
  on public.notifications(recipient_id, created_at desc);

alter table public.notifications enable row level security;

create policy "본인 알림만 조회"
  on public.notifications for select using (auth.uid() = recipient_id);

create policy "본인이 행위자인 알림만 생성"
  on public.notifications for insert
  with check (auth.uid() = actor_id and actor_id <> recipient_id);

create policy "본인 알림만 읽음 처리"
  on public.notifications for update
  using (auth.uid() = recipient_id)
  with check (auth.uid() = recipient_id);

-- 과목별 프리미엄 잠금해제 코드
-- 모바일 앱 인앱결제로 발급된 코드를 PC 웹에서 계정에 연동해 해당 과목만 해제한다.
create table if not exists public.premium_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  subject text not null check (
    subject in (
      'civillaw', 'realestate', 'broker-law',
      'registry-law', 'realestate-tax', 'realestate-public-law'
    )
  ),
  redeemed_by uuid references public.profiles(id) on delete set null,
  redeemed_at timestamptz,
  created_at timestamptz default now() not null
);

alter table public.premium_codes enable row level security;
-- 클라이언트는 이 테이블에 직접 접근하지 않고 redeem_premium_code() 함수로만 사용한다.

-- 사용자별 과목 프리미엄 해제 기록
create table if not exists public.subject_unlocks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  subject text not null,
  unlocked_at timestamptz default now() not null,
  unique (user_id, subject)
);

create index if not exists subject_unlocks_user_idx on public.subject_unlocks(user_id);

alter table public.subject_unlocks enable row level security;

create policy "본인 해제기록만 조회"
  on public.subject_unlocks for select using (auth.uid() = user_id);

-- 코드 검증 + 해제를 원자적으로 처리 (premium_codes는 이 함수를 통해서만 갱신됨)
create or replace function public.redeem_premium_code(p_code text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_subject text;
begin
  if auth.uid() is null then
    raise exception 'NOT_AUTHENTICATED';
  end if;

  update public.premium_codes
  set redeemed_by = auth.uid(), redeemed_at = now()
  where code = upper(trim(p_code))
    and redeemed_by is null
  returning subject into v_subject;

  if v_subject is null then
    raise exception 'INVALID_OR_USED_CODE';
  end if;

  insert into public.subject_unlocks (user_id, subject)
  values (auth.uid(), v_subject)
  on conflict (user_id, subject) do nothing;

  return v_subject;
end;
$$;

grant execute on function public.redeem_premium_code(text) to authenticated;
