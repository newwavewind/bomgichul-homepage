"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { isStudyShortcut } from "./english-study-client";

export function EnglishSyntaxDetailReader({
  backLink, overview, study, previousHref, nextHref,
}: {
  backLink: ReactNode;
  overview: ReactNode;
  study: ReactNode;
  previousHref?: string;
  nextHref?: string;
}) {
  const router = useRouter();
  const reader = useRef<HTMLElement>(null);
  const overviewPanel = useRef<HTMLElement>(null);
  const studyPanel = useRef<HTMLElement>(null);

  useEffect(() => {
    let studyScroll: number | null = null;

    function onKeyDown(event: KeyboardEvent) {
      const { key, target } = event;
      if (key !== "ArrowLeft" && key !== "ArrowRight") return;
      if (event.repeat || !isStudyShortcut(event) || !(target instanceof HTMLElement)) return;
      if (target !== document.body && !reader.current?.contains(target)) return;
      if (target.isContentEditable || document.querySelector('dialog[open], [aria-modal="true"]')) return;
      if (window.getSelection()?.type === "Range") return;

      const backwards = key === "ArrowLeft";
      if (event.shiftKey) {
        const panel = (backwards ? overviewPanel : studyPanel).current;
        if (!panel) return;
        event.preventDefault();
        if (backwards && studyPanel.current?.contains(target)) studyScroll = window.scrollY;
        panel.focus({ preventScroll: true });
        if (!backwards && studyScroll !== null && overviewPanel.current?.contains(target)) {
          window.scrollTo({ top: studyScroll, behavior: "instant" });
          studyScroll = null;
          return;
        }
        const { bottom, top } = panel.getBoundingClientRect();
        const topInset = parseFloat(getComputedStyle(panel).scrollMarginTop);
        if (bottom <= topInset || top >= window.innerHeight || (backwards && top < topInset - 1)) {
          panel.scrollIntoView({ block: "start" });
        }
        return;
      }

      const href = backwards ? previousHref : nextHref;
      if (href) {
        event.preventDefault();
        router.push(href);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [nextHref, previousHref, router]);

  return (
    <section ref={reader} className="es-page es-detail-page">
      <div className="es-detail-toolbar">
        {backLink}
        <div className="es-keyboard es-detail-keyboard" role="group" aria-label="키보드 사용 안내">
          <span><kbd>←</kbd><kbd>→</kbd> 문장 이동</span>
          <span><kbd>Shift</kbd> + <kbd>←</kbd><kbd>→</kbd> 문장·해설 전환</span>
          <span><kbd>↑</kbd><kbd>↓</kbd> 스크롤</span>
          <span><kbd>Tab</kbd><kbd>Enter</kbd> 버튼 이동·실행</span>
        </div>
      </div>
      <div className="es-workspace es-detail-layout">
        <article ref={overviewPanel} tabIndex={0} aria-label="문장과 해석" aria-keyshortcuts="Shift+ArrowLeft"
          className="es-reader es-detail-overview">
          {overview}
        </article>
        <article ref={studyPanel} tabIndex={0} aria-label="문장 해설" aria-keyshortcuts="Shift+ArrowRight"
          className="es-reader es-detail-study">
          {study}
        </article>
      </div>
    </section>
  );
}
