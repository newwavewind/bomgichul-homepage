#!/usr/bin/env node
/**
 * 여섯 시험(국어·행정사·세무사·노무사·손해평가사·산업안전지도사)의 「교재 목차」를 앱에서 옮겨 온다(2026-10-21).
 *
 * - 국어: 앱 data/gugeo/curriculum.json(편 → 장 → {category, subcategory} 필터).
 *   문항 배정은 앱 src/data/subjects/{national,local}/exam/<연도>.json 의 category·subcategory, 없으면 홈페이지 값.
 * - 나머지 다섯: 앱 data/taxonomy-<과목>.json(units: category=편, chapter=장, subcategory=절, unit_id).
 *   문항 배정은 앱 src/data/exam/<과목>-<연도>-<회차>.json 의 taxonomy_unit_id, 없으면 홈페이지 taxonomyUnitId.
 *
 * 결과: src/data/exam-toc/<track>.json
 *   { <subjectId>: { parts: [{ label, chapters: [{ id, label }] }], byQuestion: { "<sourceCode>|<year>|<questionNo>": chapterId } } }
 *
 *   node scripts/toc/build-toc-b.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const HOME = os.homedir()
const OUT_DIR = path.join(ROOT, 'src/data/exam-toc')
const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'))

const TRACKS = {
  gugeo: { app: 'gugeobomgichul', kind: 'curriculum' },
  haengjeongsa: { app: 'haengjeongsabomgichul', kind: 'taxonomy' },
  semusa: { app: 'semusabomgichul', kind: 'taxonomy' },
  nomusa: { app: 'nomusabomgichul', kind: 'taxonomy' },
  sonhae: { app: 'sonhaebomgichul', kind: 'taxonomy' },
  sanan: { app: 'sananbomgichul', kind: 'taxonomy' },
}

const cleanPart = (s) =>
  String(s || '').replace(/　/g, ' ').replace(/^(PART\s*\d+|제\s*\d+\s*편)\s*/i, '').trim()
const cleanChapter = (s) =>
  String(s || '').replace(/　/g, ' ').replace(/^(CHAPTER\s*\d+|제\s*\d+\s*장(\s*[~·∼-]\s*제\s*\d+\s*장)?)\s*/i, '').trim()
const normLabel = (s) => String(s).replace(/[()（）\s]/g, '')
const qKey = (e) => `${e.sourceCode}|${e.year}|${e.questionNo}`

function homepageSubjects(track) {
  const dir = path.join(ROOT, 'src/data', track)
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json') && f !== 'manifest.json')
    .map((f) => readJson(path.join(dir, f)))
    .filter((j) => j && j.subject && Array.isArray(j.exams))
}

/* ---------- taxonomy 앱 ---------- */
function loadTaxonomies(appDir) {
  const dir = path.join(appDir, 'data')
  const list = []
  for (const f of fs.readdirSync(dir).filter((f) => /^taxonomy-.+\.json$/.test(f))) {
    const label = f.replace(/^taxonomy-|\.json$/g, '')
    const units = [...readJson(path.join(dir, f)).units].sort((a, b) => a.order - b.order)
    list.push({ label, units })
  }
  return list
}

function loadAppTaxonomyAssignments(appDir) {
  // key: `${normLabel(subject)}|${round}|${year}|${qno}` → unit_id
  const dir = path.join(appDir, 'src/data/exam')
  const map = new Map()
  for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.json'))) {
    const m = f.match(/^(.+)-(\d{4})-(제\d+회)\.json$/)
    if (!m) continue
    const list = readJson(path.join(dir, f))
    if (!Array.isArray(list)) continue
    for (const q of list) {
      if (q.taxonomy_unit_id) map.set(`${normLabel(m[1])}|${m[3]}|${q.year}|${q.question_no}`, q.taxonomy_unit_id)
    }
  }
  return map
}

