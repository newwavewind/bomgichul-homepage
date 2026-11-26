"use client";

import Link from "next/link";
import { Fragment, useDeferredValue, useEffect, useEffectEvent, useMemo, useRef, useState } from "react";
import type { HistoryLibraryAccess } from "@/lib/history-library-access";
import { questionShortcutTarget } from "@/lib/question-shortcuts";
import type {
  HistoryCatalogue, HistoryDynasty, HistoryRecord,
  LibraryView, PersonSummary, RecordKind, SourceSummary,
} from "@/lib/history-library-model";
import { HistoryPersonCard, HistorySourceCard, ReferenceLinks } from "./HistoryLibraryCards";

type Props = {
  catalogue: HistoryCatalogue; access: HistoryLibraryAccess; previewIds?: Record<RecordKind, string[]>;
  initialView: LibraryView; initialRecord: HistoryRecord | null; initialId?: string;
};
type Selection = { kind: RecordKind; id: string; value?: HistoryRecord; error?: string };
const viewTitles = { sources: "사료 모음집", people: "인물 사전", dynasties: "왕조 계보" };
const tabs = ["sources", "people", "dynasties"] as const;
const normalize = (value: string) => value.normalize("NFKC").toLocaleLowerCase("ko").replace(/\s/g, "");
const isSource = (entry: SourceSummary | PersonSummary): entry is SourceSummary => "no" in entry;

