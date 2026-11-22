/// <reference lib="webworker" />

import { PDFDocument } from "pdf-lib";
import type { ExamPrintMergeRequest, ExamPrintMergeResponse } from "@/lib/exam-print-batch";

const worker = self as unknown as DedicatedWorkerGlobalScope;

function send(message: ExamPrintMergeResponse) {
  worker.postMessage(message);
}

worker.onmessage = async ({ data: { files, title } }: MessageEvent<ExamPrintMergeRequest>) => {
  try {
    const output = await PDFDocument.create();
    output.setTitle(title);
    for (const [index, file] of files.entries()) {
      const response = await fetch(`/exam-print/${encodeURIComponent(file)}`);
      if (!response.ok) throw new Error("Could not load the exam PDF");
      const source = await PDFDocument.load(await response.arrayBuffer(), { updateMetadata: false });
      const pages = await output.copyPages(source, source.getPageIndices());
      for (const page of pages) output.addPage(page);
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
