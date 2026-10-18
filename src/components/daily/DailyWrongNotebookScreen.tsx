import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BackLink } from "@/components/ui/BackLink";
import { DailyWrongNotebookDashboard } from "@/components/daily/DailyWrongNotebookDashboard";
import { getDailyWrongNotebook } from "@/lib/daily-challenge/actions";
import { getDailyExam } from "@/lib/daily-challenge/exams";
import { listDailySubjects } from "@/lib/daily-challenge/pool";
import { getUser } from "@/lib/auth";

type Search = Record<string, string | string[] | undefined>;

export function dailyWrongNotebookMetadata(slug: string): Metadata {
  const exam = getDailyExam(slug);
  return {
    title: `${exam?.label ?? "기출"} 특별한 오답노트 | 봄기출`,
    description: "매일 10문제에서 틀린 문제를 자동 분류하고 복습하는 개인 오답노트입니다.",
    robots: { index: false, follow: false },
  };
}

export async function DailyWrongNotebookPage({
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
    <div className="min-h-[78vh] bg-white px-4 pb-28 pt-8 text-black sm:px-6 sm:pt-12">
      <main className="mx-auto max-w-[1200px]">
        <BackLink href={dailyHref}>{exam.label} 매일 10문제</BackLink>

        <header className="pb-12 pt-14 sm:pb-16 sm:pt-20">
          <p className="font-mono text-xs tracking-[0.05em] text-[#595959]">
            PERSONAL REVIEW ARCHIVE / {exam.label.toUpperCase()}
          </p>
          <h1 className="mt-5 max-w-[920px] text-[clamp(42px,7vw,72px)] font-light leading-[1.06] tracking-[-0.02em] text-black">
            매일 10문제,
            <br className="sm:hidden" /> 특별한 오답노트
          </h1>
          <p className="mt-7 max-w-2xl text-lg font-normal leading-[1.4] tracking-[-0.01em] text-[#595959]">
            틀린 문제는 자동으로 모이고, 다시 맞힌 기록은 복습의 순서가 됩니다.
            필요한 문제와 메모를 한곳에서 이어가세요.
          </p>
        </header>

        {!subject ? (
          <section aria-labelledby="subject-heading">
            <div className="mb-8 flex items-end justify-between gap-6">
              <h2 id="subject-heading" className="text-2xl font-normal tracking-[-0.01em]">
                과목을 선택하세요
              </h2>
              <span className="font-mono text-xs tracking-[0.05em] text-[#595959]">
                {subjects.length} SUBJECTS
              </span>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {subjects.map((item, index) => (
                <Link
                  key={item.id}
                  href={`/${slug}/daily/wrong?subject=${encodeURIComponent(item.id)}`}
                  className="group min-h-44 rounded-2xl border border-black/10 bg-white p-6 transition-colors hover:border-black"
                >
                  <span className="font-mono text-xs tracking-[0.05em] text-[#595959]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="mt-14 flex items-end justify-between gap-4 text-lg font-medium tracking-[-0.01em]">
                    {item.label}
                    <span className="transition-transform group-hover:translate-x-1" aria-hidden>→</span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ) : (
          <WrongNotebookContent
            slug={slug}
            subjectId={subject.id}
            subjectLabel={subject.label}
          />
        )}
      </main>
    </div>
  );
}

async function WrongNotebookContent({
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
    const next = `/${slug}/daily/wrong?subject=${encodeURIComponent(subjectId)}`;
    return (
      <section className="relative isolate min-h-[480px] overflow-hidden py-10 sm:py-16" aria-labelledby="login-heading">
        <div className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden>
          <div className="absolute left-[2%] top-16 w-64 -rotate-6 rounded-2xl bg-[#e4ff97] p-6">
            <p className="font-mono text-xs tracking-[0.05em]">AUTO COLLECT</p>
            <p className="mt-14 text-2xl font-light">틀린 문제만<br />한곳으로.</p>
          </div>
          <div className="absolute right-[3%] top-4 w-60 rotate-[7deg] rounded-2xl bg-[#c4baff] p-6">
            <p className="font-mono text-xs tracking-[0.05em]">REVIEW FLOW</p>
            <div className="mt-12 flex gap-3">
              <span className="size-4 rounded-full bg-black" />
              <span className="size-4 rounded-full border border-black" />
              <span className="size-4 rounded-full border border-black" />
            </div>
          </div>
          <div className="absolute bottom-4 left-[8%] w-56 rotate-3 rounded-2xl bg-[#ffc9c1] p-6">
            <p className="font-mono text-xs tracking-[0.05em]">PRIVATE NOTE</p>
            <div className="mt-10 h-px bg-black/40" />
            <div className="mt-3 h-px w-3/4 bg-black/40" />
          </div>
          <div className="absolute bottom-10 right-[8%] w-64 -rotate-3 rounded-2xl bg-[#c7f8fb] p-6">
            <p className="font-mono text-xs tracking-[0.05em]">YOUR ARCHIVE</p>
            <p className="mt-12 text-lg font-normal">기록은 사라지지 않습니다.</p>
          </div>
        </div>

        <div className="relative z-10 mx-auto max-w-[680px] rounded-2xl bg-white p-6 shadow-[0_24px_70px_rgba(0,0,0,0.1)] sm:p-10 lg:p-12">
          <span className="inline-flex rounded-lg bg-[#e2e2e2] px-3 py-2 font-mono text-xs tracking-[0.05em] text-black">
            FREE · SIGN IN REQUIRED
          </span>
          <h2 id="login-heading" className="mt-8 text-[clamp(34px,5vw,56px)] font-light leading-[1.1] tracking-[-0.02em]">
            내 오답의 흐름을
            <br />계속 이어가세요.
          </h2>
          <p className="mt-6 max-w-xl text-lg font-normal leading-[1.4] tracking-[-0.01em] text-[#595959]">
            로그인하면 {subjectLabel}에서 틀린 문제가 자동으로 쌓입니다.
            반복 오답, 다시 맞힌 문제, 내 메모를 나만의 기록으로 안전하게 보관합니다.
          </p>
          <div className="mt-8 grid gap-px overflow-hidden rounded-2xl bg-[#e2e2e2] sm:grid-cols-3">
            {["틀린 문제 자동 수집", "복습 순서 자동 정리", "나만 보는 개인 메모"].map((label, index) => (
              <div key={label} className="bg-white p-5">
                <p className="font-mono text-xs tracking-[0.05em] text-[#595959]">0{index + 1}</p>
                <p className="mt-5 text-base font-normal">{label}</p>
              </div>
            ))}
          </div>
          <Link
            href={`/login?next=${encodeURIComponent(next)}`}
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-[50px] bg-[#4d49fc] px-6 text-base font-medium text-white transition-transform hover:-translate-y-0.5"
          >
            무료로 로그인하고 시작하기
          </Link>
        </div>
      </section>
    );
  }

  const notebook = await getDailyWrongNotebook(slug, subjectId);
  if (!notebook) return null;
  return (
    <DailyWrongNotebookDashboard
      notebook={notebook}
      exam={slug}
      subjectId={subjectId}
      subjectLabel={subjectLabel}
    />
  );
}