export function HistoryLibrary({ catalogue, access, previewIds, initialView, initialRecord, initialId }: Props) {
  const [view, setView] = useState(initialView);
  const [selection, setSelection] = useState<Selection | null>(() => {
    const id = initialRecord?.id ?? initialId;
    return initialView !== "dynasties" && id ? { kind: initialView, id, value: initialRecord ?? undefined } : null;
  });
  const [dynasty, setDynasty] = useState(() => catalogue.dynasties.find(entry => entry.id === initialId) ?? catalogue.dynasties[0]);
  const [query, setQuery] = useState("");
  const [period, setPeriod] = useState("");
  const [theme, setTheme] = useState("");
  const [sort, setSort] = useState("era");
  const deferredQuery = useDeferredValue(query);
  const root = useRef<HTMLDivElement>(null);
  const detail = useRef<HTMLDivElement>(null);
  const cache = useRef(new Map<string, Promise<HistoryRecord>>());
  const peopleById = useMemo(() => new Map(catalogue.people.map(person => [person.id, person])), [catalogue.people]);
  const sourcesById = useMemo(() => new Map(catalogue.sources.map(source => [source.id, source])), [catalogue.sources]);
  const dynastiesById = useMemo(() => new Map(catalogue.dynasties.map(entry => [entry.id, entry])), [catalogue.dynasties]);
  const selectedId = view === "dynasties" ? dynasty?.id ?? initialId : selection?.id;
  const locked = !!selectedId && isLocked(view, selectedId);

  const results = useMemo(() => {
    const words = deferredQuery.trim().split(/\s+/).filter(Boolean).map(normalize);
    if (view === "dynasties") return catalogue.dynastyEras.flatMap(era => {
      if (period && era !== period) return [];
      return catalogue.dynasties.filter(entry => entry.era === era && (words.length
        ? words.every(word => normalize([entry.name, ...entry.aliases, entry.names, ...entry.rulers.flatMap(ruler =>
          [ruler.name, ruler.hanja, ...(ruler.aliases ?? [])])].join(" ")).includes(word))
        : !entry.supplementary));
    });
    const items = catalogue[view].filter(entry => {
      if (isSource(entry)) {
        if (period && entry.period !== period || theme && !entry.themes?.includes(theme)) return false;
        return words.every(word => normalize([entry.no, entry.title, entry.period, entry.yearText, ...(entry.clues ?? [])].join(" ")).includes(word));
      }
      if (period && entry.era !== period) return false;
      return words.every(word => normalize([entry.name, entry.hanja, entry.role, ...entry.aliases].join(" ")).includes(word));
    });
    if (sort === "frequency") items.sort((a, b) => b.count - a.count);
    else if (sort === "name") items.sort((a, b) => label(a).localeCompare(label(b), "ko"));
    return items;
  }, [catalogue, view, deferredQuery, period, theme, sort]);

  function label(entry: SourceSummary | PersonSummary) {
    return isSource(entry) ? entry.title : entry.name;
  }

  function isLocked(kind: LibraryView, id: string) {
    return access !== "granted" && (kind === "dynasties" || !previewIds?.[kind].includes(id));
  }

  function load(kind: RecordKind, id: string) {
    if (initialRecord?.id === id && kind === (initialView === "people" ? "people" : "sources")) {
      return Promise.resolve(initialRecord);
    }
    const key = kind + ":" + id;
    const existing = cache.current.get(key);
    if (existing) return existing;
    const request = fetch("/api/pc-access/history-library?" + new URLSearchParams({ kind, id }), { cache: "no-store" })
      .then(async response => {
        if (!response.ok) throw new Error(response.status === 401 || response.status === 403
          ? "로그인과 구매 연결을 확인한 뒤 다시 열어 주세요."
          : "자료를 불러오지 못했어요.");
        return await response.json() as HistoryRecord;
      }).catch(error => {
        cache.current.delete(key);
        throw error;
      });
    cache.current.set(key, request);
    return request;
  }

  function updateAddress(nextView: LibraryView, id?: string) {
    window.history.replaceState(null, "", "?" + new URLSearchParams({ view: nextView, ...(id ? { id } : {}) }));
  }

  function resetFilters() {
    setQuery("");
    setPeriod("");
    setTheme("");
    setSort("era");
  }

  function scrollToRecord() {
    if (window.matchMedia("(max-width: 899px)").matches) detail.current?.scrollIntoView({ block: "start" });
    else if (detail.current && detail.current.getBoundingClientRect().top < 80) detail.current.scrollIntoView({ block: "start" });
  }

  function openRecord(kind: RecordKind, id: string, scroll = true) {
    if (view !== kind) resetFilters();
    setView(kind);
    updateAddress(kind, id);
    setSelection({ kind, id });
    if (scroll) scrollToRecord();
    if (isLocked(kind, id)) return;
    void load(kind, id).then(
      value => setSelection(current => current?.id === id && current.kind === kind ? { kind, id, value } : current),
      error => setSelection(current => current?.id === id && current.kind === kind ? { kind, id, error: error.message } : current),
    );
  }

  function openDynasty(entry: HistoryDynasty, scroll = true) {
    setDynasty(entry);
    updateAddress("dynasties", entry.id);
    if (scroll) scrollToRecord();
  }

  function switchView(nextView: LibraryView) {
    if (view === nextView) return;
    resetFilters();
    setView(nextView);
    if (nextView === "dynasties") {
      if (dynasty) openDynasty(dynasty, false);
    } else if (catalogue[nextView][0]) openRecord(nextView, catalogue[nextView][0].id, false);
  }

  const periods = view === "sources" ? catalogue.periods : view === "people" ? [...new Set(catalogue.people.map(person => person.era))] : catalogue.dynastyEras;
  const currentIndex = results.findIndex(entry => entry.id === selectedId);
  const previous = currentIndex > 0 ? results[currentIndex - 1] : undefined;
  const next = currentIndex >= 0 ? results[currentIndex + 1] : undefined;
  function choose(entry: typeof results[number]) {
    if ("rulers" in entry) openDynasty(entry);
    else if (view !== "dynasties") openRecord(view, entry.id);
  }

  const navigateByKey = useEffectEvent((event: KeyboardEvent) => {
    const target = questionShortcutTarget(event);
    if (!target || (target !== document.body && target !== document.documentElement && !root.current?.contains(target))) return;
    const entry = event.key === "ArrowLeft" ? previous : event.key === "ArrowRight" ? next : undefined;
    if (!entry) return;
    event.preventDefault();
    choose(entry);
    requestAnimationFrame(() => root.current?.querySelector('.hl-row[aria-current="true"]')?.scrollIntoView({ block: "nearest" }));
  });

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => navigateByKey(event);
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="history-library sry" ref={root}>
      <Link href="/history" className="hl-back">‹ 한국사 기출문제</Link>
      <header className="hl-heading">
        <h1>{viewTitles[view]}</h1>
        {access === "granted" && <span className="pc-access-pro">Pro</span>}
      </header>
      <nav className="hl-view-tabs" aria-label="한국사 학습 자료">
        {tabs.map(mode => (
          <button key={mode} type="button" aria-pressed={view === mode} onClick={() => switchView(mode)}>{viewTitles[mode]}</button>
        ))}
      </nav>
      <div className="hl-workspace">
        <aside className="hl-sidebar" aria-label={viewTitles[view] + " 목록"}>
          <div className="hl-search">
            <input type="search" aria-label={viewTitles[view] + " 검색"} placeholder={view === "sources" ? "번호·사료 제목·단서 검색"
              : view === "people" ? "이름·한자·별칭 검색" : access === "granted" ? "나라·왕 이름 검색" : "나라 이름 검색"} value={query} onChange={event => setQuery(event.target.value)}/>
            <div className="hl-filters">
              <select aria-label="시대" value={period} onChange={event => setPeriod(event.target.value)}>
                <option value="">전체 시대</option>
                {periods.map(value => <option key={value}>{value}</option>)}
              </select>
              {view === "sources" && <select aria-label="주제" value={theme} onChange={event => setTheme(event.target.value)}>
                <option value="">전체 주제</option>{catalogue.themes.map(value => <option key={value}>{value}</option>)}
              </select>}
              {view !== "dynasties" && <select aria-label="정렬" value={sort} onChange={event => setSort(event.target.value)}>
                <option value="era">시대순</option><option value="frequency">출제 빈도순</option><option value="name">이름순</option>
              </select>}
            </div>
            <p className="hl-count" aria-live="polite">{results.length.toLocaleString("ko-KR")}{view === "people" ? "명" : "건"}</p>
          </div>
          <ul className="hl-list">
            {results.map((entry, index) => {
              const source = "no" in entry;
              const meta = source ? [entry.period, entry.yearText] : "rulers" in entry ? [entry.kind, entry.span] : [entry.era, entry.role];
              const previousEntry = results[index - 1];
              const newEra = "rulers" in entry && (!previousEntry || !("rulers" in previousEntry) || previousEntry.era !== entry.era);
              return <Fragment key={entry.id}>
                {newEra && <li className="hl-era-heading">{entry.era}</li>}
                <li>
                <button className="hl-row" type="button" aria-current={entry.id === selectedId || undefined}
                  onClick={() => choose(entry)}>
                  <b>{source ? String(entry.no).padStart(3, "0") : ""}</b>
                  <span><strong>{source ? entry.title : entry.name}</strong><small>{meta.filter(Boolean).join(" · ")}</small></span>
                  {isLocked(view, entry.id) ? <small className="hl-lock-label">Pro</small>
                    : <small>{"count" in entry && entry.count ? `기출 ${entry.count}회` : "›"}</small>}
                </button>
                </li>
              </Fragment>;
            })}
          </ul>
          {results.length === 0 && <p className="hl-empty">검색 결과가 없어요.</p>}
        </aside>
        <div className="hl-detail" ref={detail}>
          {access !== "granted" && locked ? <HistoryLibraryPro access={access} view={view} id={selectedId}/>
            : view === "dynasties" && dynasty ? <DynastyCard key={dynasty.id} dynasty={dynasty} people={peopleById}
              dynasties={dynastiesById} openDynasty={openDynasty} openPerson={id => openRecord("people", id)}/>
            : selection?.kind === view && selection.value ? "no" in selection.value
              ? <HistorySourceCard key={selection.value.id} item={selection.value}/>
              : <HistoryPersonCard key={selection.value.id} item={selection.value} related={sourcesById} people={peopleById}
                openSource={id => openRecord("sources", id)} openPerson={id => openRecord("people", id)}/>
            : <div className="hl-empty" role="status">{selection?.error
              ? <>{selection.error} <button type="button" onClick={() => openRecord(selection.kind, selection.id, false)}>다시 열기</button></>
              : selection ? "자료를 여는 중이에요." : "목록에서 공부할 자료를 선택해 주세요."}</div>}
          {(previous || next) && <nav className="hl-reader-nav" aria-label="이전과 다음 자료">
            <button type="button" aria-keyshortcuts="ArrowLeft" disabled={!previous} onClick={() => previous && choose(previous)}>‹ 이전</button>
            <span className="hl-reader-keys">키보드 <kbd>←</kbd> <kbd>→</kbd>로 자료 이동</span>
            <button type="button" aria-keyshortcuts="ArrowRight" disabled={!next} onClick={() => next && choose(next)}>다음 ›</button>
          </nav>}
        </div>
      </div>
    </div>
  );
}

