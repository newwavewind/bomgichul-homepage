"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Concept } from "@/lib/concepts";
import {
  formatConceptReads,
  getConceptReadCount,
  loadConceptReads,
  type ConceptReadProgress,
} from "@/lib/concept-reads";

export interface ConceptSectionGroup {
  section: string;
  orderNo: string;
  items: Concept[];
}

export interface ConceptPartGroup {
  chapter: string;
  sections: ConceptSectionGroup[];
}

interface ConceptPartListProps {
  subject: string;
  groups: ConceptPartGroup[];
  questionCounts: Record<string, number>;
  userId?: string | null;
}

export function ConceptPartList({
  subject,
  groups,
  questionCounts,
  userId = null,
}: ConceptPartListProps) {
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(groups.map((g) => g.chapter))
  );  const [progress, setProgress] = useState<ConceptReadProgress>({});

  useEffect(() => {
    if (!userId) {
      setProgress({});
      return;
    }
    setProgress(loadConceptReads(userId, subject));
    const refresh = () => setProgress(loadConceptReads(userId, subject));
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [userId, subject]);

  const toggle = (chapter: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(chapter)) next.delete(chapter);
      else next.add(chapter);
      return next;
    });
  };

  return (
    <div className="hp-cx space-y-0">
      {groups.map((group, partIndex) => {
        const open = expanded.has(group.chapter);
        const count = group.sections.reduce((n, s) => n + s.items.length, 0);
        const readInPart = userId
          ? group.sections.reduce(
              (n, s) =>
                n +
                s.items.filter((c) => getConceptReadCount(progress, c.slug) > 0).length,
              0
            )
          : 0;
        return (
          <section key={group.chapter} className="hp-cx-part">
            <button
              type="button"
              className={`hp-cx-part__head${open ? " hp-cx-part__head--open" : ""}`}
              onClick={() => toggle(group.chapter)}
              aria-expanded={open}
            >
              <span>
                제{partIndex + 1}편 {group.chapter}
              </span>
              <span className="hp-cx-part__right">
                {userId ? (
                  <span className="hp-cx-part__reads">
                    {readInPart}/{count}
                  </span>
                ) : null}
                <span className="hp-cx-part__count">{count}</span>
                <span aria-hidden>{open ? "▴" : "▾"}</span>
              </span>
            </button>

            {open
              ? group.sections.map((section) => (
                  <div key={section.section} className="hp-cx-section-block">
                    <div className="hp-cx-chapter-head">
                      <span className="hp-cx-chapter-no">{section.orderNo}</span>
                      <span className="hp-cx-chapter-name">{section.section}</span>
                    </div>
                    <ul className="hp-cx-concept-list">
                      {section.items.map((concept) => {
                        const isChild = Boolean(concept.parentSlug);
                        const qCount = questionCounts[concept.slug] ?? 0;
                        const reads = userId
                          ? getConceptReadCount(progress, concept.slug)
                          : 0;
                        return (
                          <li key={concept.slug}>
                            <Link
                              href={`/concepts/${subject}/${concept.slug}`}
                              className={`hp-cx-concept-row${
                                isChild ? " hp-cx-concept-row--child" : ""
                              }${reads > 0 ? " hp-cx-concept-row--read" : ""}`}
                            >
                              <div className="min-w-0">
                                <p className="hp-cx-concept-row__meta">
                                  {isChild ? (
                                    <span className="mr-1" aria-hidden>
                                      └
                                    </span>
                                  ) : null}
                                  {concept.category}
                                  {concept.subcategory !== concept.category
                                    ? ` · ${concept.subcategory}`
                                    : ""}
                                </p>
                                <h3 className="hp-cx-concept-row__title">
                                  {concept.titleKo}
                                </h3>
                              </div>
                              <span className="hp-cx-concept-row__meta-right">
                                {userId ? (
                                  <span
                                    className={`hp-cx-concept-row__reads${
                                      reads > 0 ? " is-done" : ""
                                    }`}
                                  >
                                    {formatConceptReads(reads)}
                                  </span>
                                ) : null}
                                <span className="hp-cx-concept-row__count">
                                  {qCount}문항
                                </span>
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))
              : null}
          </section>
        );
      })}
    </div>
  );
}
