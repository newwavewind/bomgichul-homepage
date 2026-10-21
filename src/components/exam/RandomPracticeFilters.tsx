"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { PrimaryButton } from "@/components/ui/Button";

const DEFAULT_SIZE = 20;

export function RandomPracticeFilters({
  subject,
  years,
  categories,
  groups,
  defaultSize = DEFAULT_SIZE,
}: {
  subject: string;
  years: number[];
  categories: string[];
  /** 교재 목차(편 → 장)가 있으면 편마다 묶어 목차 순서로 보인다 */
  groups?: { label: string; units: { id: string; label: string }[] }[];
  defaultSize?: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedYears, setSelectedYears] = useState<string[]>(
    searchParams.get("years")?.split(",").filter(Boolean) ?? []
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get("categories")?.split(",").filter(Boolean) ?? []
  );
  const [size, setSize] = useState(
    Number(searchParams.get("size") ?? defaultSize) || defaultSize
  );
  // 「필터 적용하고 시작」을 누르면 필터 칸을 접어 문제가 바로 보이게 한다(2026-10-21).
  // 필터를 건 주소로 들어와도 접힌 채로 시작하고, 「다시 펼치기」로 연다.
  const [collapsed, setCollapsed] = useState(
    () => searchParams.has("years") || searchParams.has("categories") || searchParams.has("size")
  );

  const toggle = (value: string, list: string[], setter: (v: string[]) => void) => {
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };

  const apply = () => {
    const params = new URLSearchParams();
    if (selectedYears.length) params.set("years", selectedYears.join(","));
    if (selectedCategories.length) params.set("categories", selectedCategories.join(","));
    if (size !== defaultSize) params.set("size", String(size));
    const query = params.toString();
    setCollapsed(true);
    router.push(`/exam/${subject}/random${query ? `?${query}` : ""}`);
  };

  if (collapsed) {
    const unitCount = selectedCategories.length;
    const summary = [
      selectedYears.length ? `연도 ${selectedYears.length}개` : "전체 연도",
      unitCount ? `단원 ${unitCount}개` : "전체 단원",
      `${size}문제`,
    ].join(" · ");
    return (
      <div className="mb-8 flex items-center justify-between gap-3 rounded-[var(--radius-cards)] border border-carbon bg-surface px-5 py-3.5">
        <p className="min-w-0 font-display text-body-sm text-ink">
          <span className="font-semibold">연도·단원 필터</span>
          <span className="ml-2 text-smoke">{summary}</span>
        </p>
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          aria-expanded={false}
          className="shrink-0 rounded-full border border-mist bg-paper px-4 py-2 font-display text-[13px] font-semibold text-ink hover:bg-snow"
        >
          다시 펼치기 ▾
        </button>
      </div>
    );
  }

  return (
    <div className="mb-8 rounded-[var(--radius-cards)] border border-carbon bg-surface p-5">
      <p className="mb-4 font-display text-body-sm font-semibold text-ink">연도·단원 필터</p>

      <div className="mb-4">
        <p className="mb-2 font-display text-[12px] font-medium text-fog">연도</p>
        <div className="flex flex-wrap gap-2">
          {years.map((year) => (
            <button
              key={year}
              type="button"
              onClick={() => toggle(String(year), selectedYears, setSelectedYears)}
              className={`min-h-11 rounded-full border px-3 font-display text-[12px] font-medium transition-colors ${
                selectedYears.includes(String(year))
                  ? "border-carbon bg-carbon text-paper"
                  : "border-mist bg-paper text-ink hover:bg-snow"
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      {groups?.length ? (
        <div className="mb-4">
          <p className="mb-2 font-display text-[12px] font-medium text-fog">단원 (교재 목차 순)</p>
          <div className="space-y-3">
            {groups.map((group, groupIndex) => (
              <div key={group.label}>
                <p className="mb-1.5 font-display text-[12px] font-semibold text-ink">
                  {groupIndex + 1}편 · {group.label}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.units.map((unit) => (
                    <button
                      key={unit.id}
                      type="button"
                      onClick={() => toggle(unit.id, selectedCategories, setSelectedCategories)}
                      className={`min-h-10 rounded-full border px-3 font-display text-[12px] font-medium transition-colors ${
                        selectedCategories.includes(unit.id)
                          ? "border-carbon bg-carbon text-paper"
                          : "border-mist bg-paper text-ink hover:bg-snow"
                      }`}
                    >
                      {unit.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : categories.length > 0 && (
        <div className="mb-4">
          <p className="mb-2 font-display text-[12px] font-medium text-fog">단원</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => toggle(category, selectedCategories, setSelectedCategories)}
                className={`min-h-11 rounded-full border px-3 font-display text-[12px] font-medium transition-colors ${
                  selectedCategories.includes(category)
                    ? "border-carbon bg-carbon text-paper"
                    : "border-mist bg-paper text-ink hover:bg-snow"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mb-5">
        <p className="mb-2 font-display text-[12px] font-medium text-fog">문제 수</p>
        <div
          role="radiogroup"
          aria-label="문제 수"
          className="inline-flex rounded-[var(--radius-buttons)] border border-mist bg-paper p-1"
        >
          {[10, 20, 30, 40].map((n) => {
            const selected = size === n;
            return (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={selected}
                aria-label={`${n}문제`}
                onClick={() => setSize(n)}
                className={`min-w-[3.25rem] rounded-[calc(var(--radius-buttons)-2px)] px-3.5 py-2 font-display text-body-sm font-medium tabular-nums transition-colors ${
                  selected
                    ? "bg-carbon text-paper shadow-[var(--shadow-button)]"
                    : "text-smoke hover:bg-snow hover:text-ink"
                }`}
              >
                {n}
              </button>
            );
          })}
        </div>
      </div>

      <PrimaryButton type="button" onClick={apply}>
        필터 적용하고 시작
      </PrimaryButton>
    </div>
  );
}
