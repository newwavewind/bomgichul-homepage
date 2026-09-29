-- Instant-friend UX: ensure pair becomes accepted (pending leftovers broke 「친구 추가」)

create or replace function public.ensure_friendship(p_other_user_id uuid)
returns public.friendships
language plpgsql
security definer
set search_path = public
as $$
declare
  me uuid := auth.uid();
  row public.friendships;
begin
  if me is null then
    raise exception 'not authenticated';
  end if;
  if p_other_user_id is null or p_other_user_id = me then
    raise exception 'invalid friend';
  end if;

  select * into row
  from public.friendships f
  where (f.requester_id = me and f.addressee_id = p_other_user_id)
     or (f.requester_id = p_other_user_id and f.addressee_id = me)
  limit 1;

  if found then
    if row.status is distinct from 'accepted' then
      update public.friendships
      set status = 'accepted',
          accepted_at = coalesce(accepted_at, now())
      where id = row.id
      returning * into row;
    end if;
    return row;
  end if;

  insert into public.friendships (requester_id, addressee_id, status, accepted_at)
  values (me, p_other_user_id, 'accepted', now())
  returning * into row;
  return row;
end;
$$;

revoke all on function public.ensure_friendship(uuid) from public;
grant execute on function public.ensure_friendship(uuid) to authenticated;

-- Product rule is no-approval; heal leftover pending rows
update public.friendships
set status = 'accepted',
    accepted_at = coalesce(accepted_at, now())
where status = 'pending';
