create or replace function public.is_profile_admin(p_user_id uuid)
returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.admin_users where user_id=p_user_id);
$$;
revoke all on function public.is_profile_admin(uuid) from public;
grant execute on function public.is_profile_admin(uuid) to authenticated;
