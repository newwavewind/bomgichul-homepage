-- 익명 아이디(username) 필수 — Google 실명·사진 사용 금지
alter table public.profiles
  add column if not exists username_set boolean not null default false;

-- 기존 회원도 아이디를 다시 설정하도록 임시 닉네임으로 교체
update public.profiles
set
  nickname = '수험생' || left(replace(id::text, '-', ''), 6),
  avatar_url = null,
  username_set = false;

create unique index if not exists profiles_nickname_lower_uidx
  on public.profiles (lower(nickname));

-- 신규 가입: Google 이름/사진 무시, 임시 아이디만 부여
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nickname, avatar_url, username_set)
  values (
    new.id,
    '수험생' || left(replace(new.id::text, '-', ''), 6),
    null,
    false
  );
  return new;
end;
$$ language plpgsql security definer;
