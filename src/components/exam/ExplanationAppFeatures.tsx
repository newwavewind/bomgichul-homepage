"use client";

import { createContext, useContext, useId, useRef, useState, type ReactNode } from "react";
import { ExamExplanationAiMenu } from "@/components/exam/ExamExplanationAiMenu";
import { HistoryNotebookPreview } from "@/components/history/HistoryNotebookPreview";
import { PcNotebookAction } from "@/components/pc-pro/PcStudyAction";
import type { PcQuestionAccess } from "@/lib/pc-access/study-features";
import { AppStoreButtons } from "@/components/ui/AppStoreButtons";
import type { AppStoreLinks } from "@/lib/constants";

const FEATURES = {
  glossary: {
    title: "용어사전",
    description: "해설에 나온 어려운 용어의 뜻과 관련 내용을 찾아볼 수 있어요.",
  },
  ai: {
    title: "바로바로 AI 해설",
    description: "읽고 있던 선지나 해설에서 궁금한 점을 이어서 물어볼 수 있어요.",
  },
  notes: {
    title: "필기노트",
    description: "문항의 핵심 개념과 풀이 흐름을 노트에서 한눈에 정리할 수 있어요.",
  },
};

type ExplanationFeature = keyof typeof FEATURES;
const OpenFeature = createContext<((feature: ExplanationFeature, trigger: HTMLButtonElement) => void) | null>(null);

export function ExplanationAppFeatures({ links, children }: { links: AppStoreLinks; children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [feature, setFeature] = useState<ExplanationFeature | null>(null);
  const id = useId();

  if (!links.ios && !links.android) return <>{children}</>;

  const open = (next: ExplanationFeature, button: HTMLButtonElement) => {
    trigger.current = button;
    setFeature(next);
    if (dialog.current) {
      dialog.current.showModal();
      dialog.current.scrollTop = 0;
    }
  };

  return (
    <OpenFeature.Provider value={open}>
      {children}
      <dialog
        ref={dialog}
        className="exam-app-feature-dialog"
        aria-labelledby={id}
        aria-describedby={`${id}-description`}
        onClick={(event) => {
          if (event.target === dialog.current) dialog.current?.close();
        }}
        onClose={() => {
          trigger.current?.focus({ preventScroll: true });
          setFeature(null);
        }}
      >
        <div className="min-w-0 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <h3 id={id} className="font-display text-subheading font-semibold text-ink">
              {feature ? FEATURES[feature].title : "봄기출 앱"}
            </h3>
            <form method="dialog">
              <button type="submit" className="rounded-lg px-2.5 py-1.5 font-display text-body-sm text-smoke hover:bg-snow">
                닫기
              </button>
            </form>
          </div>
          <p id={`${id}-description`} className="mt-3 font-system text-body-sm leading-relaxed text-smoke">
            이 기능은 봄기출 앱에서 이용할 수 있어요. {feature ? FEATURES[feature].description : null}
          </p>
          <AppStoreButtons links={links} size="sm" className="mt-5" />
          {feature === "notes" ? <HistoryNotebookPreview /> : null}
        </div>
      </dialog>
    </OpenFeature.Provider>
  );
}

export function ExplanationAppFeatureButton({
  feature,
  className,
  children,
}: {
  feature: ExplanationFeature;
  className: string;
  children: ReactNode;
}) {
  const open = useContext(OpenFeature);
  if (!open) return null;

  return (
    <button
      type="button"
      className={className}
      aria-haspopup="dialog"
      onClick={(event) => open(feature, event.currentTarget)}
    >
      {children}
    </button>
  );
}

export function ExplanationAiAction({ prompt }: { prompt: string }) {
  const open = useContext(OpenFeature);
  return <ExamExplanationAiMenu prompt={prompt} openInApp={open ? (trigger) => open("ai", trigger) : undefined} />;
}

export function ExplanationAppTools({ questionPrompt, notebookPro, noteTitle = "" }: { questionPrompt?: string; notebookPro?: PcQuestionAccess; noteTitle?: string }) {
  const open = useContext(OpenFeature);
  if (!open && !questionPrompt && !notebookPro) return null;

  const toolClass = "rounded-full border border-mist bg-paper px-3.5 py-2 font-display text-body-sm font-medium text-ink hover:bg-snow";
  return (
    <div className="exam-explanation-notebook mt-5 flex flex-wrap items-center gap-2.5 px-4 py-3">
      {notebookPro ? <PcNotebookAction title={noteTitle} offers={notebookPro.offers} className={toolClass}/>
        : <ExplanationAppFeatureButton feature="notes" className={toolClass}>
          필기노트 보기 <span aria-hidden>→</span>
        </ExplanationAppFeatureButton>}
      {questionPrompt ? <ExplanationAiAction prompt={questionPrompt} /> : null}
    </div>
  );
}
