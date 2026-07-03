-- 자료실 Storage 버킷 + 정책
insert into storage.buckets (id, name, public)
values ('archive', 'archive', true)
on conflict (id) do update set public = true;

create policy "누구나 archive 파일 조회"
  on storage.objects for select
  using (bucket_id = 'archive');

create policy "로그인 사용자 archive 업로드"
  on storage.objects for insert
  with check (bucket_id = 'archive' and auth.role() = 'authenticated');

create policy "본인 archive 파일 삭제"
  on storage.objects for delete
  using (bucket_id = 'archive' and auth.uid()::text = (storage.foldername(name))[1]);
