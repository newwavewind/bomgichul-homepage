'use client';

import { useEffect, useRef, useState } from 'react';
import './textbooks.css';

export type Textbook = {
  id: string; title: string; url?: string; fileName: string; pages: number;
  sha256: string; size?: number; lectureCount?: number;
};

function BookIcon() {
  return <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3h11l3 3v15H5z"/><path d="M15 3v4h4M8 11h8M8 15h8"/></svg>;
}

function TextbookViewer({ book, onClose }: { book: Textbook & {url: string}; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const request = useRef<AbortController | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    dialog.current?.showModal();
    return () => { request.current?.abort(); };
  }, []);
  async function save() {
    setSaving(true); setError('');
    const controller = new AbortController(); request.current = controller;
    try {
      const response = await fetch(book.url, { signal: controller.signal });
      if (!response.ok) throw new Error('download');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a'); link.href = url; link.download = book.fileName;
      document.body.appendChild(link); link.click(); link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (err) {
      if (!(err instanceof Error && err.name === 'AbortError')) setError('저장을 완료하지 못했어요. 새 창에서 PDF를 열어 브라우저의 저장 기능을 이용해 주세요.');
    } finally { setSaving(false); request.current = null; }
  }
  return <dialog ref={dialog} className="textbook-viewer" aria-labelledby="textbook-viewer-title" onCancel={onClose} onClick={event => { if (event.target === dialog.current) onClose(); }}>
    <div className="textbook-viewer-content">
      <header className="textbook-viewer-header">
        <div><p>무료 교재 · {book.pages.toLocaleString()}쪽</p><h2 id="textbook-viewer-title">{book.title}</h2></div>
        <button type="button" className="textbook-close" onClick={onClose} aria-label="교재 닫기">✕</button>
      </header>
      <div className="textbook-viewer-toolbar">
        <span>로그인·구매 없이 열고 저장할 수 있어요.</span>
        <a href={book.url} target="_blank" rel="noopener noreferrer">새 창에서 열기 ↗</a>
        <button type="button" onClick={save} disabled={saving}>{saving ? 'PDF 저장 준비 중…' : 'PDF 저장 ↓'}</button>
      </div>
      {error && <p role="alert" className="textbook-error">{error}</p>}
      <iframe src={book.url} title={`${book.title} PDF`} className="textbook-pdf"/>
    </div>
  </dialog>;
}

export function TextbookButton({ book, label = '교재' }: { book: Textbook; label?: string }) {
  const [open, setOpen] = useState(false);
  if (!book.url) return null;
  return <><button type="button" className="textbook-open" onClick={() => setOpen(true)} aria-label={`${book.title} 샘플 교재 열기`}><BookIcon/>{label}</button>{open && <TextbookViewer key={book.sha256} book={{...book,url:book.url}} onClose={() => setOpen(false)}/>}</>;
}

export function TextbookAppButton({ title, onOpenApp }: { title: string; onOpenApp: () => void }) {
  return <button type="button" className="textbook-open" onClick={onOpenApp} aria-label={`${title} 교재는 과목 구매 후 앱에서 보기`}><BookIcon/>앱에서 교재 보기</button>;
}
