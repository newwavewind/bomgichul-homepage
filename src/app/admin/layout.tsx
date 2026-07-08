import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";
import { EyebrowLabel, SectionHeading } from "@/components/ui/Typography";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

  return (
    <div className="px-4 py-8 md:py-12">
      <div className="mx-auto max-w-[var(--page-max-width)]">
        <div className="mb-8">
          <EyebrowLabel className="mb-2">운영 전용</EyebrowLabel>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading as="h1" className="mb-0">
              관리자
            </SectionHeading>
            <p className="font-display text-body-sm text-smoke">
              {user.email} · {user.nickname || "관리자"}
            </p>
          </div>
          <p className="mt-2 font-display text-body-sm text-fog">
            일반 회원에게는 이 메뉴가 보이지 않습니다.{" "}
            <Link href="/" className="text-electric-blue hover:underline">
              사이트로 돌아가기
            </Link>
          </p>
        </div>

        <div className="mb-8">
          <AdminNav />
        </div>

        {children}
      </div>
    </div>
  );
}
