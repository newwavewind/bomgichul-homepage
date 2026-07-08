import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EyebrowLabel, SectionHeading } from "@/components/ui/Typography";
import { ElevatedCard } from "@/components/ui/Card";
import { PrimaryButton } from "@/components/ui/Button";
import { EXAM_SUBJECTS, ARCHIVE_SUBJECT_MAP, PC_APP_URL, SITE_NAME } from "@/lib/constants";
import {
  getExamYearParams,
  getExamQuestionsForYear,
  type ExamSubject,
} from "@/lib/exam-questions";
import { getUser } from "@/lib/auth";
import { isSubjectUnlocked } from "@/lib/premium";
import { PdfDownloadButton } from "@/components/exam/PdfDownloadButton";
import { MockExamHistory } from "@/components/exam/MockExamHistory";
import { getMockExamSessions } from "@/lib/mock-exam-sessions";

const VALID_SUBJECTS = EXAM_SUBJECTS.map((s) => s.value);

function isValidSubject(value: string): value is ExamSubject {
  return (VALID_SUBJECTS as string[]).includes(value);
}

interface ExamYearPageProps {
  params: Promise<{ subject: string; year: string }>;
}

export function generateStaticParams() {
  return getExamYearParams();
}

export async function generateMetadata({
  params,
}: ExamYearPageProps): Promise<Metadata> {
  const { subject, year } = await params;
  if (!isValidSubject(subject)) return {};

  const label = ARCHIVE_SUBJECT_MAP[subject];
  const title = `${year}년 ${label} 기출문제 해설`;
  const description = `${year}년 공인중개사 ${label} 기출문제 전체 문항의 정답과 해설을 확인하세요.`;

  return {
    title,
    description,
    openGraph: { title: `${title} | ${SITE_NAME}`, description },
  };
}

export default async function ExamYearPage({ params }: ExamYearPageProps) {
  const { subject, year: yearParam } = await params;
  if (!isValidSubject(subject)) notFound();

  const year = Number(yearParam);
  const label = ARCHIVE_SUBJECT_MAP[subject];
  const questions = getExamQuestionsForYear(subject, year);
  if (questions.length === 0) notFound();

  const user = await getUser();
  const unlocked = user ? await isSubjectUnlocked(user.id, subject) : false;
  const free = questions[0].free || unlocked;
  const mockSessions =
    user && unlocked ? await getMockExamSessions(user.id, subject, year) : [];

  return (
    <div className="px-4 py-8 md:py-12">
      <div className="mx-auto max-w-[var(--page-max-width)]">
        <Link
          href={`/exam/${subject}`}
          className="mb-4 inline-block font-display text-body-sm text-fog transition-colors hover:text-ink"
        >
          ← {label} 목록으로
        </Link>

        <p className="mb-4 font-display text-body-sm text-fog">
          <Link href="/exam" className="hover:text-ink">
            기출문제 해설
          </Link>{" "}
          /{" "}
          <Link href={`/exam/${subject}`} className="hover:text-ink">
            {label}
          </Link>{" "}
          / {year}년
        </p>

        <div className="mb-10">
          <EyebrowLabel className="mb-2">{year}년 기출</EyebrowLabel>
          <SectionHeading as="h1">
            {year}년 {label} 기출문제 해설
          </SectionHeading>
          <p className="mt-3 max-w-2xl font-display text-body text-smoke">
            문항을 선택하면 정답과 해설을 볼 수 있어요.
          </p>

          <div className="mt-6 flex flex-wrap items-start gap-3">
            <Link
              href={`/exam/${subject}/${year}/mock`}
              className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-buttons)] border-[1.5px] border-carbon bg-[#6366f1] px-5 py-2 font-display text-body-sm font-medium text-paper shadow-[var(--shadow-button)] transition-opacity hover:opacity-90"
            >
              📝 시험 모드
            </Link>
            <PdfDownloadButton
              subject={subject}
              subjectLabel={label}
              year={year}
              unlocked={unlocked}
            />
          </div>
        </div>

        {unlocked && <MockExamHistory sessions={mockSessions} />}

        {!free && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-cards)] border-[1.5px] border-carbon bg-ice px-5 py-4">
            <p className="font-display text-body-sm text-ink">
              {year}년 기출은 앱 프리미엄 문항이에요. 전체 해설은 앱에서 확인하거나, 이미 구매하셨다면{" "}
              <Link href={`/exam/${subject}#unlock`} className="font-medium underline">
                코드를 등록
              </Link>
              해 보세요.
            </p>
            <PrimaryButton href={PC_APP_URL}>앱에서 전체 보기</PrimaryButton>
          </div>
        )}

        <ElevatedCard className="overflow-hidden">
          {questions.map((q) => (
            <Link
              key={q.questionNo}
              href={`/exam/${subject}/${year}/${q.questionNo}`}
              className="flex items-center gap-3 border-b border-mist/60 px-5 py-3.5 transition-colors last:border-b-0 hover:bg-snow"
            >
              <span className="shrink-0 font-display text-body-sm font-semibold text-electric-blue">
                {q.questionNo}번
              </span>
              <span className="min-w-0 flex-1 truncate font-display text-body-sm text-ink">
                {q.stem}
              </span>
            </Link>
          ))}
        </ElevatedCard>
      </div>
    </div>
  );
}
