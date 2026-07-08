-- 공인중개사 관련 뉴스 (매일 08시 자동 수집)
create table if not exists public.news_items (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) > 0),
  summary text not null check (char_length(trim(summary)) > 0),
  source_name text not null,
  source_url text not null,
  published_at date not null,
  created_at timestamptz not null default now()
);

create index if not exists news_items_published_created_idx
  on public.news_items (published_at desc, created_at desc);

-- 같은 날 같은 기사 중복 수집 방지
create unique index if not exists news_items_source_url_published_uidx
  on public.news_items (source_url, published_at);

alter table public.news_items enable row level security;

create policy "뉴스는 누구나 조회"
  on public.news_items for select
  using (true);

-- 쓰기는 서비스 롤(크론 잡)만 — 별도 insert/update 정책 없음(RLS 기본 거부)
