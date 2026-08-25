import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";
import { EyebrowLabel, SectionHeading } from "@/components/ui/Typography";
import { ROBOTS_NOINDEX } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: ROBOTS_NOINDEX,
  title: "관리자",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

  return (
    <div className="px-3 py-5 sm:px-4 sm:py-8 md:py-12">
      <div className="mx-auto max-w-[var(--page-max-width)]">
        <div className="mb-6 sm:mb-8">
          <EyebrowLabel className="mb-2">운영 전용</EyebrowLabel>
          <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-4">
            <SectionHeading as="h1" className="mb-0 text-heading-sm sm:text-heading">
              관리자
            </SectionHeading>
            <p className="font-display text-[13px] text-smoke sm:text-body-sm">
              {user.email} · {user.nickname || "관리자"}
              {user.id === "preview-admin" ? (
                <span className="ml-2 text-fog">(로컬 미리보기 · 로그인 생략)</span>
              ) : null}
            </p>
          </div>
          <p className="mt-2 font-display text-[13px] leading-relaxed text-fog sm:text-body-sm">
            일반 회원에게는 이 메뉴가 보이지 않습니다.{" "}
            <Link href="/" className="text-electric-blue hover:underline">
              사이트로 돌아가기
            </Link>
          </p>
        </div>

        <div className="mb-6 sm:mb-8">
          <AdminNav />
        </div>

        {children}
      </div>
    </div>
  );
}
