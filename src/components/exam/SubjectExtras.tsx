"use client";

import { useEffect, useState } from "react";
import { useMe } from "@/lib/client-session";

/**
 * 과목 페이지의 개인화 숫자(북마크 수·메모 수)를 클라이언트에서 얻는 훅.
 *
 * 복습 PDF 단추와 북마크 타일이 같은 숫자를 쓰므로, 과목당 한 번만
 * 왕복하도록 진행 중인 프로미스를 모듈 수준에서 나눠 쓴다. 프로미스는
 * 끝나면 비워서, 페이지를 다시 방문하면(클라이언트 내비게이션 포함)
 * 새로 센 숫자를 받는다 — 북마크를 막 추가하고 돌아온 경우를 위해서다.
 */

export interface SubjectExtras {
  bookmarkCount: number;
  noteCount: number;
}

const ZERO: SubjectExtras = { bookmarkCount: 0, noteCount: 0 };

const inflightBySubject = new Map<string, Promise<SubjectExtras>>();

function fetchSubjectExtras(subject: string): Promise<SubjectExtras> {
  let promise = inflightBySubject.get(subject);
  if (!promise) {
    promise = fetch(
      `/api/exam/subject-extras?subject=${encodeURIComponent(subject)}`,
      { cache: "no-store" },
    )
      .then(async (res) => {
        if (!res.ok) throw new Error(String(res.status));
        const data = (await res.json()) as Partial<SubjectExtras>;
        return {
          bookmarkCount: Number(data.bookmarkCount) || 0,
          noteCount: Number(data.noteCount) || 0,
        };
      })
      .catch(() => ZERO); // 조회 실패는 비로그인과 같은 겉모습(0)으로 그린다.
    inflightBySubject.set(subject, promise);
    void promise.finally(() => {
      inflightBySubject.delete(subject);
    });
  }
  return promise;
}

export function useSubjectExtras(
  subject: string,
): { pending: boolean } & SubjectExtras {
  const me = useMe();
  const [state, setState] = useState<{ pending: boolean } & SubjectExtras>({
    pending: true,
    ...ZERO,
  });

  const userId = me.user?.id ?? null;

  useEffect(() => {
    if (me.pending) return;
    if (!userId) {
      // 비로그인은 서버까지 갈 것 없이 0 — 지금과 같은 겉모습.
      setState({ pending: false, ...ZERO });
      return;
    }
    let alive = true;
    void fetchSubjectExtras(subject).then((extras) => {
      if (alive) setState({ pending: false, ...extras });
    });
    return () => {
      alive = false;
    };
  }, [subject, me.pending, userId]);

  return state;
}

/**
 * 「★ 북마크」 타일 옆의 개수 표시. 서버 렌더에서는 비우고(정적 본문),
 * 로그인 사용자에게만 숫자가 뒤따라 붙는다 — 예전 서버 렌더와 같은 겉모습.
 */
export function SubjectBookmarkCount({ subject }: { subject: string }) {
  const { pending, bookmarkCount } = useSubjectExtras(subject);
  if (pending || bookmarkCount === 0) return null;
  return <> ({bookmarkCount})</>;
}
