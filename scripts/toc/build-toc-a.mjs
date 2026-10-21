#!/usr/bin/env node
/**
 * 홈페이지 랜덤 문제 「교재 목차」 대응표 — 공무원·경찰·소방·주택관리사·사회복지사·영어 (2026-10-21).
 *
 * 앱마다 목차 원천이 다르다.
 *   - 공무원(ox-admin-quiz-app)·소방(firebomgichul): data/taxonomy*.json — units[]{category=편, chapter=장, subcategory=절, order, unit_id}
 *     문항은 src/data/exam/<접두사>-<연도>-<국가직|지방직>.json (행정학만 접두사 없음), taxonomy_unit_id → textbook_order → 편::절 순으로 단원을 찾는다.
 *   - 경찰·주택관리사·사회복지사·영어: data/<과목>/curriculum.json — parts → chapters → filters{category, subcategory, taxonomyUnitId}
 *     문항은 src/data/subjects/<과목 자리>/exam/*.json
 * 앱 문항과 홈페이지 문항은 (연도, 시험 구분, 번호)로 맞대고, 앱에서 못 찾은 문항은 홈페이지 문항의 편·절로 한 번 더 찾는다.
 *
 *   node scripts/toc/build-toc-a.mjs
 * 출력: src/data/exam-toc/{public-service,police,firefighter,housing,social-worker,english}.json
 */
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const HOME = os.homedir()
const OUT_DIR = path.join(ROOT, 'src/data/exam-toc')

const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'))
const listOf = (json) => (Array.isArray(json) ? json : json.questions || json.exams || Object.values(json).find(Array.isArray) || [])
const clean = (s) =>
  String(s || '')
    .replace(/　/g, ' ')
    .replace(/^(PART|CHAPTER)\s*\d+\s*/i, '')
    .replace(/^제\s*\d+\s*[편장절]\s*/, '')
    .replace(/^\d+[.)]\s*/, '')
    .trim()
// 지문 대조용 — 가운뎃점(ㆍ·․)은 원천마다 달라 뺀다.
const norm = (s) => String(s || '').replace(/[ㆍ\s]+/g, '').replace(/[^\p{L}\p{N}]/gu, '').slice(0, 40)

/* ── 앱 문항 읽기 ─────────────────────────────────────────── */
function readAppQuestions(dir, fileFilter) {
  const out = []
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.json') && f !== 'index.json' && fileFilter(f))) {
    for (const q of listOf(readJson(path.join(dir, file)))) out.push({ ...q, __file: file })
  }
  return out
}

/* ── 원천 1: taxonomy units (공무원·소방) ─────────────────── */
function tocFromTaxonomy(taxPath) {
  const tax = readJson(taxPath)
  const units = tax.units.filter((u) => u.category !== '미분류' && u.order != null && u.order < 999)
  const partOrder = new Map()
  const chapOrder = new Map()
  for (const u of units) {
    partOrder.set(u.category, Math.min(partOrder.get(u.category) ?? Infinity, u.order))
    const ck = `${u.category}\u0000${u.chapter || u.category}`
    chapOrder.set(ck, Math.min(chapOrder.get(ck) ?? Infinity, u.order))
  }
  const partNames = [...partOrder.keys()].sort((a, b) => partOrder.get(a) - partOrder.get(b))
  const chapterIdByKey = new Map()
  const parts = partNames.map((pn, pi) => {
    const chs = [...chapOrder.keys()].filter((k) => k.split('\u0000')[0] === pn).sort((a, b) => chapOrder.get(a) - chapOrder.get(b))
    return {
      label: clean(pn),
      chapters: chs.map((k, ci) => {
        const id = `p${pi + 1}-c${String(ci + 1).padStart(2, '0')}`
        chapterIdByKey.set(k, id)
        return { id, label: clean(k.split('\u0000')[1]) }
      }),
    }
  })
  const chapterOfUnit = (u) => chapterIdByKey.get(`${u.category}\u0000${u.chapter || u.category}`)
  const byId = new Map()
  const byOrder = new Map()
  const byKey = new Map()
  for (const u of units) {
    if (u.unit_id) byId.set(u.unit_id, u)
    byOrder.set(Number(u.order), u)
    byKey.set(`${u.category}::${u.subcategory}`, u)
  }
  const resolve = (q) => {
    const u =
      (q.taxonomy_unit_id && byId.get(q.taxonomy_unit_id)) ||
      (q.textbook_order != null && byOrder.get(Number(q.textbook_order))) ||
      byKey.get(`${q.category}::${q.subcategory}`)
    return u ? chapterOfUnit(u) : null
  }
  return { parts, resolve }
}

