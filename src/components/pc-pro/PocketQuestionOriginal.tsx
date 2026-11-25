import type { PocketOriginal } from "@/lib/pc-access/study";
import { DailyChoiceContent, DailyQuestionBody } from "@/components/daily/DailyQuestionBody";

export function PocketQuestionOriginal({ question, audio = false }: { question: PocketOriginal; audio?: boolean }) {
  const { stem, presentation, questionNo, choices } = question;
  return <details className="pc-pocket-original">
    <summary aria-keyshortcuts={audio ? undefined : "ArrowDown"} className={audio ? "audio-statement-question-link" : undefined}>
      <span className="pc-pocket-original-open">{audio ? "전체 문제 보기" : "원문 기출 보기"}</span>
      <span className="pc-pocket-original-close">{audio ? "전체 문제 접기" : "원문 기출 접기"}</span>
    </summary>
    <section className="pc-pocket-original-body" aria-label="원문 기출">
      <DailyQuestionBody stem={stem} presentation={presentation} questionNo={questionNo} heading="h3" expandableFigures={false}/>
      <ol>
        {choices.map(choice => <li key={choice.key}>
          <span className="pc-pocket-original-label">{choice.label}</span>
          <DailyChoiceContent choice={choice} choiceHeaders={presentation.choiceHeaders}/>
        </li>)}
      </ol>
    </section>
  </details>;
}
