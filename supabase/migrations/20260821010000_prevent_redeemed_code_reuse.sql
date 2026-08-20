-- 회원 탈퇴로 redeemed_by가 null이 되어도 이미 사용된 학습권 코드는 재사용하지 못한다.
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
    and redeemed_at is null
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
