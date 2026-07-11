"use client";

import Link from "next/link";
import { useState } from "react";
import type { Concept } from "@/lib/concepts";

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
}

export function ConceptPartList({
  subject,
  groups,
  questionCounts,
}: ConceptPartListProps) {
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());

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
                        return (
                          <li key={concept.slug}>
                            <Link
                              href={`/concepts/${subject}/${concept.slug}`}
                              className={`hp-cx-concept-row${
                                isChild ? " hp-cx-concept-row--child" : ""
                              }`}
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
                              <span className="hp-cx-concept-row__count">
                                {qCount}문항
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
