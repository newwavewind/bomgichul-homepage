"use client";

import { initialSyntaxProgress, syntaxProgressKey, toggleStudyId, useStudyProgress } from "./english-study-client";
import { useSyntaxAudio } from "./useSyntaxAudio";

export function EnglishSyntaxDetailActions({ id, sentence, clip }: { id: string; sentence: string; clip?: string }) {
  const [progress, save] = useStudyProgress(syntaxProgressKey, initialSyntaxProgress);
  const { element, state, play, stop } = useSyntaxAudio();
  const marked = progress.marked.includes(id);
  const audioActive = state === "loading" || state === "playing";
  return <div className="es-tools">
    <audio ref={element} preload="none" hidden />
    <button type="button" className="es-button" aria-pressed={audioActive}
      onClick={() => audioActive ? stop() : play(clip, sentence)}>
      {audioActive ? "듣기 정지" : "문장 듣기"}
    </button>
    <button type="button" className="es-button" aria-pressed={marked}
      onClick={() => save({ ...progress, marked: toggleStudyId(progress.marked, id) })}>
      {marked ? "★ 북마크" : "☆ 북마크"}
    </button>
    {state === "error" && <span className="es-muted" role="status">재생할 음성을 불러오지 못했어요.</span>}
  </div>;
}
