/// <reference lib="webworker" />

import { PDFDocument } from "pdf-lib";
import answers from "@/data/exam-print-answer-pages.json";

const answerPageByFile: Readonly<Record<string, number>> = answers;

async function loadPdf(directory: string, file: string) {
  const response = await fetch(`/${directory}/${encodeURIComponent(file)}`);
  if (!response.ok) throw new Error("Could not load the exam PDF");
  return PDFDocument.load(await response.arrayBuffer(), { updateMetadata: false });
}
import type { ExamPrintMergeRequest, ExamPrintMergeResponse } from "@/lib/exam-print-batch";

const worker = self as unknown as DedicatedWorkerGlobalScope;

function send(message: ExamPrintMergeResponse) {
  worker.postMessage(message);
}

worker.onmessage = async ({ data: { files, title, includeExplanations = true } }: MessageEvent<ExamPrintMergeRequest>) => {
  try {
    const output = await PDFDocument.create();
    output.setTitle(title);
    for (const [index, file] of files.entries()) {
      const limit = includeExplanations ? undefined : answerPageByFile[file];
      if (!includeExplanations && (typeof limit !== "number" || !Number.isInteger(limit) || limit < 1)) {
        throw new Error("Missing answer page for " + file);
      }
      const [source, answerPage] = await Promise.all([
        loadPdf("exam-print", file),
        includeExplanations ? null : loadPdf("exam-print-answer-pages", file),
      ]);
      if (limit !== undefined && limit >= source.getPageCount()) throw new Error("Invalid answer-page boundary");
      const pages = await output.copyPages(source, source.getPageIndices().slice(0, limit));
      for (const page of pages) output.addPage(page);
      if (answerPage) {
        if (!answerPage.getPageCount()) throw new Error("Invalid answer-page PDF");
        const answerPages = await output.copyPages(answerPage, answerPage.getPageIndices());
        for (const page of answerPages) output.addPage(page);
      }
      send({ type: "progress", done: index + 1 });
    }
    const bytes = await output.save();
    send({
      type: "complete",
      file: new Blob([bytes as Uint8Array<ArrayBuffer>], { type: "application/pdf" }),
      pages: output.getPageCount(),
    });
  } catch {
    send({ type: "error" });
  }
};
