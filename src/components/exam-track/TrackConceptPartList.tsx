"use client";

import Link from "next/link";
import { useState } from "react";
import type { ExamTrackConcept } from "@/lib/exam-track/types";

export interface TrackConceptSectionGroup {
  section: string;
  orderNo: string;
  items: ExamTrackConcept[];
}

export interface TrackConceptPartGroup {
  chapter: string;
  sections: TrackConceptSectionGroup[];
}

export function TrackConceptPartList({ groups, hrefBase }: { groups: TrackConceptPartGroup[]; hrefBase: string }) {
  const [expanded, setExpanded] = useState(() => new Set(groups.map((group) => group.chapter)));
  const toggle = (chapter: string) => setExpanded((current) => {
    const next = new Set(current);
    if (next.has(chapter)) next.delete(chapter); else next.add(chapter);
    return next;
  });
  return <div className="hp-cx space-y-0">
    {groups.map((group, partIndex) => {
      const open = expanded.has(group.chapter);
      const count = group.sections.reduce((sum, section) => sum + section.items.length, 0);
      return <section key={group.chapter} className="hp-cx-part">
        <button type="button" className={`hp-cx-part__head${open ? " hp-cx-part__head--open" : ""}`} onClick={() => toggle(group.chapter)} aria-expanded={open}>
          <span>PART {partIndex + 1} {group.chapter}</span>
          <span className="hp-cx-part__right"><span className="hp-cx-part__count">{count}</span><span aria-hidden>{open ? "▴" : "▾"}</span></span>
        </button>
        {open ? group.sections.map((section) => <div key={section.section} className="hp-cx-section-block">
          <div className="hp-cx-chapter-head"><span className="hp-cx-chapter-no">{section.orderNo}</span><span className="hp-cx-chapter-name">{section.section}</span></div>
          <ul className="hp-cx-concept-list">{section.items.map((concept) => {
            const child = Boolean(concept.parentSlug && section.items.some((item) => item.slug === concept.parentSlug));
            const rowNo = child
              ? section.items.filter((item) => item.parentSlug === concept.parentSlug).findIndex((item) => item.slug === concept.slug) + 1
              : section.items.filter((item) => !(item.parentSlug && section.items.some((parent) => parent.slug === item.parentSlug))).findIndex((item) => item.slug === concept.slug) + 1;
            return <li key={concept.slug}><Link href={`${hrefBase}/${concept.slug}`} className={`hp-cx-concept-row${child ? " hp-cx-concept-row--child" : ""}`}>
              <div className="flex min-w-0 items-start gap-3">
                <span className={`mt-0.5 inline-flex h-7 min-w-7 items-center justify-center rounded-lg border px-1.5 font-display text-[11px] font-semibold ${child ? "border-mist bg-paper text-fog" : "border-ios-blue/25 bg-ios-blue/5 text-ios-blue"}`}>{String(rowNo).padStart(2, "0")}</span>
                <div className="min-w-0"><p className="hp-cx-concept-row__meta">{concept.category}{concept.subcategory !== concept.category ? ` · ${concept.subcategory}` : ""}</p><h3 className="hp-cx-concept-row__title">{concept.titleKo}</h3></div>
              </div>
              <span className="hp-cx-concept-row__count">{concept.questionRefs?.length ?? 0}문항</span>
            </Link></li>;
          })}</ul>
        </div>) : null}
      </section>;
    })}
  </div>;
}
