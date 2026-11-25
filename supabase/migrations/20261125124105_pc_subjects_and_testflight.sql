alter table public.police_pc_requests
  drop constraint police_pc_requests_subject_check,
  add constraint police_pc_requests_subject_check check (subject in ('constitution','criminal-law','police-science','realestate','civillaw','broker-law','registry-law','realestate-tax','realestate-public-law'));

alter table public.police_pc_purchases
  drop constraint police_pc_purchases_subject_check,
  add constraint police_pc_purchases_subject_check check (subject in ('constitution','criminal-law','police-science','realestate','civillaw','broker-law','registry-law','realestate-tax','realestate-public-law')),
  add column purchase_environment text not null default 'production' check (purchase_environment in ('production','sandbox')),
  add column test_expires_at timestamptz,
  add constraint police_pc_purchases_test_expiry_check check (
    (purchase_environment = 'production' and test_expires_at is null) or
    (purchase_environment = 'sandbox' and platform = 'ios' and test_expires_at is not null)
  );

create or replace function public.finish_police_pc_request(p_hash text, p_user uuid, p_session uuid)
returns text language plpgsql security invoker set search_path = '' as $$
declare
  pending public.police_pc_requests%rowtype;
  linked public.police_pc_purchases%rowtype;
  purchase_env text;
  test_deadline timestamptz;
begin
  select * into pending from public.police_pc_requests
    where token_hash = p_hash and user_id = p_user and session_id = p_session for update;
  if not found then return 'invalid'; end if;
  if pending.completed_at is not null then return 'linked'; end if;
  if pending.expires_at <= now() then return 'invalid'; end if;
  if pending.verified_purchase is null then return 'waiting'; end if;
  purchase_env := coalesce(pending.verified_purchase->>'environment', 'production');
  test_deadline := case when purchase_env = 'sandbox' then now() + interval '24 hours' end;
  insert into public.police_pc_purchases
    (purchase_key, user_id, subject, platform, proof, purchase_environment, test_expires_at)
    values (pending.verified_purchase->>'key', p_user, pending.subject,
      pending.verified_purchase->>'platform', pending.verified_purchase->>'proof', purchase_env, test_deadline)
    on conflict (purchase_key) do nothing;
  select * into linked from public.police_pc_purchases
    where purchase_key = pending.verified_purchase->>'key' for update;
  if linked.user_id is distinct from p_user or linked.subject is distinct from pending.subject
       or linked.purchase_environment is distinct from purchase_env then
    update public.police_pc_requests set expires_at = now(), verified_purchase = null where token_hash = p_hash;
    return 'conflict';
  end if;
  -- An already-linked purchase can be verified again after a store refund reversal.
  update public.police_pc_purchases
    set checked_at = now(), revoked_at = null, proof = pending.verified_purchase->>'proof', test_expires_at = test_deadline
    where purchase_key = linked.purchase_key;
  update public.police_pc_requests set completed_at = now(), verified_purchase = null where token_hash = p_hash;
  return 'linked';
end
$$;