/* ── 원천 2: curriculum.json (경찰·주택·사복·영어) ─────────── */
function tocFromCurriculum(curPath) {
  const cur = readJson(curPath)
  const filters = []
  const parts = cur.parts.map((part) => ({
    label: part.shortLabel || clean(part.label),
    chapters: part.chapters.map((ch) => {
      for (const f of ch.filters || []) filters.push({ ...f, chapter: ch.id })
      return { id: ch.id, label: ch.shortLabel || clean(ch.label) }
    }),
  }))
  const resolve = (q) => {
    const tu = q.taxonomy_unit_id || q.taxonomyUnitId
    const hit =
      (tu && filters.find((f) => f.taxonomyUnitId === tu)) ||
      filters.find((f) => f.category === q.category && f.subcategory != null && f.subcategory === q.subcategory) ||
      filters.find((f) => f.category === q.category && f.subcategory == null)
    return hit ? hit.chapter : null
  }
  return { parts, resolve }
}

/* ── 대체: 홈페이지 편·절을 평균 번호 순으로 ─────────────── */
function tocFallback(exams) {
  const stat = new Map()
  for (const e of exams) {
    const c = e.category || '기타'
    const s = e.subcategory || c
    if (!stat.has(c)) stat.set(c, { sum: 0, n: 0, subs: new Map() })
    const cs = stat.get(c)
    cs.sum += e.questionNo
    cs.n += 1
    if (!cs.subs.has(s)) cs.subs.set(s, { sum: 0, n: 0 })
    cs.subs.get(s).sum += e.questionNo
    cs.subs.get(s).n += 1
  }
  const avg = (x) => x.sum / x.n
  const idOf = new Map()
  const parts = [...stat.entries()]
    .sort((a, b) => avg(a[1]) - avg(b[1]))
    .map(([c, cs], pi) => ({
      label: clean(c),
      chapters: [...cs.subs.entries()]
        .sort((a, b) => avg(a[1]) - avg(b[1]))
        .map(([s], ci) => {
          const id = `p${pi + 1}-c${String(ci + 1).padStart(2, '0')}`
          idOf.set(`${c}::${s}`, id)
          return { id, label: clean(s) }
        }),
    }))
  return { parts, resolve: (q) => idOf.get(`${q.category || '기타'}::${q.subcategory || q.category || '기타'}`) || null }
}

/* ── 트랙 정의 ─────────────────────────────────────────────── */
const ADMIN = path.join(HOME, 'ox-admin-quiz-app')
const FIRE = path.join(HOME, 'firebomgichul')
const POLICE = path.join(HOME, 'policebomgichul')
const HOUSING = path.join(HOME, 'housingbomgichul')
const SOCIAL = path.join(HOME, 'socialworkerbomgichul')
const ENGLISH = path.join(HOME, 'englishbomgichul')

// 공무원·소방: 앱 문항 키 = 연도|국가직·지방직|번호
const adminLike = (app, taxFile, prefix) => ({
  toc: () => tocFromTaxonomy(path.join(app, 'data', taxFile)),
  appQuestions: () =>
    readAppQuestions(path.join(app, 'src/data/exam'), (f) =>
      prefix ? f.startsWith(`${prefix}-`) : /^\d{4}-(국가직|지방직)\.json$/.test(f),
    ),
  appKey: (q) => `${q.year}|${q.source_code || q.__file.replace(/\.json$/, '').split('-').pop()}|${q.question_no}`,
  homeKey: (e) => `${e.year}|${e.sourceCode}|${e.questionNo}`,
})