function buildFromTaxonomy(track, appDir) {
  const taxonomies = loadTaxonomies(appDir)
  const unitOwner = new Map()
  for (const t of taxonomies) for (const u of t.units) unitOwner.set(u.unit_id, t)
  const appAssign = loadAppTaxonomyAssignments(appDir)
  const out = {}
  const report = []
  for (const subj of homepageSubjects(track)) {
    const exams = subj.exams
    // 이 과목이 쓰는 taxonomy: 홈페이지 taxonomyUnitId 가 가장 많이 걸린 파일
    const votes = new Map()
    for (const e of exams) {
      const t = unitOwner.get(e.taxonomyUnitId)
      if (t) votes.set(t, (votes.get(t) || 0) + 1)
    }
    const tax = [...votes.entries()].sort((a, b) => b[1] - a[1])[0]?.[0]
    if (!tax) {
      report.push({ subject: subj.subject.id, note: 'taxonomy 없음 → fallback' })
      out[subj.subject.id] = buildFallback(exams, report.at(-1))
      continue
    }
    const parts = []
    const unitToChapter = new Map()
    let part = null
    let chapter = null
    for (const u of tax.units) {
      if (!part || part.raw !== u.category) {
        part = { raw: u.category, label: cleanPart(u.category), chapters: [] }
        parts.push(part)
        chapter = null
      }
      const chRaw = u.chapter || u.subcategory
      if (!chapter || chapter.raw !== chRaw) {
        const pi = parts.length
        const ci = part.chapters.length + 1
        chapter = { raw: chRaw, id: `p${pi}-c${String(ci).padStart(2, '0')}`, label: cleanChapter(chRaw) }
        part.chapters.push(chapter)
      }
      unitToChapter.set(u.unit_id, chapter.id)
    }
    const byQuestion = {}
    let fromApp = 0
    let fromHome = 0
    let disagree = 0
    for (const e of exams) {
      const appUnit = appAssign.get(`${normLabel(tax.label)}|${e.sourceCode}|${e.year}|${e.questionNo}`)
      let ch = appUnit && unitToChapter.get(appUnit)
      if (ch) fromApp += 1
      else {
        ch = unitToChapter.get(e.taxonomyUnitId)
        if (ch) fromHome += 1
      }
      if (appUnit && e.taxonomyUnitId && appUnit !== e.taxonomyUnitId) disagree += 1
      if (ch) byQuestion[qKey(e)] = ch
    }
    out[subj.subject.id] = {
      parts: parts.map((p) => ({ label: p.label, chapters: p.chapters.map(({ id, label }) => ({ id, label })) })),
      byQuestion,
    }
    report.push({
      subject: subj.subject.id,
      source: `taxonomy-${tax.label}`,
      parts: parts.length,
      chapters: parts.reduce((n, p) => n + p.chapters.length, 0),
      mapped: Object.keys(byQuestion).length,
      total: exams.length,
      fromApp,
      fromHome,
      disagree,
    })
  }
  return { out, report }
}

/* ---------- curriculum 앱(국어) ---------- */
function buildGugeo(appDir) {
  const cur = readJson(path.join(appDir, 'data/gugeo/curriculum.json'))
  const filters = []
  const parts = cur.parts.map((p) => ({
    label: p.shortLabel || cleanPart(p.label),
    chapters: p.chapters.map((ch) => {
      for (const f of ch.filters || []) filters.push({ ...f, chapter: ch.id })
      return { id: ch.id, label: ch.shortLabel || cleanChapter(ch.label) }
    }),
  }))
  const findChapter = (q) =>
    filters.find((f) => f.category === q.category && (f.subcategory == null || f.subcategory === q.subcategory))?.chapter
  // 앱 문항: series(national/local) + 연도 + 번호
  const SERIES = { national: '국가직', local: '지방직' }
  const app = new Map()
  for (const [series, code] of Object.entries(SERIES)) {
    const dir = path.join(appDir, `src/data/subjects/${series}/exam`)
    if (!fs.existsSync(dir)) continue
    for (const f of fs.readdirSync(dir).filter((f) => /^\d{4}\.json$/.test(f))) {
      const j = readJson(path.join(dir, f))
      const list = Array.isArray(j) ? j : j.questions || Object.values(j)[0]
      for (const q of list) app.set(`${code}|${q.year}|${q.question_no}`, q)
    }
  }
  const out = {}
  const report = []
  for (const subj of homepageSubjects('gugeo')) {
    const byQuestion = {}
    let fromApp = 0
    let fromHome = 0
    let disagree = 0
    for (const e of subj.exams) {
      const a = app.get(qKey(e))
      let ch = a && findChapter(a)
      if (ch) fromApp += 1
      else {
        ch = findChapter(e)
        if (ch) fromHome += 1
      }
      if (a && findChapter(a) !== findChapter(e)) disagree += 1
      if (ch) byQuestion[qKey(e)] = ch
    }
    out[subj.subject.id] = { parts, byQuestion }
    report.push({
      subject: subj.subject.id,
      source: 'curriculum(data/gugeo/curriculum.json)',
      parts: parts.length,
      chapters: parts.reduce((n, p) => n + p.chapters.length, 0),
      mapped: Object.keys(byQuestion).length,
      total: subj.exams.length,
      fromApp,
      fromHome,
      disagree,
    })
  }
  return { out, report }
}

