"use client";

import { useId, useState } from "react";
import { KakaoShareButton } from "@/components/daily/KakaoShareButton";
import { SITE_URL } from "@/lib/constants";

type Edition = { subject: string; subjectLabel: string; year: number; session: string; file: string };

const selectClassName = "mt-2 min-h-11 w-full rounded-xl border border-mist bg-white px-3 py-2 text-ink focus-visible:outline-2 focus-visible:outline-ios-blue disabled:bg-paper disabled:opacity-60";

export function ExamPrintPicker({ exam, editions, initialEdition }: {
  exam: string;
  editions: Edition[];
  initialEdition?: Edition;
}) {
  const subjects = new Map(editions.map(({ subject, subjectLabel }) => [subject, subjectLabel]));
  const [subject, setSubject] = useState(initialEdition?.subject ?? (subjects.size === 1 ? editions[0].subject : ""));
  const [year, setYear] = useState(initialEdition ? String(initialEdition.year) : "");
  const [session, setSession] = useState(initialEdition?.session ?? "");
  const forSubject = editions.filter((entry) => entry.subject === subject);
  const years = [...new Set(forSubject.map((entry) => entry.year))].sort((a, b) => b - a);
  const sessions = forSubject.filter((entry) => String(entry.year) === year)
    .sort((a, b) => a.session.localeCompare(b.session, "ko", { numeric: true }));
  const selected = sessions.find((entry) => entry.session === session) ?? (sessions.length === 1 ? sessions[0] : undefined);
  const bundled = selected && editions.some((entry) =>
    entry.file === selected.file && entry.subject !== selected.subject,
  );

  return (
    <>
      <div className="grid gap-4 rounded-2xl border border-mist bg-paper p-4 sm:grid-cols-3 sm:p-5">
        <label className="font-display font-semibold text-ink">
          과목
          <select className={selectClassName} value={subject} onChange={(event) => {
            setSubject(event.target.value);
            setYear("");
            setSession("");
          }}>
            <option value="">과목 선택</option>
            {[...subjects].sort((a, b) => a[1].localeCompare(b[1], "ko")).map(([id, label]) => (
              <option key={id} value={id}>{label}</option>
            ))}
          </select>
        </label>
        <label className="font-display font-semibold text-ink">
          연도
          <select className={selectClassName} value={year} disabled={!subject} onChange={(event) => {
            setYear(event.target.value);
            setSession("");
          }}>
            <option value="">연도 선택</option>
            {years.map((value) => <option key={value} value={value}>{value}년</option>)}
          </select>
        </label>
        <label className="font-display font-semibold text-ink">
          회차·구분
          <select className={selectClassName} value={selected?.session ?? ""} disabled={!year} onChange={(event) => {
            setSession(event.target.value);
          }}>
            <option value="" disabled={sessions.length === 1}>회차·구분 선택</option>
            {sessions.map((entry) => <option key={entry.session} value={entry.session}>{entry.session}</option>)}
          </select>
        </label>
      </div>
      {selected && (
        <ExamPrintPreview
          key={JSON.stringify([selected.subject, selected.year, selected.session])}
          exam={exam}
          edition={selected}
          bundled={bundled}
        />
      )}
    </>
  );
}

const actionClass = "inline-flex min-h-11 items-center justify-center rounded-xl border px-4 font-display font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ios-blue";
const secondaryAction = `${actionClass} border-mist bg-white text-ink hover:border-ios-blue`;
const kakaoAction = `${actionClass} gap-2 border-transparent bg-[#FEE500] text-[#191919] hover:bg-[#f4dc00] disabled:cursor-wait disabled:opacity-80`;

function ExamPrintPreview({ exam, edition, bundled }: { exam: string; edition: Edition; bundled?: boolean }) {
  const [shareOpen, setShareOpen] = useState(false);
  const [shareStatus, setShareStatus] = useState("");
  const [showShareUrl, setShowShareUrl] = useState(false);
  const sharePanelId = useId();
  const { subject, subjectLabel, year, session, file } = edition;
  const href = `/exam-print/${file}`;
  const sharePath = `/print-exams?${new URLSearchParams({ exam, subject, year: String(year), session })}`;
  const shareUrl = `${SITE_URL}${sharePath}`;
  const shareTitle = `${year}년 ${session} ${subjectLabel} 기출문제·해설 PDF`;
  const shareDescription = "공식 시험지와 정답표, 봄기출 해설을 무료로 보고 인쇄하세요.";

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShowShareUrl(false);
      setShareStatus("링크를 복사했어요. 카카오톡 채팅방에도 붙여넣을 수 있어요.");
    } catch {
      setShowShareUrl(true);
      setShareStatus("아래 링크를 직접 복사해 주세요.");
    }
  }

  async function shareWithOtherApps() {
    if (!navigator.share) {
      setShareStatus("이 브라우저에서는 링크 복사나 이메일로 공유할 수 있어요.");
      return;
    }
    setShareStatus("");
    try {
      await navigator.share({ title: shareTitle, text: shareDescription, url: shareUrl });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setShareStatus("공유창을 열 수 없어요. 링크를 복사해 주세요.");
    }
  }

  return (
    <section className="mt-5 overflow-hidden rounded-2xl border border-mist" aria-label="출력할 기출문제와 해설">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-paper p-4">
        <div>
          <h2 className="font-display font-semibold text-ink">{subjectLabel} · {year}년 {session}</h2>
          {bundled && <p className="mt-1 text-sm text-fog">같은 시험지에 있는 다른 과목도 함께 출력돼요.</p>}
          <p className="mt-1 text-sm text-fog">PDF에서 인쇄를 누르면 A4 등 용지 크기를 고를 수 있어요.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-xl bg-[#0066d6] px-4 font-display font-semibold text-white hover:bg-[#0057b7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ios-blue">
            PDF 열기·인쇄
          </a>
          <button type="button" className={secondaryAction} aria-expanded={shareOpen} aria-controls={sharePanelId} onClick={() => setShareOpen(!shareOpen)}>
            공유하기
          </button>
        </div>
        <p className="basis-full text-sm leading-6 text-fog">
          기출문제와 해설을 무료로 출력하고, 링크를 친구나 스터디에 자유롭게 공유하세요. 출력물에 있는 출처 표시는 그대로 남겨 주세요.
        </p>
      </div>
      <div id={sharePanelId} hidden={!shareOpen} className="space-y-2 border-t border-mist bg-paper p-4">
        <div className="flex flex-wrap items-start gap-2">
          <KakaoShareButton title={shareTitle} description={shareDescription} path={sharePath} className={kakaoAction}>
            카카오톡 공유
          </KakaoShareButton>
          <button type="button" className={secondaryAction} onClick={copyLink}>링크 복사</button>
          <button type="button" className={secondaryAction} onClick={shareWithOtherApps}>다른 앱으로 공유</button>
          <a className={secondaryAction} href={`mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareUrl)}`}>이메일</a>
        </div>
        <p role="status" className="text-sm text-fog empty:hidden">{shareStatus}</p>
        {showShareUrl && (
          <input
            aria-label="공유 링크"
            readOnly
            value={shareUrl}
            onFocus={(event) => event.currentTarget.select()}
            className="min-h-11 w-full rounded-xl border border-mist bg-white px-3 text-sm text-ink"
          />
        )}
      </div>
      <iframe src={href} title="기출문제와 해설 PDF 미리보기" className="block h-[65vh] min-h-80 w-full border-t border-mist bg-white" />
    </section>
  );
}
