"use client";

import { useEffect, useState } from "react";
import type { MockExamSession } from "@/types/database";
import { useMe } from "@/lib/client-session";
import { MockExamHistory } from "@/components/exam/MockExamHistory";

/**
 * 「시험 모드 기록」을 클라이언트에서 받아 그리는 껍데기.
 *
 * 연도 페이지가 서버에서 getUser() 로 세션을 읽으면 쿠키 때문에 전체가
 * 동적 렌더로 떨어지므로, 기록은 로그인 사용자에게만 여기서 뒤따라 묻는다.
 * 비로그인·세션 0이면 지금처럼 아무것도 그리지 않는다(빈 목록 → null).
 */
export function MockExamHistoryLoader({
  subject,
  year,
}: {
  subject: string;
  year: number;
}) {
  const me = useMe();
  const userId = me.user?.id ?? null;
  const [sessions, setSessions] = useState<MockExamSession[]>([]);

  useEffect(() => {
    if (me.pending) return;
    if (!userId) {
      setSessions([]);
      return;
    }
    let alive = true;
    void fetch(
      `/api/mock-exam-sessions?subject=${encodeURIComponent(subject)}&year=${year}`,
      { cache: "no-store" },
    )
      .then(async (res) => {
        if (!res.ok) throw new Error(String(res.status));
        const data = (await res.json()) as { sessions?: MockExamSession[] };
        if (alive) setSessions(Array.isArray(data.sessions) ? data.sessions : []);
      })
      .catch(() => {
        /* 조회 실패는 기록 없음과 같은 겉모습 — 아무것도 그리지 않는다 */
      });
    return () => {
      alive = false;
    };
  }, [subject, year, me.pending, userId]);

  return <MockExamHistory sessions={sessions} />;
}