/* ---------- 대체: 홈페이지 category → 편, subcategory → 장, 평균 문항번호 순 ---------- */
function buildFallback(exams, rep) {
  const avg = (arr) => arr.reduce((s, x) => s + x, 0) / arr.length
  const cats = new Map()
  for (const e of exams) {
    const c = cats.get(e.category) || { nos: [], subs: new Map() }
    c.nos.push(e.questionNo)
    const s = c.subs.get(e.subcategory) || []
    s.push(e)
    c.subs.set(e.subcategory, s)
    cats.set(e.category, c)
  }
  const byQuestion = {}
  const parts = [...cats.entries()]
    .sort((a, b) => avg(a[1].nos) - avg(b[1].nos))
    .map(([label, c], pi) => ({
      label,
      chapters: [...c.subs.entries()]
        .sort((a, b) => avg(a[1].map((e) => e.questionNo)) - avg(b[1].map((e) => e.questionNo)))
        .map(([sub, list], ci) => {
          const id = `p${pi + 1}-c${String(ci + 1).padStart(2, '0')}`
          for (const e of list) byQuestion[qKey(e)] = id
          return { id, label: sub || label }
        }),
    }))
  Object.assign(rep, {
    source: 'fallback',
    parts: parts.length,
    chapters: parts.reduce((n, p) => n + p.chapters.length, 0),
    mapped: Object.keys(byQuestion).length,
    total: exams.length,
  })
  return { parts, byQuestion }
}

/* ---------- 실행 ---------- */
fs.mkdirSync(OUT_DIR, { recursive: true })
for (const [track, cfg] of Object.entries(TRACKS)) {
  const appDir = path.join(HOME, cfg.app)
  const { out, report } = cfg.kind === 'curriculum' ? buildGugeo(appDir) : buildFromTaxonomy(track, appDir)
  // 검증: byQuestion 의 장 id 가 parts 에 있는지, 중복 id 없는지
  for (const [sid, v] of Object.entries(out)) {
    const ids = v.parts.flatMap((p) => p.chapters.map((c) => c.id))
    if (new Set(ids).size !== ids.length) throw new Error(`${track}/${sid}: 장 id 중복`)
    const idSet = new Set(ids)
    for (const [k, ch] of Object.entries(v.byQuestion)) if (!idSet.has(ch)) throw new Error(`${track}/${sid}: ${k} → 없는 장 ${ch}`)
  }
  const file = path.join(OUT_DIR, `${track}.json`)
  fs.writeFileSync(file, JSON.stringify(out) + '\n')
  JSON.parse(fs.readFileSync(file, 'utf8'))
  for (const r of report) {
    console.log(
      `${track}/${r.subject}: 편 ${r.parts} · 장 ${r.chapters} · ${r.mapped}/${r.total} · ${r.source}` +
        (r.fromApp != null ? ` (앱 ${r.fromApp}, 홈 ${r.fromHome}, 불일치 ${r.disagree})` : '') +
        (r.note ? ` — ${r.note}` : ''),
    )
  }
}
