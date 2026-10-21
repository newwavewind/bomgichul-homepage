#!/usr/bin/env node
/**
 * 경비지도사·감정평가사·물류관리사·청소년상담사·한국사 다섯 트랙의 「교재 목차」를 앱에서 옮겨 온다(2026-10-21).
 *
 * - 경비·감정·물류·청소년: 앱 `data/taxonomy-<과목>.json`(편=category → 장=chapter → 절=subcategory, unit_id)
 *   문항의 절은 앱 `src/data/exam/<과목>-<연도>-<회차>.json` 의 taxonomy_unit_id 를 먼저 믿고,
 *   없으면 홈페이지 문항의 taxonomyUnitId, 그래도 없으면 (category, subcategory) 로 찾는다.
 * - 한국사: 앱 `data/history/curriculum.json`(편 → 장 → 필터{category, subcategory}),
 *   문항 분류는 앱 `src/data/subjects/history/exam/<회차>.json` 을 먼저, 없으면 홈페이지 값.
 * - 목차를 못 찾은 과목은 홈페이지 category(편)·subcategory(장)를 문항번호 평균 순으로 세운다(대체).
 *
 *   node scripts/toc/build-toc-c.mjs
 * 출력: src/data/exam-toc/{gyeongbi,gamjeong,mullyu,youth,history}.json
 */
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const HOME = os.homedir()
const OUT_DIR = path.join(ROOT, 'src/data/exam-toc')

const TRACKS = {
  gyeongbi: { kind: 'taxonomy', app: path.join(HOME, 'gyeongbibomgichul') },
  gamjeong: { kind: 'taxonomy', app: path.join(HOME, 'gamjeongbomgichul') },
  mullyu: { kind: 'taxonomy', app: path.join(HOME, 'mullyubomgichul') },
  youth: { kind: 'taxonomy', app: path.join(HOME, 'youthbomgichul') },
  history: { kind: 'curriculum', app: path.join(HOME, 'historybomgichul') },
}

const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'))
const cleanPart = (s) => String(s || '').replace(/^PART\s*\d+\s*/i, '').replace(/　/g, ' ').trim()
const cleanChapter = (s) =>
  String(s || '')
    .replace(/^CHAPTER\s*\d+\s*/i, '')
    .replace(/^제\s*\d+\s*장\s*/, '')
    .replace(/　/g, ' ')
    .trim()
const qKey = (sourceCode, year, no) => `${sourceCode}|${year}|${no}`
const pad = (n) => String(n).padStart(2, '0')
const asList = (json) => (Array.isArray(json) ? json : json.questions || Object.values(json)[0])

function homepageSubjects(track) {
  const dir = path.join(ROOT, 'src/data', track)
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json') && f !== 'manifest.json')
    .map((f) => readJson(path.join(dir, f)))
    .filter((d) => d && d.subject && Array.isArray(d.exams))
}

/* ---------- 앱 taxonomy ---------- */
function loadTaxonomyApp(app) {
  const dataDir = path.join(app, 'data')
  const bySubjectId = new Map()
  for (const f of fs.readdirSync(dataDir).filter((f) => /^taxonomy-.+\.json$/.test(f))) {
    const name = f.replace(/^taxonomy-/, '').replace(/\.json$/, '')
    const units = [...readJson(path.join(dataDir, f)).units].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    const prefix = String(units[0]?.unit_id || '').replace(/-\d+-\d+$/, '')
    bySubjectId.set(prefix, { name, units })
  }
  // 앱 문항: 과목 이름 → key → 문항
  const examDir = path.join(app, 'src/data/exam')
  const appQuestions = new Map()
  for (const f of fs.readdirSync(examDir).filter((f) => f.endsWith('.json'))) {
    const name = f.replace(/-\d{4}-[^-]+\.json$/, '')
    if (!appQuestions.has(name)) appQuestions.set(name, new Map())
    for (const q of asList(readJson(path.join(examDir, f)))) {
      appQuestions.get(name).set(qKey(q.source_code, q.year, q.question_no), q)
    }
  }
  return { bySubjectId, appQuestions }
}

