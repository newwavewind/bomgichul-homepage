-- Allow authors to edit reply text while preserving ownership and thread placement.
revoke update on public.question_public_memo_comments from public, anon, authenticated;
grant update (content) on public.question_public_memo_comments to authenticated;

create policy "본인 댓글만 수정"
  on public.question_public_memo_comments for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
