'use client';

import { useEffect, useState } from 'react';
import { sourcePreviewKey, type ExamSourcePreview } from '@/lib/exam-source-preview';
import type { ExplanationSource } from './ExamExplanationSources';

export function ExplanationSourceLinks({ sources }: { sources: ExplanationSource[] }) {
  const [active, setActive] = useState<number | null>(null);
  const [loaded, setLoaded] = useState<{ query: string; previews: Record<string, ExamSourcePreview> } | null>(null);
  const keys = sources.map(({ url, label }) => sourcePreviewKey(url, label));
  const query = new URLSearchParams([...new Set(keys.filter((key): key is string => Boolean(key)))]
    .map(key => ['key', key])).toString();

  useEffect(() => {
    if (!query) return;
    const controller = new AbortController();
    void fetch('/api/exam-sources?' + query, { signal: controller.signal })
      .then(async response => response.ok ? (await response.json()).previews : {})
      .then(previews => { if (!controller.signal.aborted) setLoaded({ query, previews }); })
      .catch(() => { if (!controller.signal.aborted) setLoaded({ query, previews: {} }); });
    return () => controller.abort();
  }, [query]);

  const expanded = active === null ? null : sources[active];
  const key = active === null ? null : keys[active];
  const preview = key && loaded?.query === query ? loaded.previews[key] : null;
  return <div className="exam-explanation-sources">
    <span className="exam-explanation-sources-title">근거</span>
    {sources.map(({ label, url }, index) => <button type="button" key={url + '|' + label}
      className="exam-explanation-source-link" aria-expanded={index === active}
      onClick={() => setActive(previous => previous === index ? null : index)}>
      <span>{label}</span>
      <span className="exam-explanation-source-arrow" aria-hidden>{index === active ? '▴' : '▾'}</span>
    </button>)}
    {expanded && <section className="exam-source-preview" aria-label={expanded.label + ' 근거'}>
      <strong>{preview?.title ?? expanded.label}</strong>
      {preview?.date && <small>{preview.date}</small>}
      {preview?.lines.map((line, index) => <p key={index}>{line}</p>)}
      <a href={preview?.url ?? expanded.url} target="_blank" rel="noopener noreferrer">원문 페이지 열기 ↗<span className="sr-only"> (새 창에서 열림)</span></a>
    </section>}
  </div>;
}
