'use client';
import { Component, Suspense, useMemo, useRef, useState } from 'react';
import { AppStoreButtons } from '@/components/ui/AppStoreButtons';
import { formatLectureViewCount } from '@/lib/lecture-views';
import { lectureSiteConfig } from '@/lib/lecture-sites';
import { players } from './players';
import LectureSocial from './LectureSocial';
import { useLectureViewCounts } from './LectureViewCount';
import './samples.css';
import textbooks from './textbooks.json';
import fireTextbooks from './firefighter/textbooks.json';
import { TextbookAppButton, TextbookButton } from './TextbookAccess';
class PlayerBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return <div role="alert" className="lecture-load-error">강의를 불러오지 못했어요. <button onClick={() => window.location.reload()}>새로고침</button></div>;
    return this.props.children;
  }
}
function duration(seconds) { return `${Math.floor(seconds / 60)}분 ${seconds % 60}초`; }
export default function LectureSamples({ lectures, parts, subjectLabel, subject, initialLectureId, site = 'real-estate' }) {
  const siteConfig = lectureSiteConfig(site);
  const dialog = useRef(null);
  const [selected, setSelected] = useState('');
  const [selectedKind, setSelectedKind] = useState('lecture');
  const previewById = new Map(lectures.map(lecture => [lecture.id, lecture]));
  const lessonIds = useMemo(() => parts.flatMap(part => part.sections.flatMap(section => section.lessons.map(lesson => lesson.id))), [parts]);
  const viewCounts = useLectureViewCounts(lessonIds);
  const count = parts.reduce((n, part) => n + part.sections.reduce((m, section) => m + section.lessons.length, 0), 0);
  const openApp = (title, kind = 'lecture') => {
    setSelected(title);
    setSelectedKind(kind);
    dialog.current?.showModal();
  };
  const subjectBooks = site === 'real-estate' ? textbooks.books : site === 'firefighter' ? fireTextbooks.books : {};
  const freeBookCount = site === 'firefighter' ? fireTextbooks.access.freeTextbooksPerSubject : textbooks.access.freeTextbooksPerSubject;
  return <>
    <section className="lecture-curriculum" aria-label={`${subjectLabel} 전체 강의 목록`}>
      <div className="lecture-curriculum-heading"><h2>전체 강의 목록 <span>{count}강</span></h2><span>첫 3강 미리보기</span></div>
      {parts.map((part, partIndex) => <section className="lecture-part" key={part.title} aria-label={part.title}>
        <h3 className="lecture-part-title"><span>{String(partIndex + 1).padStart(2, '0')}</span>{part.title}</h3>
        <ol className="lecture-list">
          {part.sections.flatMap(section => section.lessons.map(lesson => {
            const preview = previewById.get(lesson.id);
            const Player = preview ? players[lesson.id] : null;
            const book = subjectBooks[lesson.id];
            return <li className={`lecture-row${preview ? ' is-preview' : ''}`} key={lesson.id}>
              <span className="lecture-number">{String(lesson.number).padStart(2, '0')}</span>
              <div className="lecture-row-copy"><h4>{lesson.title}</h4><p>{section.title}{` · ${duration(lesson.seconds)}`}{typeof viewCounts[lesson.id] === 'number' ? ` · ${formatLectureViewCount(viewCounts[lesson.id])}` : ''}</p></div>
              <div className="lecture-row-action">
                {preview ? <PlayerBoundary><Suspense fallback={<button className="lecture-preview-button" disabled>준비 중…</button>}>
                  <Player lectureId={lesson.id} progressId={`homepage-sample:${lesson.id}`} initialOpen={initialLectureId === lesson.id} renderFooter={() => <LectureSocial lectureId={lesson.id} subject={subject} title={lesson.title} site={site}/>} renderTrigger={play => <button className="lecture-preview-button" onClick={play} aria-label={`${lesson.number}강 ${lesson.title} 재생`}><span aria-hidden="true">▶</span> 재생</button>}/>
                </Suspense></PlayerBoundary> : <button type="button" className="lecture-app-button" onClick={() => openApp(lesson.title)} aria-label={`${lesson.number}강 ${lesson.title} 앱에서 보기`}>앱에서 보기 <span aria-hidden="true">↗</span></button>}
                {book && (book.url ? <TextbookButton book={book}/> : <TextbookAppButton title={book.title} onOpenApp={() => openApp(book.title, 'book')}/>)}
              </div>
            </li>;
          }))}
        </ol>
      </section>)}
    </section>
    <dialog ref={dialog} className="lecture-download-dialog" aria-labelledby="lecture-download-title" onClick={(event) => { if (event.target === dialog.current) dialog.current.close(); }}>
      <div className="lecture-download-content">
        <button type="button" className="lecture-download-close" onClick={() => dialog.current?.close()} aria-label="닫기">✕</button>
        <p className="lecture-download-kicker">{siteConfig.appName}</p>
        <h2 id="lecture-download-title">{selectedKind === 'book' ? '이 교재는 앱에서 과목 구매 후 이용하세요' : '이 강의는 앱에서 만나 보세요'}</h2>
        <p className="lecture-download-selected">{subjectLabel} · {selected}</p>
        <p className="lecture-download-description">{selectedKind === 'book' ? <>홈페이지에서는 각 과목의 첫 {freeBookCount}강 교재를 미리 볼 수 있어요.<br/>이후 교재는 앱에서 해당 과목 구매 후 강의와 함께 이용하세요.</> : <>홈페이지에서는 첫 3강을 미리 볼 수 있어요.<br/>앱에서 이어서 공부할 수 있어요.</>}</p>
        <AppStoreButtons className="justify-center" links={siteConfig.appLinks}/>
      </div>
    </dialog>
  </>;
}
