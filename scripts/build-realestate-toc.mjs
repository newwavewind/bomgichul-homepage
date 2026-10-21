#!/usr/bin/env node
/**
 * 공인중개사 여섯 과목의 「교재 목차」를 앱(봄기출 공인중개사)에서 옮겨 온다(2026-10-21).
 *
 * 홈페이지 문제 데이터의 단원(category)은 옛 분류라 가나다순으로만 늘어섰다. 앱은 기본서 3사를 대조한
 * 표준 목차(data/<과목>/curriculum.json: 편 → 장 → 절 필터)로 문항마다 자리를 잡아 두었다.
 * 이 스크립트는 앱의 목차와 「연도-번호 → 장」 대응표를 src/data/exam-questions/toc.json 으로 쓴다.
 *
 *   node scripts/build-realestate-toc.mjs [앱 경로]   (기본: ~/bomgichul-release/rel4/civil)
 */
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'

const APP = process.argv[2] || path.join(os.homedir(), 'bomgichul-release/rel4/civil')
const SUBJECTS = {
  civillaw: { curriculum: 'data/curriculum.json', exam: 'src/data/exam' },
  realestate: { curriculum: 'data/realestate/curriculum.json', exam: 'src/data/subjects/realestate/exam' },
  'broker-law': { curriculum: 'data/broker-law/curriculum.json', exam: 'src/data/subjects/broker-law/exam' },
  'registry-law': { curriculum: 'data/registry-law/curriculum.json', exam: 'src/data/subjects/registry-law/exam' },
  'realestate-tax': { curriculum: 'data/realestate-tax/curriculum.json', exam: 'src/data/subjects/realestate-tax/exam' },
  'realestate-public-law': { curriculum: 'data/realestate-public-law/curriculum.json', exam: 'src/data/subjects/realestate-public-law/exam' },
}

const clean = (s) => String(s || '').replace(/^(PART|CHAPTER)\s*\d+\s*/i, '').replace(/　/g, ' ').trim()
const out = {}
for (const [subject, src] of Object.entries(SUBJECTS)) {
  const cur = JSON.parse(fs.readFileSync(path.join(APP, src.curriculum), 'utf8'))
  const filters = []
  const parts = cur.parts.map((part) => ({
    label: part.shortLabel || clean(part.label),
    chapters: part.chapters.map((ch) => {
      for (const f of ch.filters || []) filters.push({ ...f, chapter: ch.id })
      return { id: ch.id, label: ch.shortLabel || clean(ch.label) }
    }),
  }))
  const byQuestion = {}
  let total = 0
  const dir = path.join(APP, src.exam)
  for (const file of fs.readdirSync(dir).filter((f) => /^\d{4}\.json$/.test(f))) {
    const json = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'))
    const list = Array.isArray(json) ? json : json.questions || Object.values(json)[0]
    for (const q of list) {
      total += 1
      const hit =
        filters.find((f) => f.taxonomyUnitId && f.taxonomyUnitId === q.taxonomy_unit_id) ||
        filters.find((f) => f.category === q.category && (f.subcategory == null || f.subcategory === q.subcategory))
      if (hit) byQuestion[`${q.year}-${q.question_no}`] = hit.chapter
    }
  }
  out[subject] = { parts, byQuestion }
  console.log(`${subject}: 편 ${parts.length} · 장 ${parts.reduce((n, p) => n + p.chapters.length, 0)} · 문항 ${Object.keys(byQuestion).length}/${total}`)
}
fs.writeFileSync('src/data/exam-questions/toc.json', JSON.stringify(out) + '\n')
