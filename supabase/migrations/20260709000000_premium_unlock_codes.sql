-- 과목별 프리미엄 잠금해제 코드
-- 모바일 앱 인앱결제로 발급된 코드를 PC 웹에서 계정에 연동해 해당 과목만 해제한다.
create table if not exists public.premium_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  subject text not null check (
    subject in (
      'civillaw', 'realestate', 'broker-law',
      'registry-law', 'realestate-tax', 'realestate-public-law'
    )
  ),
  redeemed_by uuid references public.profiles(id) on delete set null,
  redeemed_at timestamptz,
  created_at timestamptz default now() not null
);

alter table public.premium_codes enable row level security;
-- 클라이언트는 이 테이블에 직접 접근하지 않고 redeem_premium_code() 함수로만 사용한다.
-- (select/insert/update 정책을 두지 않아 anon/authenticated 모두 직접 접근 불가)

-- 사용자별 과목 프리미엄 해제 기록
create table if not exists public.subject_unlocks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  subject text not null,
  unlocked_at timestamptz default now() not null,
  unique (user_id, subject)
);

create index if not exists subject_unlocks_user_idx on public.subject_unlocks(user_id);

alter table public.subject_unlocks enable row level security;

create policy "본인 해제기록만 조회"
  on public.subject_unlocks for select using (auth.uid() = user_id);

-- 코드 검증 + 해제를 원자적으로 처리 (premium_codes는 이 함수를 통해서만 갱신됨)
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
