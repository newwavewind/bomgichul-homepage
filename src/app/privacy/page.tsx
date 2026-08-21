import type { Metadata } from "next";
import { EyebrowLabel, SectionHeading } from "@/components/ui/Typography";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "개인정보처리방침",
  description:
    "봄기출 개인정보처리방침. 수집 항목, 이용 목적, 보유 기간, 제3자 제공, 이용자 권리 및 보호책임자를 안내합니다.",
  path: "/privacy",
});

const SECTIONS: { title: string; body: string[]; bullets?: string[] }[] = [
  {
    title: "1. 수집하는 개인정보 항목",
    body: [],
    bullets: [
      "Google 로그인 및 회원 관리: 이메일 주소, 인증 제공자 식별값, 공개 아이디(닉네임), 프로필 정보",
      "학습 서비스: 북마크, 오답·응시 기록, 메모, 학습 분석 및 등록한 학습권 정보",
      "커뮤니티: 이용자가 작성한 게시글·댓글·채팅과 업로드 파일",
      "앱 구매 및 인증 관련: 기기 식별자, 구매 내역",
      "서비스 이용 과정에서 자동으로 생성되는 정보: 접속 로그, 이용 기록",
    ],
  },
  {
    title: "2. 개인정보의 수집 및 이용 목적",
    body: [],
    bullets: [
      "회원 식별, 로그인 및 프로필 관리",
      "학습 기록 저장, 오답·복습 및 학습 분석 제공",
      "커뮤니티와 회원 간 소통 기능 제공",
      "앱 내 유료 콘텐츠 구매 및 이용 권한 확인",
      "PC 학습 서비스 접근 코드 발급 및 인증",
      "서비스 개선 및 문의 응대",
    ],
  },
  {
    title: "3. 개인정보의 보유 및 이용기간",
    body: [
      "회사는 이용자의 개인정보를 원칙적으로 개인정보의 수집 및 이용목적이 달성되면 지체 없이 파기합니다. 단, 관계법령에 따라 보존할 필요가 있는 경우 해당 기간 동안 보관합니다.",
    ],
  },
  {
    title: "4. 개인정보의 제3자 제공",
    body: [
      "회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만 법령에 의거하거나 수사기관의 요청이 있는 경우는 예외로 합니다.",
    ],
  },
  {
    title: "5. AI 해설 기능",
    body: [
      "앱의 AI 해설을 이용하면, 답변을 만들기 위해 해당 문항과 보기, 봄기출이 만든 해설, 그리고 이용자가 추가로 입력한 질문이 외부 AI 서비스(Google, OpenAI)로 전달됩니다.",
      "만들어진 해설은 해설 품질을 다듬기 위해 보관됩니다. 이때 기기 식별자와 이용자가 입력한 질문은 함께 저장하지 않으므로, 보관된 해설은 특정 이용자와 연결되지 않습니다.",
    ],
  },
  {
    title: "6. 이용자의 권리",
    body: [
      "이용자는 언제든지 등록되어 있는 자신의 개인정보를 조회·수정할 수 있습니다. 로그인 후 프로필의 '회원 탈퇴'에서 계정과 관련 개인정보를 직접 삭제할 수 있으며, 직접 처리가 어려운 경우 개인정보 보호책임자 이메일로 삭제를 요청할 수 있습니다.",
    ],
  },
  {
    title: "7. 개인정보 보호책임자",
    body: [],
    bullets: ["담당자: 김상현", "이메일: rotkdgus5@naver.com"],
  },
  {
    title: "8. 시행일자",
    body: [
      "이 개인정보처리방침은 2026년 7월 14일부터 시행되었으며, AI 해설 기능에 관한 내용을 더해 2026년 8월 22일 개정되었습니다.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="px-4 py-8 md:py-12">
      <div className="mx-auto max-w-[var(--page-max-width)]">
        <div className="mx-auto max-w-2xl">
          <EyebrowLabel className="mb-2">LEGAL</EyebrowLabel>
          <SectionHeading as="h1">개인정보처리방침</SectionHeading>
          <p className="mt-4 font-display text-body leading-relaxed text-smoke">
            봄기출(사업자등록번호: 381-03-03800, 이하 &apos;회사&apos;)은 이용자의 개인정보를
            중요시하며, 「개인정보 보호법」 등 관련 법령을 준수합니다.
          </p>

          <div className="mt-10 space-y-8">
            {SECTIONS.map((section) => (
              <section key={section.title}>
                <h2 className="mb-3 font-display text-subheading font-semibold text-ink">
                  {section.title}
                </h2>
                {section.body.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="font-display text-body-sm leading-relaxed text-smoke"
                  >
                    {paragraph}
                  </p>
                ))}
                {section.bullets ? (
                  <ul className="mt-2 list-disc space-y-1.5 pl-5 font-display text-body-sm leading-relaxed text-smoke">
                    {section.bullets.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
