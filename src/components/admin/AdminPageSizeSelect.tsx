"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function AdminPageSizeSelect({ value }: { value: "30" | "all" }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (nextValue: "30" | "all") => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    if (nextValue === "all") params.set("size", "all");
    else params.delete("size");

    const query = params.toString();
    router.push(`${pathname}${query ? `?${query}` : ""}#signups`);
  };

  return (
    <label className="flex items-center gap-2 font-display text-[12px] text-smoke">
      <span>표시</span>
      <select
        aria-label="가입자 표시 개수"
        value={value}
        onChange={(event) => handleChange(event.target.value as "30" | "all")}
        className="rounded-[var(--radius-buttons)] border border-mist bg-paper px-3 py-2 font-display text-body-sm text-ink outline-none transition-colors focus:border-electric-blue"
      >
        <option value="30">30명 보기</option>
        <option value="all">전체보기</option>
      </select>
    </label>
  );
}
