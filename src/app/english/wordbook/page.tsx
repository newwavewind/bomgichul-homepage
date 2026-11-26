import Link from "next/link";
import { BackLink } from "@/components/ui/BackLink";
import { EnglishWordbook } from "@/components/english/EnglishWordbook";
import { getUser } from "@/lib/auth";
import { buildPageMetadata } from "@/lib/seo";
import "@/components/english/english-study.css";

export const metadata = buildPageMetadata({
  title: "공무원 영어 기출 단어장",
  description: "9급 국가직과 지방직 영어 기출의 단어와 숙어를 예문, 카드 퀴즈와 함께 학습하세요.",
  path: "/english/wordbook",
});

export default async function Page() {
  const user = await getUser();
  return (
    <section className="es-page">
      <BackLink href="/english">공무원 영어</BackLink>
      <header className="es-heading">
        <div>
          <h1>기출 단어장</h1>
          <p>국가직·지방직 기출 예문을 확인하고, 단어와 뜻을 카드로 연습하세요.</p>
        </div>
        <Link className="es-button" href="/english/concepts/gong9/practice">구문 암기 연습</Link>
      </header>
      <EnglishWordbook rankAccess={user?.usernameSet ? "ready" : user ? "profile" : "login"} />
    </section>
  );
}
