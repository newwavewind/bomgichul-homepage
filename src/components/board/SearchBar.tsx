"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";

interface SearchBarProps {
  defaultValue?: string;
  placeholder?: string;
  basePath?: string;
}

export function SearchBar({
  defaultValue = "",
  placeholder = "게시글 검색...",
  basePath = "/community",
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(defaultValue);
  const [isPending, startTransition] = useTransition();

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const params = new URLSearchParams(searchParams.toString());
      if (query.trim()) {
        params.set("q", query.trim());
      } else {
        params.delete("q");
      }
      params.delete("page");
      startTransition(() => {
        router.push(`${basePath}?${params.toString()}`);
      });
    },
    [query, router, searchParams, basePath]
  );

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-md">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-[var(--radius-buttons)] border border-mist bg-paper py-2.5 pl-4 pr-24 font-display text-body-sm text-ink outline-none placeholder:text-ash focus:border-electric-blue focus:ring-2 focus:ring-electric-blue/20"
      />
      <button
        type="submit"
        disabled={isPending}
        className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-[var(--radius-buttons)] bg-midnight px-4 py-1.5 font-display text-body-sm font-medium text-paper shadow-[var(--shadow-button)] transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        검색
      </button>
    </form>
  );
}

interface SortSelectProps {
  current: string;
  basePath?: string;
}

export function SortSelect({ current, basePath = "/community" }: SortSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "latest") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    params.delete("page");
    router.push(`${basePath}?${params.toString()}`);
  };

  return (
    <select
      value={current}
      onChange={(e) => handleChange(e.target.value)}
      className="rounded-[var(--radius-buttons)] border border-mist bg-paper px-4 py-2 font-display text-body-sm text-ink outline-none focus:border-electric-blue"
    >
      <option value="latest">최신순</option>
      <option value="popular">인기순</option>
    </select>
  );
}
