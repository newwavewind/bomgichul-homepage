"use client";

import { useEffect, useId, useState } from "react";

const actionClass = "inline-flex min-h-11 items-center justify-center rounded-xl px-4 font-display font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ios-blue";
export const examPrintSecondaryAction = `${actionClass} border border-mist bg-white text-ink hover:border-ios-blue`;
export const examPrintPrimaryAction = `${actionClass} bg-[#0066d6] text-white hover:bg-[#0057b7] disabled:opacity-50`;

export function ExamPrintPreview({ title, href, fileName, details, generatedFile }: {
  title: string;
  href: string;
  fileName: string;
  details?: string;
  generatedFile?: Blob;
}) {
  const [shareOpen, setShareOpen] = useState(false);
  const sharePanelId = useId();
  const safeFileName = fileName.replace(/[<>:"/\\|?*]/g, " ");

  return (
    <section className="mt-5 overflow-hidden rounded-2xl border border-mist" aria-label="출력할 기출문제와 해설">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-paper p-4">
        <div>
          <h2 className="font-display font-semibold text-ink">{title}</h2>
          {details && <p className="mt-1 text-sm text-fog">{details}</p>}
          <p className="mt-1 text-sm text-fog">PDF에서 인쇄를 누르면 A4 등 용지 크기를 고를 수 있어요.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href={href} target="_blank" rel="noopener noreferrer" className={examPrintPrimaryAction}>
            PDF 열기·인쇄
          </a>
          {generatedFile && <a href={href} download={safeFileName} className={examPrintSecondaryAction}>PDF 저장</a>}
          <button type="button" className={examPrintSecondaryAction} aria-expanded={shareOpen} aria-controls={sharePanelId} onClick={() => setShareOpen(!shareOpen)}>
            공유하기
          </button>
        </div>
        <p className="basis-full text-sm leading-6 text-fog">
          기출문제와 해설을 무료로 출력하고, PDF 파일을 친구나 스터디에 자유롭게 공유하세요. 출력물에 있는 출처 표시는 그대로 남겨 주세요.
        </p>
      </div>
      <div id={sharePanelId} hidden={!shareOpen} className="space-y-2 border-t border-mist bg-paper p-4">
        {shareOpen && <ExamPrintFileShare href={href} fileName={safeFileName} generatedFile={generatedFile} />}
      </div>
      <iframe src={href} title="기출문제와 해설 PDF 미리보기" className="block h-[65vh] min-h-80 w-full border-t border-mist bg-white" />
    </section>
  );
}

function ExamPrintFileShare({ href, fileName, generatedFile }: { href: string; fileName: string; generatedFile?: Blob }) {
  const supportsSharing = typeof navigator !== "undefined" &&
    typeof navigator.share === "function" && typeof navigator.canShare === "function";
  const [prepared, setPrepared] = useState<File | "unavailable" | null>(null);
  const [sharing, setSharing] = useState(false);
  const [shareFailed, setShareFailed] = useState(false);

  useEffect(() => {
    if (!supportsSharing) return;
    const controller = new AbortController();

    async function preparePdf() {
      try {
        let blob = generatedFile;
        if (!blob) {
          const response = await fetch(href, { signal: controller.signal });
          if (!response.ok) throw new Error("Could not fetch PDF");
          blob = await response.blob();
        }
        if (blob.type !== "application/pdf" || !blob.size) throw new Error("Invalid PDF response");
        const file = new File([blob], fileName, { type: "application/pdf" });
        if (!controller.signal.aborted) {
          setPrepared(navigator.canShare({ files: [file] }) ? file : "unavailable");
        }
      } catch {
        if (!controller.signal.aborted) setPrepared("unavailable");
      }
    }

    void preparePdf();
    return () => controller.abort();
  }, [fileName, generatedFile, href, supportsSharing]);

  const file = prepared === "unavailable" ? null : prepared;
  const showShare = supportsSharing && prepared !== "unavailable";
  const instructions = showShare && !shareFailed
    ? "공유 메뉴에 카카오톡이 없으면 ‘PDF 열기·인쇄’에서 파일을 저장해 채팅방에 첨부하세요."
    : "‘PDF 열기·인쇄’에서 파일을 저장해 카카오톡 채팅방에 첨부하세요.";

  async function sharePdf() {
    if (!file || sharing) return;
    setSharing(true);
    setShareFailed(false);
    try {
      // Call from the tap while Safari still has user activation.
      await navigator.share({ files: [file] });
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) setShareFailed(true);
    } finally {
      setSharing(false);
    }
  }

  return (
    <>
      {showShare && (
        <button type="button" className={`${examPrintSecondaryAction} disabled:cursor-wait disabled:opacity-80`} disabled={!file || sharing} aria-busy={!file || sharing} onClick={sharePdf}>
          {sharing ? "공유창 여는 중…" : file ? "PDF 파일 공유" : "PDF 준비 중…"}
        </button>
      )}
      <p role="status" className="text-sm text-fog">{instructions}</p>
    </>
  );
}