// 경찰·주택·사복·영어: curriculum.json + subjects/<자리>/exam
const curriculumLike = (app, curRel, examRel, appKey, homeKey) => ({
  toc: () => tocFromCurriculum(path.join(app, curRel)),
  appQuestions: () => {
    const dirs = Array.isArray(examRel) ? examRel : [examRel]
    return dirs.flatMap((d) => readAppQuestions(path.join(app, d), () => true).map((q) => ({ ...q, __dir: d })))
  },
  appKey,
  homeKey,
})

const policeKey = (q) => `${q.year}|${q.round}|${q.question_no}`
const policeHome = (e) => `${e.year}|${parseInt(e.sourceCode, 10)}|${e.questionNo}`
const yearKey = (q) => `${q.year}|${q.question_no}`
const yearHome = (e) => `${e.year}|${e.questionNo}`

const TRACKS = {
  'public-service': {
    hangjunghak: adminLike(ADMIN, 'taxonomy.json', null),
    haengjeongbeop: adminLike(ADMIN, 'taxonomy-행정법.json', '행정법'),
    gwansebeop: adminLike(ADMIN, 'taxonomy-관세법.json', '관세법'),
    hyeongbeop: adminLike(ADMIN, 'taxonomy-형법.json', '형법'),
    hyeongso: adminLike(ADMIN, 'taxonomy-형사소송법.json', '형사소송법'),
    hyeongsogaeron: adminLike(ADMIN, 'taxonomy-형사소송법.json', '형사소송법개론'),
    gyojeonghak: adminLike(ADMIN, 'taxonomy-교정학개론.json', '교정학개론'),
    gyoyukhak: adminLike(ADMIN, 'taxonomy-교육학개론.json', '교육학개론'),
    gukjebeop: adminLike(ADMIN, 'taxonomy-국제법개론.json', '국제법개론'),
    sebeop: adminLike(ADMIN, 'taxonomy-세법개론.json', '세법개론'),
    jibangsebeop: adminLike(ADMIN, 'taxonomy-지방세법.json', '지방세법'),
    nodongbeop: adminLike(ADMIN, 'taxonomy-노동법개론.json', '노동법개론'),
    bokji: adminLike(ADMIN, 'taxonomy-사회복지학개론.json', '사회복지학개론'),
    hoegyehak: adminLike(ADMIN, 'taxonomy-회계학.json', '회계학'),
    hoegyewonri: adminLike(ADMIN, 'taxonomy-회계원리.json', '회계원리'),
  },
  firefighter: {
    sobang: adminLike(FIRE, 'taxonomy-소방학개론.json', '소방학개론'),
    sobangbeop: adminLike(FIRE, 'taxonomy-소방관계법규.json', '소방관계법규'),
    haengjeongbeop: adminLike(FIRE, 'taxonomy-행정법총론.json', '행정법총론'),
  },
  // 경찰 앱은 공인중개사 앱의 과목 자리를 빌려 쓴다: registry-law=헌법, realestate-tax=형사법, broker-law=경찰학
  police: {
    constitution: curriculumLike(POLICE, 'data/registry-law/curriculum.json', 'src/data/subjects/registry-law/exam', policeKey, policeHome),
    'criminal-law': curriculumLike(POLICE, 'data/realestate-tax/curriculum.json', 'src/data/subjects/realestate-tax/exam', policeKey, policeHome),
    'police-science': curriculumLike(POLICE, 'data/broker-law/curriculum.json', 'src/data/subjects/broker-law/exam', policeKey, policeHome),
  },
  housing: Object.fromEntries(
    ['accounting', 'civil-law', 'facilities', 'housing-admin', 'housing-law'].map((s) => [
      s,
      curriculumLike(HOUSING, `data/${s}/curriculum.json`, `src/data/subjects/${s}/exam`, yearKey, yearHome),
    ]),
  ),
  'social-worker': Object.fromEntries(
    ['human-behavior', 'research', 'practice', 'practice-skills', 'community', 'policy', 'administration', 'law'].map((s) => [
      s,
      curriculumLike(SOCIAL, `data/${s}/curriculum.json`, `src/data/subjects/${s}/exam`, yearKey, yearHome),
    ]),
  ),
  english: {
    gong9: curriculumLike(
      ENGLISH,
      'data/english/curriculum.json',
      ['src/data/subjects/national/exam', 'src/data/subjects/local/exam'],
      (q) => `${q.year}|${q.__dir.includes('national') ? '국가직' : '지방직'}|${q.question_no}`,
      (e) => `${e.year}|${e.sourceCode}|${e.questionNo}`,
    ),
  },
}

