-- 관리자 게시글 삭제 권한 + 앱 제보 테스트 글 정리

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

create policy "관리자는 모든 게시글 삭제 가능"
  on public.posts for delete
  using (public.is_admin());

-- 앱 오류신고·피드백 테스트 글 정리
delete from public.posts
where category in ('bug', 'feedback');
