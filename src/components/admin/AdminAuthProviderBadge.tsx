import type { AdminAuthProvider } from "@/lib/admin";

const PROVIDER_STYLE: Record<
  AdminAuthProvider,
  { label: string; className: string }
> = {
  google: {
    label: "Google 가입",
    className: "border-[#c9dafb] bg-[#eef4ff] text-[#2457a7]",
  },
  kakao: {
    label: "카카오 가입",
    className: "border-[#f0d000] bg-[#fee500] text-[#3c1e1e]",
  },
  app: {
    label: "기존 앱 계정",
    className: "border-[#cbd5e1] bg-[#f8fafc] text-[#111827]",
  },
  email: {
    label: "이메일 가입",
    className: "border-[#cbd5e1] bg-white text-[#475569]",
  },
  other: {
    label: "기타 가입",
    className: "border-[#dbe2ea] bg-[#f8fafc] text-[#64748b]",
  },
};

export function AdminAuthProviderBadge({
  provider,
}: {
  provider: AdminAuthProvider;
}) {
  const style = PROVIDER_STYLE[provider];

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 font-display text-[11px] font-semibold ${style.className}`}
    >
      {style.label}
    </span>
  );
}
