import type { Metadata } from "next";
import Link from "next/link";
import { ExamPrintPicker } from "@/components/exam/ExamPrintPicker";
import { BackLink } from "@/components/ui/BackLink";
import { ARCHIVE_SUBJECT_MAP } from "@/lib/constants";
import { examPrintOptions, hasExamPrintEditions } from "@/lib/exam-print";
import police from "@/data/police/manifest.json";
import publicService from "@/data/public-service/manifest.json";
import firefighter from "@/data/firefighter/manifest.json";
import housing from "@/data/housing/manifest.json";
import socialWorker from "@/data/social-worker/manifest.json";
import history from "@/data/history/manifest.json";
import english from "@/data/english/manifest.json";
import gugeo from "@/data/gugeo/manifest.json";
import haengjeongsa from "@/data/haengjeongsa/manifest.json";
import semusa from "@/data/semusa/manifest.json";
import sanan from "@/data/sanan/manifest.json";
import sonhae from "@/data/sonhae/manifest.json";
import nomusa from "@/data/nomusa/manifest.json";
import gyeongbi from "@/data/gyeongbi/manifest.json";
import gamjeong from "@/data/gamjeong/manifest.json";
import mullyu from "@/data/mullyu/manifest.json";
import youth from "@/data/youth/manifest.json";

export const metadata: Metadata = { title: "기출문제·해설 출력" };

const tracks = [
  ["public-service", "공무원", publicService],
  ["real-estate", "공인중개사", []],
  ["police", "경찰공무원", police],
  ["firefighter", "소방공무원", firefighter],
  ["housing", "주택관리사", housing],
  ["social-worker", "사회복지사 1급", socialWorker],
  ["history", "한국사능력검정", history],
  ["english", "공무원 영어", english],
  ["gugeo", "공무원 국어", gugeo],
  ["haengjeongsa", "행정사", haengjeongsa],
  ["semusa", "세무사", semusa],
  ["sanan", "산업안전지도사", sanan],
  ["sonhae", "손해평가사", sonhae],
  ["nomusa", "공인노무사", nomusa],
  ["gyeongbi", "경비지도사", gyeongbi],
  ["gamjeong", "감정평가사", gamjeong],
  ["mullyu", "물류관리사", mullyu],
  ["youth", "청소년상담사", youth],
] as const;

export default async function PrintExamsPage({
  searchParams,
}: {
  searchParams: Promise<{ exam?: string | string[] }>;
}) {
  const { exam } = await searchParams;
  const available = tracks.filter(([id]) => hasExamPrintEditions(id));
  const selected = available.find(([id]) => id === exam);
  const editions = selected ? examPrintOptions(selected[0]).map((entry) => {
    const subject = selected[2].find(({ id }) => id === entry.subject);
    const label = subject?.label ?? ARCHIVE_SUBJECT_MAP[entry.subject] ?? entry.subject;
    return { ...entry, subjectLabel: selected[0] === "youth" && subject ? `${subject.track} · ${label}` : label };
  }) : [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      <BackLink href="/#exam-selection">시험 목록</BackLink>
      <h1 className="mt-6 font-display text-heading font-bold text-ink">
        {selected ? `${selected[1]} 기출문제·해설 출력` : "기출문제·해설 출력"}
      </h1>
      <p className="mb-6 mt-2 text-sm text-fog">공식 시험지, 정답표, 번호별 해설을 한 PDF로 출력할 수 있어요.</p>
      {selected ? (
        <ExamPrintPicker key={selected[0]} editions={editions} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {available.map(([id, title]) => (
            <Link key={id} href={`/print-exams?exam=${id}`} className="rounded-xl border border-mist bg-paper px-4 py-3 font-display font-semibold text-ink hover:border-ios-blue">
              {title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
