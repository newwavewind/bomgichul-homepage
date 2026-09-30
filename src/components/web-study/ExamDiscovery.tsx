"use client";
import { useSelectedExam } from "./useWebStudy";
import { useState } from "react";
import Link from "next/link";
import { EXAM_CHOICES, selectExam } from "@/lib/web-study";
export function ExamDiscovery({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("전체");
  const recent = useSelectedExam();
  const matches = EXAM_CHOICES.filter(
    ([, name, category]) =>
      (group === "전체" || category === group) && name.includes(query.trim()),
  );
  return (
    <>
      <style>
        {EXAM_CHOICES.filter(([id]) => !matches.some(([found]) => found === id))
          .map(([id]) => `[data-exam-card="${id}"]{display:none}`)
          .join("\n")}
      </style>
      <section className="web-panel" aria-label="시험 찾기">
        <label htmlFor="exam-find">내 시험 찾기</label>
        <input
          id="exam-find"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="시험 이름 검색"
          className="web-input"
        />
        <div className="web-actions">
          {["전체", "공무원", "전문자격", "어학·한국사"].map((value) => (
            <button
              key={value}
              aria-pressed={group === value}
              onClick={() => setGroup(value)}
            >
              {value}
            </button>
          ))}
        </div>
        {recent && (
          <p>
            최근 선택:{" "}
            <Link href={`/${recent}`}>
              {EXAM_CHOICES.find(([id]) => id === recent)?.[1]} 학습 홈 →
            </Link>
          </p>
        )}
        <nav className="web-actions" aria-label="검색된 시험">
          {matches.map(([id, label]) => (
            <Link key={id} href={`/${id}`} onClick={() => selectExam(id)}>
              {label} →
            </Link>
          ))}
        </nav>
        {!matches.length && (
          <p role="status">
            일치하는 시험이 없습니다. 다른 이름으로 검색해 주세요.
          </p>
        )}
      </section>
      {children}
    </>
  );
}
export function FirstStudyLink() {
  const exam = useSelectedExam();
  return (
    <Link className="web-primary" href={exam ? `/${exam}` : "/#exam-selection"}>
      {exam ? "내 시험 기출 풀기" : "목표 시험 선택"} →
    </Link>
  );
}
