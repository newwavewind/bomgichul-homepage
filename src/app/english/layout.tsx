/** 공무원 영어 지문과 선지에 ExamLatin 글꼴을 적용한다. */
export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return <div data-exam-latin="">{children}</div>;
}
