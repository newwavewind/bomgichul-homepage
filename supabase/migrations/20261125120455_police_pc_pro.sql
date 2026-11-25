-- A QR request belongs to the web account and authenticated session that issued it.
create table public.police_pc_requests (
  token_hash text primary key check (token_hash ~ '^[a-f0-9]{64}$'),
  user_id uuid not null references auth.users(id) on delete cascade,
  session_id uuid not null,
  account_label text not null,
  subject text not null check (subject in ('constitution', 'criminal-law', 'police-science')),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  attempts integer not null default 0,
  verified_purchase jsonb,
  completed_at timestamptz
);
create index police_pc_requests_by_session on public.police_pc_requests (user_id, session_id);
create index police_pc_requests_expiration on public.police_pc_requests (expires_at);
create index police_pc_requests_rate_limit on public.police_pc_requests (user_id, created_at);

create table public.police_pc_purchases (
  purchase_key text primary key check (purchase_key ~ '^[a-f0-9]{64}$'),
  user_id uuid references auth.users(id) on delete set null,
  subject text not null check (subject in ('constitution', 'criminal-law', 'police-science')),
  platform text not null check (platform in ('ios', 'android')),
  proof text not null,
  linked_at timestamptz not null default now(),
  checked_at timestamptz not null default now(),
  revoked_at timestamptz
);
create index police_pc_purchases_by_user on public.police_pc_purchases (user_id, subject)
  where revoked_at is null;

alter table public.police_pc_requests enable row level security;
alter table public.police_pc_purchases enable row level security;
revoke all on public.police_pc_requests, public.police_pc_purchases from public, anon, authenticated;
grant select, insert, update, delete on public.police_pc_requests to service_role;
grant select, insert, update, delete on public.police_pc_purchases to service_role;

create function public.start_police_pc_request(
  p_hash text, p_user uuid, p_session uuid, p_label text, p_subject text
) returns timestamptz language plpgsql security invoker set search_path = '' as $$
declare
  deadline timestamptz := now() + interval '2 minutes';
begin
  perform pg_advisory_xact_lock(hashtextextended(p_user::text, 814));
  delete from public.police_pc_requests where expires_at < now() - interval '15 minutes';
  if (select count(*) from public.police_pc_requests where user_id = p_user and created_at > now() - interval '10 minutes') >= 12 then
    return null;
  end if;
  update public.police_pc_requests set expires_at = now(), verified_purchase = null
    where user_id = p_user and session_id = p_session and completed_at is null and expires_at > now();
  insert into public.police_pc_requests (token_hash, user_id, session_id, account_label, subject, expires_at)
    values (p_hash, p_user, p_session, p_label, p_subject, deadline);
  return deadline;
end
$$;

create function public.reserve_police_pc_verification(p_hash text, p_subject text)
returns boolean language plpgsql security invoker set search_path = '' as $$
begin
  update public.police_pc_requests set attempts = attempts + 1
    where token_hash = p_hash and subject = p_subject and completed_at is null
      and expires_at > now() and verified_purchase is null and attempts < 4;
  return found;
end
$$;

-- Recheck the originating session, consume the request, and assign the purchase atomically.
create function public.finish_police_pc_request(p_hash text, p_user uuid, p_session uuid)
returns text language plpgsql security invoker set search_path = '' as $$
declare
  pending public.police_pc_requests%rowtype;
  linked public.police_pc_purchases%rowtype;
begin
  select * into pending from public.police_pc_requests
    where token_hash = p_hash and user_id = p_user and session_id = p_session for update;
  if not found then return 'invalid'; end if;
  if pending.completed_at is not null then return 'linked'; end if;
  if pending.expires_at <= now() then return 'invalid'; end if;
  if pending.verified_purchase is null then return 'waiting'; end if;
  insert into public.police_pc_purchases (purchase_key, user_id, subject, platform, proof)
    values (pending.verified_purchase->>'key', p_user, pending.subject,
      pending.verified_purchase->>'platform', pending.verified_purchase->>'proof')
    on conflict (purchase_key) do nothing;
  select * into linked from public.police_pc_purchases
    where purchase_key = pending.verified_purchase->>'key' for update;
  if linked.user_id is distinct from p_user or linked.subject is distinct from pending.subject then
    update public.police_pc_requests set expires_at = now(), verified_purchase = null where token_hash = p_hash;
    return 'conflict';
  end if;
  -- An already-linked purchase can be verified again after a store refund reversal.
  update public.police_pc_purchases
    set checked_at = now(), revoked_at = null, proof = pending.verified_purchase->>'proof'
    where purchase_key = linked.purchase_key;
  update public.police_pc_requests set completed_at = now(), verified_purchase = null where token_hash = p_hash;
  return 'linked';
end
$$;

revoke execute on function public.start_police_pc_request(text, uuid, uuid, text, text) from public, anon, authenticated;
revoke execute on function public.reserve_police_pc_verification(text, text) from public, anon, authenticated;
revoke execute on function public.finish_police_pc_request(text, uuid, uuid) from public, anon, authenticated;
grant execute on function public.start_police_pc_request(text, uuid, uuid, text, text),
  public.reserve_police_pc_verification(text, text), public.finish_police_pc_request(text, uuid, uuid) to service_role;
