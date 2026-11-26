import Link from "next/link";
import { BackLink } from "@/components/ui/BackLink";
import { EnglishSyntaxPractice } from "@/components/english/EnglishSyntaxPractice";
import { findSyntaxPracticeCard, getSyntaxPractice, getSyntaxPracticeDay } from "@/lib/english-study-data";
import { buildPageMetadata } from "@/lib/seo";
import "@/components/english/english-study.css";

export const metadata = buildPageMetadata({
  title: "공무원 영어 구문 올인원 암기 연습",
  description: "영어 기출 문장을 끊어 읽으며 덩이별 해석을 한 단계씩 확인하세요.",
  path: "/english/concepts/gong9/practice",
});

export default async function Page({ searchParams }: { searchParams: Promise<{ card?: string | string[] }> }) {
  const { card: requested } = await searchParams;
  const entry = typeof requested === "string" && requested.length <= 100 ? await findSyntaxPracticeCard(requested) : null;
  const initialDay = entry?.day ?? 1;
  const [cards, firstDay] = await Promise.all([getSyntaxPractice(), getSyntaxPracticeDay(initialDay)]);
  return (
    <section className="es-page">
      <BackLink href="/english">공무원 영어</BackLink>
      <header className="es-heading">
        <div>
          <p className="es-kicker">구문 올인원</p>
          <h1>암기 연습</h1>
          <p>{cards.length.toLocaleString("ko-KR")}개 기출 문장을 30일로 나눠, 한 덩이씩 읽고 뜻을 확인하세요.</p>
        </div>
        <Link className="es-button" href="/english/concepts/gong9">구문별 문장 해설</Link>
      </header>
      <EnglishSyntaxPractice key={entry?.card.id ?? "resume"} firstDay={firstDay} initialDay={initialDay} initialCardId={entry?.card.id} />
    </section>
  );
}