function HistoryLibraryPro({ access, view, id }: {
  access: Exclude<HistoryLibraryAccess, "granted">; view: LibraryView; id?: string;
}) {
  const returnPath = "/history/library?" + new URLSearchParams({ view, ...(id ? { id } : {}) });
  const title = access === "unavailable" ? "Pro 연결을 확인하지 못했어요" : "이 자료는 Pro에서 볼 수 있어요";
  return <section className="hl-gate" aria-label="한국사 Pro 구매 연결">
    <h2>{title}</h2>
    <p>{access === "unavailable" ? "연결 상태를 확인하려면 다시 열어 주세요."
      : "한국사 심화 앱에서 구매한 학습권을 연결하면 전체 사료, 인물 사전과 왕조 계보를 볼 수 있어요."}</p>
    {access === "login" && <Link href={"/login?next=" + encodeURIComponent(returnPath)}>로그인하고 Pro 연결</Link>}
    {access === "connect" && <Link href="/pc-pro/history?subject=history-history#history-pc-plan">한국사 심화 구매 연결</Link>}
    {access === "unavailable" && <a href={returnPath}>다시 열기</a>}
  </section>;
}

function DynastyCard({ dynasty, people, dynasties, openDynasty, openPerson }: {
  dynasty: HistoryDynasty; people: Map<string, PersonSummary>; dynasties: Map<string, HistoryDynasty>;
  openDynasty: (item: HistoryDynasty) => void; openPerson: (id: string) => void;
}) {
  const [examsOnly, setExamsOnly] = useState(false);
  const rulers = dynasty.rulers.map(ruler => ({ ...ruler, count: ruler.personId ? people.get(ruler.personId)?.count ?? 0 : 0 }));
  const hasExams = rulers.some(ruler => ruler.count > 0);
  const shownRulers = examsOnly ? rulers.filter(ruler => ruler.count > 0) : rulers;
  const related = dynasty.related.flatMap(id => dynasties.get(id) ?? []);
  return <article className="sry-card hpd-profile" aria-label={dynasty.name + " 계보"}>
    <header className="hpd-profile-head">
      <p className="hl-meta">{dynasty.era} · {dynasty.kind}</p><h2 className="hpd-profile-title">{dynasty.name}</h2>
      {dynasty.span && <p className="hl-reign-span">{dynasty.span}</p>}
      {dynasty.detail && <p className="sry-sec__p">{dynasty.detail}</p>}
    </header>
    <div className="sry-card__body">
      <section aria-label="왕위 계승 순서">
        <h3 className="sry-sec__label">{rulers.length ? (rulers.every(ruler => ruler.order) ? "재위 기간" : "문헌에 전하는 지배자") : "남아 있는 기록"}</h3>
        {dynasty.note && <p className="sry-orig sry-sec__p">{dynasty.note}</p>}
        {hasExams && <div className="hl-view-tabs hl-reign-filter" aria-label="왕위 순서 범위">
          <button type="button" aria-pressed={!examsOnly} onClick={() => setExamsOnly(false)}>전체</button>
          <button type="button" aria-pressed={examsOnly} onClick={() => setExamsOnly(true)}>기출 연결 왕</button>
        </div>}
        {shownRulers.length > 0 && <ol className="hl-reign-list">{shownRulers.map(ruler => {
          const contents = <><span className="hl-reign-span">{ruler.period}</span><span className="hl-reign-dot" aria-hidden="true"/>
            <span className="hl-reign-name">{ruler.order && <small>제{ruler.order}대</small>}<strong>{ruler.name}</strong>
              {ruler.hanja && <small lang="ko-Hani">{ruler.hanja}</small>}</span>
            {ruler.count > 0 && <small className="hl-reign-count">기출 {ruler.count}문항</small>}</>;
          const personId = ruler.personId;
          return <li key={ruler.id}>{personId
            ? <button type="button" className="hl-reign-row" onClick={() => openPerson(personId)}>{contents}</button>
            : <div className="hl-reign-row">{contents}</div>}</li>;
        })}</ol>}
      </section>
      {dynasty.names && <p className="sry-sec__p"><strong>사료에 전하는 나라 이름</strong> {dynasty.names}</p>}
      {!!related.length && <section>
        <h3 className="sry-sec__label">관련 나라와 시대</h3>
        <div className="hl-related">{related.map(entry => <button type="button" key={entry.id} onClick={() => openDynasty(entry)}>{entry.name} ›</button>)}</div>
      </section>}
      <ReferenceLinks links={dynasty.sources}/>
    </div>
  </article>;
}
