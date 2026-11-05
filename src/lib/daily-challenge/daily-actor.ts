import { AsyncLocalStorage } from "node:async_hooks";

/**
 * 앱이 보낸 사람.
 * 로그인이면 id가 계정이고, 이름만 적었으면 guestIdentity(nick:…)로 홈페이지와 같은 순위에 올린다.
 */
export type DailyActor = {
  id: string;
  nickname: string;
  guestIdentity?: string;
};

const store = new AsyncLocalStorage<DailyActor>();

export function currentDailyActor() {
  return store.getStore() ?? null;
}

export function withDailyActor<T>(actor: DailyActor, run: () => Promise<T>) {
  return store.run(actor, run);
}
