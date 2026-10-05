import type { Metadata } from "next";
import Link from "next/link";
import { EyebrowLabel, SectionHeading } from "@/components/ui/Typography";
import {
  PUBLISHER_BUSINESS_NUMBER,
  PUBLISHER_CONTACT_EMAIL,
  PUBLISHER_LEGAL_NAME,
  SITE_NAME,
} from "@/lib/constants";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "문의하기",
  description:
    "봄기출 문의 안내. 기출·해설 오류 제보, 서비스 이용 문의, 개인정보 관련 요청을 이메일로 받습니다.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="px-4 py-8 md:py-12">
      <div className="mx-auto max-w-[var(--page-max-width)]">
        <div className="mx-auto max-w-2xl">
          <EyebrowLabel className="mb-2">CONTACT</EyebrowLabel>
          <SectionHeading as="h1">문의하기</SectionHeading>
          <p className="mt-4 font-display text-body leading-relaxed text-smoke">
            {SITE_NAME} 이용·콘텐츠·개인정보에 관한 문의는 아래 이메일로 받습니다.
            앱·커뮤니티의 문항 오류 신고는 해당 시험 게시판에도 남길 수 있습니다.
          </p>

          <section className="mt-10 rounded-[var(--radius-cards)] border border-mist bg-paper px-5 py-6">
            <h2 className="font-display text-subheading font-semibold text-ink">
              이메일 문의
            </h2>
            <p className="mt-2 font-display text-body-sm leading-relaxed text-smoke">
              회신 가능한 주소와, 관련 시험·연도·문항 번호를 함께 적어 주시면 더
              빠르게 확인할 수 있습니다.
            </p>
            <p className="mt-4 font-display text-[15px] font-semibold text-ink">
              <a
                href={`mailto:${PUBLISHER_CONTACT_EMAIL}?subject=${encodeURIComponent(
                  "[봄기출] 문의",
                )}`}
                className="underline underline-offset-2 hover:text-carbon"
              >
                {PUBLISHER_CONTACT_EMAIL}
              </a>
            </p>
          </section>

          <section className="mt-10">
            <h2 className="mb-3 font-display text-subheading font-semibold text-ink">
              이런 내용을 받습니다
            </h2>
            <ul className="list-disc space-y-1.5 pl-5 font-display text-body-sm leading-relaxed text-smoke">
              <li>기출 해설·개념 오류 제보와 수정 요청</li>
              <li>홈페이지·앱 이용 중 발생한 장애나 계정 문의</li>
              <li>개인정보 열람·정정·삭제 등 권리 행사 요청</li>
              <li>광고·제휴·사업 제휴 관련 일반 문의</li>
            </ul>
          </section>

          <section className="mt-10">
            <h2 className="mb-3 font-display text-subheading font-semibold text-ink">
              운영 정보
            </h2>
            <ul className="list-disc space-y-1.5 pl-5 font-display text-body-sm leading-relaxed text-smoke">
              <li>상호: {PUBLISHER_LEGAL_NAME}</li>
              <li>사업자등록번호: {PUBLISHER_BUSINESS_NUMBER}</li>
              <li>
                사이트 소개:{" "}
                <Link href="/about" className="underline underline-offset-2 hover:text-ink">
                  /about
                </Link>
              </li>
              <li>
                개인정보처리방침:{" "}
                <Link href="/privacy" className="underline underline-offset-2 hover:text-ink">
                  /privacy
                </Link>
              </li>
              <li>
                이용약관:{" "}
                <Link href="/terms" className="underline underline-offset-2 hover:text-ink">
                  /terms
                </Link>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
