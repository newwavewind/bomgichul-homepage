import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BackLink } from "@/components/ui/BackLink";
import { DailyProgressDashboard } from "@/components/daily/DailyProgressDashboard";
import {
  getDailyCoverage,
  getDailyInsights,
} from "@/lib/daily-challenge/actions";
import { getDailyExam } from "@/lib/daily-challenge/exams";
import { listDailySubjects } from "@/lib/daily-challenge/pool";
import { getUser } from "@/lib/auth";

type Search = Record<string, string | string[] | undefined>;

export function dailyProgressMetadata(slug: string): Metadata {
  const exam = getDailyExam(slug);
  return {
    title: `${exam?.label ?? "기출"} 내 문제 현황 | 봄기출`,
    robots: { index: false, follow: false },
  };
}

export async function DailyProgressPage({
  slug,
  searchParams,
}: {
  slug: string;
  searchParams: Search | Promise<Search>;
}) {
  const exam = getDailyExam(slug);
  if (!exam) notFound();
  const subjects = listDailySubjects(slug);
  const query = await searchParams;
  const requested = Array.isArray(query.subject) ? query.subject[0] : query.subject;
  const subject = subjects.find((item) => item.id === requested) ??
    (subjects.length === 1 ? subjects[0] : null);
  const dailyHref = subject
    ? `/${slug}/daily?subject=${encodeURIComponent(subject.id)}`
    : `/${slug}/daily`;

  return (
    <div className="min-h-[70vh] bg-[linear-gradient(180deg,#F5F9FF_0%,#FFFFFF_42%)] px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <BackLink href={dailyHref}>{exam.label} 매일 10문제</BackLink>
        <header className="mb-6 mt-6">
          <p className="text-sm font-semibold text-[#007AFF]">나의 학습 기록</p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-ink">
            {subject ? `${subject.label} 문제 현황` : "과목별 문제 현황"}
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#64748B]">
            최근 10개년 문제 중 내가 푼 문제와 아직 풀지 않은 문제를 확인하세요.
          </p>
        </header>
        {!subject ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {subjects.map((item) => (
              <Link
                key={item.id}
                href={`/${slug}/daily/progress?subject=${encodeURIComponent(item.id)}`}
                className="rounded-2xl border border-[#DCE8F5] bg-white px-5 py-4 font-semibold text-ink hover:border-[#007AFF]"
              >
                {item.label} <span className="float-right text-[#007AFF]">→</span>
              </Link>
            ))}
          </div>
        ) : (
          <ProgressContent
            slug={slug}
            subjectId={subject.id}
            subjectLabel={subject.label}
          />
        )}
      </div>
    </div>
  );
}

async function ProgressContent({
  slug,
  subjectId,
  subjectLabel,
}: {
  slug: string;
  subjectId: string;
  subjectLabel: string;
}) {
  const user = await getUser();
  if (!user) {
    const next = `/${slug}/daily/progress?subject=${encodeURIComponent(subjectId)}`;
    return (
      <div className="rounded-[28px] border border-[#DCE8F5] bg-white p-6 text-center">
        <h2 className="font-display text-lg font-semibold text-ink">로그인하면 내 풀이 현황을 볼 수 있어요</h2>
        <p className="mt-2 text-sm text-[#64748B]">로그인 상태에서 제출한 기록을 바탕으로 표시합니다.</p>
        <Link
          href={`/login?next=${encodeURIComponent(next)}`}
          className="mt-5 inline-flex rounded-xl bg-[#007AFF] px-5 py-3 text-sm font-semibold text-white"
        >
          로그인하기
        </Link>
      </div>
    );
  }

  const [coverage, insights] = await Promise.all([
    getDailyCoverage(slug, subjectId),
    getDailyInsights(slug, subjectId),
  ]);
  if (!coverage) {
    return (
      <p className="rounded-2xl border border-[#DCE8F5] bg-white p-6 text-sm text-[#475569]">
        학습 현황을 불러오지 못했습니다. 잠시 후 다시 열어주세요.
      </p>
    );
  }
  return (
    <DailyProgressDashboard
      coverage={coverage}
      achievements={insights.achievements}
      exam={slug}
      subjectId={subjectId}
      subjectLabel={subjectLabel}
    />
  );
}
