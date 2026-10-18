"use client";

import { KakaoShareButton } from "@/components/daily/KakaoShareButton";

export type DailyInviteAttempt = {
  attemptId: string;
  correct: number;
  total: number;
  participants: number;
};

export function DailyInviteCard({
  exam,
  label,
  subjectId,
  dateKey,
  attempt,
  inviterNickname = "",
  isPractice = false,
  buttonLabel = "오늘의 10문제 초대하기",
}: {
  exam: string;
  label: string;
  subjectId: string;
  dateKey: string;
  attempt?: DailyInviteAttempt | null;
  inviterNickname?: string;
  isPractice?: boolean;
  buttonLabel?: string;
}) {
  const completedAttempt = !isPractice && attempt?.attemptId ? attempt : null;
  const params = new URLSearchParams({ subject: subjectId });
  if (completedAttempt) {
    params.set("challenge", completedAttempt.attemptId);
  } else if (inviterNickname) {
    params.set("inviter", inviterNickname);
  }
  params.set("utm_source", "kakao");
  params.set("utm_medium", "share");
  params.set("utm_campaign", "daily10");

  const sharePath = `/${exam}/daily?${params.toString()}`;
  const imageParams = new URLSearchParams({
    exam,
    subject: subjectId,
    date: dateKey,
    v: "3",
  });
  const imagePath = `/api/daily-share-card?${imageParams.toString()}`;
  const title = completedAttempt
    ? `${label} 무료 기출 10문제, 몇 개 맞힐까?`
    : inviterNickname
      ? `${inviterNickname}님이 ${label} 무료 기출 10문제에 초대했어요`
      : `${label} 무료 기출 10문제, 같이 풀어요`;
  const description = completedAttempt
    ? `매일 새로운 기출 10문제 · 채점·해설 무료 · 친구 기록 ${completedAttempt.correct}/${completedAttempt.total}${completedAttempt.participants > 0 ? ` · ${completedAttempt.participants}명 참여` : ""}`
    : isPractice
      ? "매일 새로운 기출 10문제 · 채점·해설 무료 · 오늘 순위 참여"
      : `${inviterNickname ? `${inviterNickname}님의 초대 · ` : ""}문제를 풀기 전에도 친구와 공유하고 함께 시작할 수 있어요.`;

  return (
    <section className="rounded-[24px] border border-[#f1dc00] bg-[#fffbea] p-4 shadow-[0_8px_24px_rgba(60,30,30,0.08)]">
      <div className="mb-3 flex items-center gap-3">
        <span
          className="flex size-10 items-center justify-center rounded-2xl bg-[#FEE500] text-[#191919] shadow-sm"
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" className="size-6 fill-current">
            <path d="M12 3C6.48 3 2 6.58 2 11c0 2.82 1.82 5.3 4.57 6.72l-.94 3.46a.55.55 0 0 0 .82.61l4.12-2.73c.47.05.95.08 1.43.08 5.52 0 10-3.58 10-8.14S17.52 3 12 3Z" />
          </svg>
        </span>
        <div>
          <p className="text-sm font-bold text-[#3C1E1E]">
            같이 풀 사람 초대하기
          </p>
          <p className="text-xs text-[#6b5144]">
            {completedAttempt
              ? "내 기록을 보내고 친구와 결과를 비교해 보세요."
              : "정답을 제출하기 전에도 친구와 바로 공유할 수 있어요."}
          </p>
        </div>
      </div>
      <KakaoShareButton
        title={title}
        description={description}
        path={sharePath}
        imagePath={imagePath}
      >
        {buttonLabel}
      </KakaoShareButton>
    </section>
  );
}
