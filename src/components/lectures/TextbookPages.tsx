'use client';

import { useEffect, useRef, useState } from 'react';
import type { PDFDocumentProxy, RenderTask } from 'pdfjs-dist';

type PageLink = {
  id: string; left: number; top: number; width: number; height: number;
  url?: string; destination?: string | unknown[];
};

/** PDF 플러그인 없이 원본을 표시하고 문서 안의 기출·목차 링크도 유지한다. */
export default function TextbookPages({ url, title }: { url: string; title: string }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [document, setDocument] = useState<PDFDocumentProxy | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [width, setWidth] = useState(700);
  const [zoom, setZoom] = useState(1);
  const [rendering, setRendering] = useState(true);
  const [error, setError] = useState('');
  const [pageText, setPageText] = useState('');
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [links, setLinks] = useState<PageLink[]>([]);

  useEffect(() => {
    let cancelled = false;
    let destroy: (() => Promise<void>) | undefined;
    void import('pdfjs-dist').then(async pdfjs => {
      if (cancelled) return;
      pdfjs.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.mjs';
      const task = pdfjs.getDocument({
        url, cMapUrl: '/pdfjs/cmaps/', cMapPacked: true,
        standardFontDataUrl: '/pdfjs/standard_fonts/', wasmUrl: '/pdfjs/wasm/',
        iccUrl: '/pdfjs/iccs/',
      });
      destroy = () => task.destroy();
      const pdf = await task.promise;
      if (!cancelled) setDocument(pdf);
    }).catch(() => {
      if (!cancelled) setError('교재를 표시하지 못했어요. 새 창에서 열거나 PDF를 저장해 주세요.');
    });
    return () => { cancelled = true; void destroy?.(); };
  }, [url]);

  useEffect(() => {
    const element = viewportRef.current;
    if (!element) return;
    const observer = new ResizeObserver(() => setWidth(Math.max(200, Math.min(900, element.clientWidth - 32))));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!document || !canvasRef.current) return;
    let cancelled = false;
    let task: RenderTask | undefined;
    const canvas = canvasRef.current;
    setRendering(true); setError(''); setLinks([]);
    void (async () => {
      const page = await document.getPage(pageNumber);
      if (cancelled) return;
      const natural = page.getViewport({ scale: 1 });
      const viewport = page.getViewport({ scale: width * zoom / natural.width });
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.ceil(viewport.width * ratio);
      canvas.height = Math.ceil(viewport.height * ratio);
      canvas.style.width = `${viewport.width}px`;
      canvas.style.height = `${viewport.height}px`;
      setSize({ width: viewport.width, height: viewport.height });
      task = page.render({ canvas, viewport, transform: ratio === 1 ? undefined : [ratio, 0, 0, ratio, 0, 0] });
      await task.promise;
      if (cancelled) return;
      const [annotations, text] = await Promise.all([page.getAnnotations(), page.getTextContent()]);
      if (cancelled) return;
      setPageText(text.items.map(item => 'str' in item ? item.str : '').join(' '));
      setLinks(annotations.filter(annotation => annotation.subtype === 'Link' && (annotation.url || annotation.dest)).map(annotation => {
        const rect = [
          ...viewport.convertToViewportPoint(annotation.rect[0], annotation.rect[1]),
          ...viewport.convertToViewportPoint(annotation.rect[2], annotation.rect[3]),
        ];
        return {
          id: annotation.id,
          left: Math.min(rect[0], rect[2]), top: Math.min(rect[1], rect[3]),
          width: Math.abs(rect[2] - rect[0]), height: Math.abs(rect[3] - rect[1]),
          url: typeof annotation.url === 'string' && /^https?:\/\//.test(annotation.url) ? annotation.url : undefined,
          destination: annotation.dest,
        };
      }));
      setRendering(false);
    })().catch(() => {
      if (!cancelled) { setError('이 쪽을 표시하지 못했어요. 다른 쪽으로 이동하거나 PDF를 저장해 주세요.'); setRendering(false); }
    });
    return () => { cancelled = true; task?.cancel(); };
  }, [document, pageNumber, width, zoom]);

  function goToPage(page: number) {
    if (!document || !Number.isInteger(page) || page < 1 || page > document.numPages) return;
    setPageNumber(page); viewportRef.current?.scrollTo({ top: 0, left: 0 });
  }
  async function follow(destination: string | unknown[]) {
    if (!document) return;
    const target = typeof destination === 'string' ? await document.getDestination(destination) : destination;
    if (!target) return;
    const reference = target[0];
    const index = typeof reference === 'number' ? reference : await document.getPageIndex(reference);
    goToPage(index + 1);
  }

  return <div className="textbook-pages">
    <nav className="textbook-page-controls" aria-label="교재 페이지">
      <button type="button" disabled={!document || pageNumber === 1} onClick={() => goToPage(pageNumber - 1)}>이전 쪽</button>
      <label>쪽 <input type="number" aria-label="교재 페이지 번호" min={1} max={document?.numPages || 1} value={pageNumber} onChange={event => goToPage(Number(event.target.value))} /></label>
      <span aria-live="polite">/ {document?.numPages || '…'}</span>
      <button type="button" disabled={!document || pageNumber === document.numPages} onClick={() => goToPage(pageNumber + 1)}>다음 쪽</button>
      <button type="button" aria-label="교재 축소" disabled={zoom <= 0.5} onClick={() => setZoom(value => Math.max(0.5, value - 0.25))}>−</button>
      <span>{Math.round(zoom * 100)}%</span>
      <button type="button" aria-label="교재 확대" disabled={zoom >= 2} onClick={() => setZoom(value => Math.min(2, value + 0.25))}>+</button>
    </nav>
    {error && <p role="alert" className="textbook-error">{error}</p>}
    <div ref={viewportRef} className="textbook-pdf-scroll" aria-busy={rendering}>
      {rendering && !error && <p className="textbook-page-loading" role="status">교재를 불러오는 중입니다…</p>}
      <div className="textbook-pdf-stage">
        <div className="textbook-pdf-page" style={{ width: size.width || undefined, height: size.height || undefined }}>
          <canvas ref={canvasRef} aria-label={`${title} ${pageNumber}쪽`} role="img" />
          <span className="sr-only">{pageText}</span>
          {links.map(link => {
            const style = { left: link.left, top: link.top, width: link.width, height: link.height };
            return link.url
              ? <a key={link.id} className="textbook-page-link" style={style} href={link.url} target="_blank" rel="noopener noreferrer" aria-label="교재의 참고 링크 열기" />
              : link.destination ? <button key={link.id} type="button" className="textbook-page-link" style={style} aria-label="교재의 참조 쪽으로 이동" onClick={() => void follow(link.destination!)} /> : null;
          })}
        </div>
      </div>
    </div>
  </div>;
}