function buildFromTaxonomy(subject, tax, appQs) {
  const parts = []
  const partIdx = new Map()
  const chapterIdByUnit = new Map()
  const chapterIdByCatSub = new Map()
  const chapterKeyToId = new Map()
  for (const u of tax.units) {
    if (!u.category || u.category === '미분류') continue
    if (!partIdx.has(u.category)) {
      partIdx.set(u.category, parts.length)
      parts.push({ label: cleanPart(u.category), chapters: [] })
    }
    const pi = partIdx.get(u.category)
    const ck = `${u.category}::${u.chapter || u.subcategory}`
    if (!chapterKeyToId.has(ck)) {
      const id = `p${pi + 1}-c${pad(parts[pi].chapters.length + 1)}`
      chapterKeyToId.set(ck, id)
      parts[pi].chapters.push({ id, label: cleanChapter(u.chapter || u.subcategory) })
    }
    const id = chapterKeyToId.get(ck)
    chapterIdByUnit.set(u.unit_id, id)
    chapterIdByCatSub.set(`${u.category}::${u.subcategory}`, id)
  }
  const byQuestion = {}
  const stats = { total: 0, mapped: 0, appMatched: 0, unitDisagree: 0, viaCatSub: 0 }
  for (const e of subject.exams) {
    stats.total += 1
    const key = qKey(e.sourceCode, e.year, e.questionNo)
    const aq = appQs?.get(key)
    if (aq) stats.appMatched += 1
    if (aq?.taxonomy_unit_id && e.taxonomyUnitId && aq.taxonomy_unit_id !== e.taxonomyUnitId) stats.unitDisagree += 1
    let ch = chapterIdByUnit.get(aq?.taxonomy_unit_id) || chapterIdByUnit.get(e.taxonomyUnitId)
    if (!ch) {
      ch =
        chapterIdByCatSub.get(`${aq?.category}::${aq?.subcategory}`) ||
        chapterIdByCatSub.get(`${e.category}::${e.subcategory}`)
      if (ch) stats.viaCatSub += 1
    }
    if (ch) {
      byQuestion[key] = ch
      stats.mapped += 1
    }
  }
  return { entry: { parts, byQuestion }, stats }
}

/* ---------- 앱 curriculum (한국사) ---------- */
function buildFromCurriculum(subject, app) {
  const cur = readJson(path.join(app, 'data/history/curriculum.json'))
  const filters = []
  const parts = cur.parts.map((part, pi) => ({
    label: part.shortLabel || cleanPart(part.label),
    chapters: part.chapters.map((ch, ci) => {
      const id = `p${pi + 1}-c${pad(ci + 1)}`
      for (const f of ch.filters || []) filters.push({ ...f, chapter: id })
      return { id, label: ch.shortLabel || cleanChapter(ch.label) }
    }),
  }))
  const appQs = new Map()
  const examDir = path.join(app, 'src/data/subjects/history/exam')
  for (const f of fs.readdirSync(examDir).filter((f) => /^\d+\.json$/.test(f))) {
    for (const q of asList(readJson(path.join(examDir, f)))) appQs.set(`${q.round}|${q.question_no}`, q)
  }
  const find = (q) =>
    q &&
    filters.find((f) => f.category === q.category && (f.subcategory == null || f.subcategory === q.subcategory))
  const byQuestion = {}
  const stats = { total: 0, mapped: 0, appMatched: 0, unitDisagree: 0, viaCatSub: 0 }
  for (const e of subject.exams) {
    stats.total += 1
    const round = e.round ?? Number(String(e.sourceCode).replace(/\D/g, ''))
    const aq = appQs.get(`${round}|${e.questionNo}`)
    if (aq) stats.appMatched += 1
    if (aq && (aq.category !== e.category || aq.subcategory !== e.subcategory)) stats.unitDisagree += 1
    const hit = find(aq) || find(e)
    if (hit) {
      byQuestion[qKey(e.sourceCode, e.year, e.questionNo)] = hit.chapter
      stats.mapped += 1
    }
  }
  return { entry: { parts, byQuestion }, stats }
}

