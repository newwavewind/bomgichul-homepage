-- 모두의 개념 이미지 스토리지

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'concept-community',
  'concept-community',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "누구나 모두의 개념 이미지 조회" on storage.objects;
create policy "누구나 모두의 개념 이미지 조회"
  on storage.objects for select
  using (bucket_id = 'concept-community');

drop policy if exists "로그인 사용자 모두의 개념 이미지 업로드" on storage.objects;
create policy "로그인 사용자 모두의 개념 이미지 업로드"
  on storage.objects for insert
  with check (
    bucket_id = 'concept-community'
    and auth.role() = 'authenticated'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "본인 모두의 개념 이미지 삭제" on storage.objects;
create policy "본인 모두의 개념 이미지 삭제"
  on storage.objects for delete
  using (
    bucket_id = 'concept-community'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- HTML 본문 길이 여유
alter table public.concept_community_posts
  drop constraint if exists concept_community_posts_content_check;

alter table public.concept_community_posts
  add constraint concept_community_posts_content_check
  check (char_length(trim(content)) > 0 and char_length(content) <= 20000);
