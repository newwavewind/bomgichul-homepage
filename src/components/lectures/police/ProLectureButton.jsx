'use client';

import { useEffect, useState } from 'react';
import createChalkLecture from '../player/createChalkLecture';
import LectureSocial from '../LectureSocial';

export default function ProLectureButton({ lesson, site, subject, initialOpen }) {
  const [player, setPlayer] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function load(signal) {
    setBusy(true);
    setError('');
    try {
      const response = await fetch(`/api/pc-access/lecture/${lesson.id}`, { signal, cache: 'no-store' });
      const definition = await response.json();
      if (!response.ok) throw new Error(definition.error);
      if (!signal?.aborted) setPlayer(() => createChalkLecture(definition));
    } catch (cause) {
      if (!signal?.aborted) setError(cause.message || '강의를 열지 못했어요. 다시 시도해 주세요.');
    } finally {
      if (!signal?.aborted) setBusy(false);
    }
  }
  useEffect(() => {
    if (!initialOpen) return;
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [initialOpen]); // The row is keyed to a single lecture.

  const Player = player;
  const play = onClick => <button className="lecture-preview-button" onClick={onClick} disabled={busy}
    aria-label={`${lesson.number}강 ${lesson.title} 재생`}><span aria-hidden="true">▶</span> {busy ? '여는 중…' : '재생'}</button>;
  if (Player) return <Player lectureId={lesson.id} progressId={`homepage-pro:${lesson.id}`} initialOpen
    renderTrigger={play} renderFooter={() => <LectureSocial lectureId={lesson.id} subject={subject} title={lesson.title} site={site}/>}/>;
  return <>{play(() => void load())}{error && <p className="lecture-load-error" role="alert">{error}</p>}</>;
}
