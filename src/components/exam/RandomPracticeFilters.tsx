"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { PrimaryButton } from "@/components/ui/Button";

const DEFAULT_SIZE = 20;

export function RandomPracticeFilters({
  subject,
  years,
  categories,
  defaultSize = DEFAULT_SIZE,
}: {
  subject: string;
  years: number[];
  categories: string[];
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

  const toggle = (value: string, list: string[], setter: (v: string[]) => void) => {
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };

  const apply = () => {
    const params = new URLSearchParams();
    if (selectedYears.length) params.set("years", selectedYears.join(","));
    if (selectedCategories.length) params.set("categories", selectedCategories.join(","));
    if (size !== defaultSize) params.set("size", String(size));
    const query = params.toString();
    router.push(`/exam/${subject}/random${query ? `?${query}` : ""}`);
  };

  return (
    <div className="mb-8 rounded-[var(--radius-cards)] border-[1.5px] border-carbon bg-surface p-5">
      <p className="mb-4 font-display text-body-sm font-semibold text-ink">연도·단원 필터</p>

      <div className="mb-4">
        <p className="mb-2 font-display text-[12px] font-medium text-fog">연도</p>
        <div className="flex flex-wrap gap-2">
          {years.map((year) => (
            <button
              key={year}
              type="button"
              onClick={() => toggle(String(year), selectedYears, setSelectedYears)}
              className={`rounded-full border-[1.5px] px-3 py-1 font-display text-[12px] font-medium transition-colors ${
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

      {categories.length > 0 && (
        <div className="mb-4">
          <p className="mb-2 font-display text-[12px] font-medium text-fog">단원</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => toggle(category, selectedCategories, setSelectedCategories)}
                className={`rounded-full border-[1.5px] px-3 py-1 font-display text-[12px] font-medium transition-colors ${
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

      <div className="mb-4">
        <label className="mb-2 block font-display text-[12px] font-medium text-fog">
          문제 수
        </label>
        <select
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          className="rounded-[var(--radius-buttons)] border-[1.5px] border-carbon bg-paper px-3 py-2 font-display text-body-sm text-ink"
        >
          {[10, 20, 30, 40].map((n) => (
            <option key={n} value={n}>
              {n}문제
            </option>
          ))}
        </select>
      </div>

      <PrimaryButton type="button" onClick={apply}>
        필터 적용하고 시작
      </PrimaryButton>
    </div>
  );
}
