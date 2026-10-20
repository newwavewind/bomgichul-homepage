import { EnglishTextSizeControl } from "@/components/english/EnglishTextSizeControl";

/** 공무원 영어 — 지문·선지의 영문을 시험지 원문 같은 세리프로(globals.css 「ExamLatin」), 글씨 크기 단추. */
export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-exam-latin="">
      {children}
      <EnglishTextSizeControl />
    </div>
  );
}
