-- 새 친구 추가는 상대방 승인 없이 즉시 완료됩니다.
alter table public.friendships
  alter column status set default 'accepted';
