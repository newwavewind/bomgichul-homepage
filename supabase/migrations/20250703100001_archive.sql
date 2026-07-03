-- 자료실: 첨부파일 + 메타데이터
-- Supabase SQL Editor에서 schema.sql 실행 후 이 파일도 실행하세요.

alter table public.posts
  add column if not exists subject text,
  add column if not exists resource_type text check (
    resource_type is null or resource_type in ('past_exam', 'note', 'summary', 'other')
  );

create index if not exists posts_resource_type_idx on public.posts(resource_type);
create index if not exists posts_subject_idx on public.posts(subject);

-- 첨부파일
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

-- Storage bucket (Supabase Dashboard > Storage에서 'archive' 버킷 생성 후 아래 정책 적용)
-- insert into storage.buckets (id, name, public) values ('archive', 'archive', true);

-- storage policies (bucket 생성 후 실행):
-- create policy "누구나 archive 파일 조회"
--   on storage.objects for select using (bucket_id = 'archive');
-- create policy "로그인 사용자 archive 업로드"
--   on storage.objects for insert with check (bucket_id = 'archive' and auth.role() = 'authenticated');
-- create policy "본인 archive 파일 삭제"
--   on storage.objects for delete using (bucket_id = 'archive' and auth.uid()::text = (storage.foldername(name))[1]);