/* ---------- 대체: 홈페이지 category/subcategory ---------- */
function buildFallback(subject) {
  const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length
  const cats = new Map()
  for (const e of subject.exams) {
    if (!cats.has(e.category)) cats.set(e.category, new Map())
    const subs = cats.get(e.category)
    const sub = e.subcategory || e.category
    if (!subs.has(sub)) subs.set(sub, [])
    subs.get(sub).push(e)
  }
  const catOrder = [...cats.entries()]
    .map(([c, subs]) => [c, subs, avg([...subs.values()].flat().map((e) => e.questionNo))])
    .sort((a, b) => a[2] - b[2])
  const parts = []
  const byQuestion = {}
  catOrder.forEach(([c, subs], pi) => {
    const subOrder = [...subs.entries()].sort((a, b) => avg(a[1].map((e) => e.questionNo)) - avg(b[1].map((e) => e.questionNo)))
    parts.push({
      label: cleanPart(c),
      chapters: subOrder.map(([s, list], ci) => {
        const id = `p${pi + 1}-c${pad(ci + 1)}`
        for (const e of list) byQuestion[qKey(e.sourceCode, e.year, e.questionNo)] = id
        return { id, label: cleanChapter(s) }
      }),
    })
  })
  const n = subject.exams.length
  return { entry: { parts, byQuestion }, stats: { total: n, mapped: Object.keys(byQuestion).length, appMatched: 0, unitDisagree: 0, viaCatSub: 0 } }
}

/* ---------- 실행 ---------- */
fs.mkdirSync(OUT_DIR, { recursive: true })
let problems = 0
for (const [track, cfg] of Object.entries(TRACKS)) {
  const subjects = homepageSubjects(track)
  const app = cfg.kind === 'taxonomy' && fs.existsSync(cfg.app) ? loadTaxonomyApp(cfg.app) : null
  const out = {}
  for (const subject of subjects) {
    const sid = subject.subject.id
    let res
    let source
    if (cfg.kind === 'taxonomy' && app?.bySubjectId.has(sid)) {
      const tax = app.bySubjectId.get(sid)
      res = buildFromTaxonomy(subject, tax, app.appQuestions.get(tax.name))
      source = `taxonomy-${tax.name}`
    } else if (cfg.kind === 'curriculum' && fs.existsSync(path.join(cfg.app, 'data/history/curriculum.json'))) {
      res = buildFromCurriculum(subject, cfg.app)
      source = 'curriculum'
    } else {
      res = buildFallback(subject)
      source = 'FALLBACK'
    }
    // 검증: 걸린 장이 목차에 있는지
    const ids = new Set(res.entry.parts.flatMap((p) => p.chapters.map((c) => c.id)))
    const bad = Object.values(res.entry.byQuestion).filter((id) => !ids.has(id)).length
    const empty = res.entry.parts.flatMap((p) => p.chapters).filter((c) => !Object.values(res.entry.byQuestion).includes(c.id))
    if (bad || res.stats.mapped !== res.stats.total) problems += 1
    out[sid] = res.entry
    const s = res.stats
    console.log(
      `${track}/${sid} [${source}] 편 ${res.entry.parts.length} · 장 ${ids.size} · ${s.mapped}/${s.total}` +
        ` · 앱대응 ${s.appMatched} · 분류불일치 ${s.unitDisagree}` +
        (s.viaCatSub ? ` · 분류명으로 ${s.viaCatSub}` : '') +
        (empty.length ? ` · 빈 장 ${empty.map((c) => c.label).join(', ')}` : '') +
        (bad ? ` · 잘못된 장 ${bad}` : ''),
    )
  }
  const file = path.join(OUT_DIR, `${track}.json`)
  fs.writeFileSync(file, JSON.stringify(out) + '\n')
  JSON.parse(fs.readFileSync(file, 'utf8'))
}
if (problems) {
  console.error(`문제 있는 과목 ${problems}`)
  process.exitCode = 1
}
