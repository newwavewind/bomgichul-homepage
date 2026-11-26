"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useRef, useState } from "react";
import type {
  HistoryCatalogue, HistoryDynasty, HistoryRecord,
  LibraryView, PersonSummary, RecordKind, SourceSummary,
} from "@/lib/history-library-model";
import { HistoryPersonCard, HistorySourceCard, ReferenceLinks } from "./HistoryLibraryCards";

type Props = { catalogue: HistoryCatalogue; initialView: LibraryView; initialRecord: HistoryRecord | null; initialId?: string };
type Selection = { kind: RecordKind; id: string; value?: HistoryRecord; error?: string };
const viewTitles = { sources: "사료 모음집", people: "인물 사전", dynasties: "왕조 계보" };
const normalize = (value: string) => value.normalize("NFKC").toLocaleLowerCase("ko").replace(/\s/g, "");
const isSource = (entry: SourceSummary | PersonSummary): entry is SourceSummary => "no" in entry;

export function HistoryLibrary({ catalogue, initialView, initialRecord, initialId }: Props) {
  const [view, setView] = useState(initialView);
  const [selection, setSelection] = useState<Selection | null>(() => initialRecord
    ? { kind: initialView === "people" ? "people" : "sources", id: initialRecord.id, value: initialRecord }
    : null);
  const [dynasty, setDynasty] = useState(() => catalogue.dynasties.find(entry => entry.id === initialId) ?? catalogue.dynasties[0]);
  const [query, setQuery] = useState("");
  const [period, setPeriod] = useState("");
  const [theme, setTheme] = useState("");
  const [sort, setSort] = useState("era");
  const deferredQuery = useDeferredValue(query);
  const detail = useRef<HTMLDivElement>(null);
  const cache = useRef(new Map<string, Promise<HistoryRecord>>());
  const peopleById = useMemo(() => new Map(catalogue.people.map(person => [person.id, person])), [catalogue.people]);
  const sourcesById = useMemo(() => new Map(catalogue.sources.map(source => [source.id, source])), [catalogue.sources]);

  const results = useMemo(() => {
    const words = deferredQuery.trim().split(/\s+/).filter(Boolean).map(normalize);
    if (view === "dynasties") return catalogue.dynasties.filter(entry =>
      (!period || entry.era === period) && words.every(word => normalize([entry.name, entry.era, ...entry.rulers.map(ruler => ruler.name)].join(" ")).includes(word)));
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
    void load(kind, id).then(
      value => setSelection(current => current?.id === id && current.kind === kind ? { kind, id, value } : current),
      error => setSelection(current => current?.id === id && current.kind === kind ? { kind, id, error: error.message } : current),
    );
    if (scroll) scrollToRecord();
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
    if (nextView === "dynasties") openDynasty(dynasty, false);
    else if (catalogue[nextView][0]) openRecord(nextView, catalogue[nextView][0].id, false);
  }

  const periods = view === "sources" ? catalogue.periods : view === "people" ? [...new Set(catalogue.people.map(person => person.era))] : catalogue.dynastyEras;
  const currentIndex = results.findIndex(entry => entry.id === (view === "dynasties" ? dynasty?.id : selection?.id));
  const previous = currentIndex > 0 ? results[currentIndex - 1] : undefined;
  const next = currentIndex >= 0 ? results[currentIndex + 1] : undefined;
  function choose(entry: typeof results[number]) {
    if ("rulers" in entry) openDynasty(entry);
    else if (view !== "dynasties") openRecord(view, entry.id);
  }

  return (
    <div className="history-library sry">
      <Link href="/history" className="hl-back">‹ 한국사 기출문제</Link>
      <header className="hl-heading"><h1>{viewTitles[view]}</h1><span className="pc-access-pro">Pro</span></header>
      <nav className="hl-view-tabs" aria-label="한국사 학습 자료">
        {(["sources", "people", "dynasties"] as const).map(mode => (
          <button key={mode} type="button" aria-pressed={view === mode} onClick={() => switchView(mode)}>{viewTitles[mode]}</button>
        ))}
      </nav>
      <div className="hl-workspace">
        <aside className="hl-sidebar" aria-label={viewTitles[view] + " 목록"}>
          <div className="hl-search">
            <input type="search" aria-label={viewTitles[view] + " 검색"} placeholder={view === "sources" ? "번호·사료 제목·단서 검색" : view === "people" ? "이름·한자·별칭 검색" : "왕조·왕 이름 검색"} value={query} onChange={event => setQuery(event.target.value)}/>
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
            {results.map(entry => {
              const source = "no" in entry;
              const meta = source ? [entry.period, entry.yearText] : "rulers" in entry ? [entry.era, entry.period] : [entry.era, entry.role];
              return <li key={entry.id}>
                <button className="hl-row" type="button" aria-current={entry.id === (view === "dynasties" ? dynasty?.id : selection?.id) || undefined}
                  onClick={() => choose(entry)}>
                  <b>{source ? String(entry.no).padStart(3, "0") : ""}</b>
                  <span><strong>{source ? entry.title : entry.name}</strong><small>{meta.filter(Boolean).join(" · ")}</small></span>
                  <small>{"count" in entry && entry.count ? `기출 ${entry.count}회` : "›"}</small>
                </button>
              </li>;
            })}
          </ul>
          {results.length === 0 && <p className="hl-empty">검색 결과가 없어요.</p>}
        </aside>
        <div className="hl-detail" ref={detail}>
          {view === "dynasties" && dynasty ? <DynastyCard dynasty={dynasty} openPerson={id => openRecord("people", id)}/>
            : selection?.kind === view && selection.value ? "no" in selection.value
              ? <HistorySourceCard key={selection.value.id} item={selection.value}/>
              : <HistoryPersonCard key={selection.value.id} item={selection.value} related={sourcesById} people={peopleById}
                openSource={id => openRecord("sources", id)} openPerson={id => openRecord("people", id)}/>
            : <div className="hl-empty" role="status">{selection?.error
              ? <>{selection.error} <button type="button" onClick={() => openRecord(selection.kind, selection.id, false)}>다시 열기</button></>
              : selection ? "자료를 여는 중이에요." : "목록에서 공부할 자료를 선택해 주세요."}</div>}
          {(previous || next) && <nav className="hl-reader-nav" aria-label="이전과 다음 자료">
            <button type="button" disabled={!previous} onClick={() => previous && choose(previous)}>‹ 이전</button>
            <button type="button" disabled={!next} onClick={() => next && choose(next)}>다음 ›</button>
          </nav>}
        </div>
      </div>
    </div>
  );
}

function DynastyCard({ dynasty, openPerson }: { dynasty: HistoryDynasty; openPerson: (id: string) => void }) {
  return <article className="sry-card hpd-profile">
    <header className="hpd-profile-head">
      <p className="hl-meta">{dynasty.era} {dynasty.period}</p><h2 className="hpd-profile-title">{dynasty.name}</h2>
      {dynasty.note && <p className="sry-sec__p">{dynasty.note}</p>}
    </header>
    <div className="sry-card__body">
      <section><h3 className="sry-sec__label">역대 왕</h3>
        <ol className="hl-rulers">{dynasty.rulers.map(ruler => {
          const contents = <><strong>{ruler.name}</strong><small>{[ruler.hanja, ruler.period].filter(Boolean).join(" · ")}</small></>;
          const personId = ruler.personId;
          return <li key={ruler.id}>{personId
            ? <button type="button" onClick={() => openPerson(personId)}>{contents}</button>
            : contents}</li>;
        })}</ol>
      </section>
      <ReferenceLinks links={dynasty.sources}/>
    </div>
  </article>;
}