/* ── 실행 ─────────────────────────────────────────────────── */
const only = process.argv.slice(2)
const report = []
for (const [track, subjects] of Object.entries(TRACKS)) {
  if (only.length && !only.includes(track)) continue
  const out = {}
  for (const [subjectId, def] of Object.entries(subjects)) {
    const home = readJson(path.join(ROOT, 'src/data', track, `${subjectId}.json`))
    const exams = home.exams || []
    let source = 'app'
    let toc
    try {
      toc = def.toc()
    } catch (err) {
      source = 'fallback'
      toc = tocFallback(exams)
    }
    const appIndex = new Map()
    if (source === 'app') for (const q of def.appQuestions()) appIndex.set(def.appKey(q), q)

    const byQuestion = {}
    let viaApp = 0
    let viaHome = 0
    let stemMismatch = 0
    const unmapped = []
    for (const e of exams) {
      const key = `${e.sourceCode}|${e.year}|${e.questionNo}`
      const aq = appIndex.get(def.homeKey(e))
      let ch = null
      if (aq) {
        ch = toc.resolve(aq)
        if (ch) viaApp += 1
        if (norm(aq.stem).slice(0, 12) !== norm(e.stem).slice(0, 12)) stemMismatch += 1
      }
      if (!ch) {
        ch = toc.resolve({ category: e.category, subcategory: e.subcategory })
        if (ch) viaHome += 1
      }
      if (ch) byQuestion[key] = ch
      else unmapped.push(`${key} ${e.category}/${e.subcategory}${aq ? ` (앱:${aq.category}/${aq.subcategory})` : ' (앱 문항 없음)'}`)
    }
    // 문항이 하나도 없는 장은 남겨 둔다(교재 목차 그대로). 편 순서·장 순서는 원천 그대로.
    out[subjectId] = { parts: toc.parts, byQuestion }
    const chapterCount = toc.parts.reduce((n, p) => n + p.chapters.length, 0)
    const used = new Set(Object.values(byQuestion))
    report.push({
      track,
      subjectId,
      source,
      parts: toc.parts.length,
      chapters: chapterCount,
      usedChapters: used.size,
      mapped: Object.keys(byQuestion).length,
      total: exams.length,
      viaApp,
      viaHome,
      stemMismatch,
      unmapped,
    })
  }
  fs.mkdirSync(OUT_DIR, { recursive: true })
  fs.writeFileSync(path.join(OUT_DIR, `${track}.json`), JSON.stringify(out) + '\n')
}

for (const r of report) {
  console.log(
    `${r.track}/${r.subjectId} [${r.source}] 편 ${r.parts} · 장 ${r.chapters}(쓰임 ${r.usedChapters}) · ${r.mapped}/${r.total} (앱 ${r.viaApp} · 홈 편절 ${r.viaHome}) · 지문 불일치 ${r.stemMismatch}`,
  )
  for (const u of r.unmapped.slice(0, 8)) console.log('   미배정', u)
  if (r.unmapped.length > 8) console.log(`   … 외 ${r.unmapped.length - 8}`)
}
