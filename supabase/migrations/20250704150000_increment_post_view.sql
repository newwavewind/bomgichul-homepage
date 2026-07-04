-- 로그인 없이 조회수 증가 (피드백·오류신고 글 포함)
create or replace function public.increment_post_view(post_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.posts
  set view_count = view_count + 1
  where id = post_id;
end;
$$;

grant execute on function public.increment_post_view(uuid) to anon, authenticated;
