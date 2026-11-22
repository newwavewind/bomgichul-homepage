import type { AdminAuthProvider } from "@/lib/admin";

const PROVIDER_STYLE: Record<
  AdminAuthProvider,
  { label: string; className: string }
> = {
  google: {
    label: "Google 가입",
    className: "border-[color:light-dark(#c9dafb,var(--color-mist))] bg-[color:light-dark(#eef4ff,color-mix(in_srgb,var(--color-snow)_90%,#eef4ff))] text-[color:light-dark(#2457a7,var(--color-carbon))]",
  },
  kakao: {
    label: "카카오 가입",
    className: "border-[#f0d000] bg-[#fee500] text-[#3c1e1e]",
  },
  app: {
    label: "기존 앱 계정",
    className: "border-[color:light-dark(#cbd5e1,var(--color-mist))] bg-[color:light-dark(#f8fafc,var(--color-snow))] text-[color:light-dark(#111827,var(--color-ink))]",
  },
  email: {
    label: "이메일 가입",
    className: "border-[color:light-dark(#cbd5e1,var(--color-mist))] bg-white text-smoke",
  },
  other: {
    label: "기타 가입",
    className: "border-[color:light-dark(#dbe2ea,var(--color-mist))] bg-[color:light-dark(#f8fafc,var(--color-snow))] text-fog",
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
