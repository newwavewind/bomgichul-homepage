#!/usr/bin/env node
/**
 * 공인중개사 「기출 올인원」 카드의 묶음(편 chapterKo · 장 sectionKo)을 앱 표준 목차에 맞춘다(2026-10-21).
 *
 * 앱(봄기출 공인중개사)이 기본서 여섯 곳을 맞대어 목차를 다시 세우고 기출을 전부 다시 앉혔다.
 * 개념 페이지는 카드를 편 → 장으로 묶어 보여 주므로 묶음 이름도 따라가야 한다.
 *   - 기출이 이어진 카드: 그 기출이 가장 많이 앉은 새 장
 *   - 기출이 없는 카드: 옛 장(sectionKo)의 문항이 가장 많이 옮겨 간 새 장
 *   - 둘 다 안 되는 카드(옛 장 이름이 목차에 없던 28장)와 제목이 기출 다수결과 갈리는 카드:
 *     제목을 읽고 정한 아래 표(가장 먼저 따른다)
 * category·subcategory 는 건드리지 않는다 — 기출 없는 카드가 홈페이지 문항을 찾는 열쇠다.
 * 카드는 새 목차 차례(편 → 장)로 다시 늘어세운다(같은 장 안에서는 원래 차례).
 *
 *   node scripts/sync-concept-outline.mjs [앱 경로] [옛 목차 커밋]
 *   (기본: ~/bomgichul-release/rel4/civil, 22cfcff65~1)
 */
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { execSync } from 'node:child_process'

const APP = process.argv[2] || path.join(os.homedir(), 'bomgichul-release/rel4/civil')
const OLD = process.argv[3] || '22cfcff65~1'
const SUBJECTS = {
  civillaw: ['data/curriculum.json', 'src/data/exam'],
  realestate: ['data/realestate/curriculum.json', 'src/data/subjects/realestate/exam'],
  'broker-law': ['data/broker-law/curriculum.json', 'src/data/subjects/broker-law/exam'],
  'registry-law': ['data/registry-law/curriculum.json', 'src/data/subjects/registry-law/exam'],
  'realestate-tax': ['data/realestate-tax/curriculum.json', 'src/data/subjects/realestate-tax/exam'],
  'realestate-public-law': ['data/realestate-public-law/curriculum.json', 'src/data/subjects/realestate-public-law/exam'],
}

// 제목을 읽고 새 장을 정한 카드 — 기출도 옛 장도 없거나, 기출 다수결이 제목과 갈리는 것
// (urban-structure-theory: 이어진 기출 다수가 「입지 및 도시공간구조」를 함께 묻는 문항이라 입지론에 앉았다)
const BY_HAND = {
  civillaw: { 'numerus-clausus': '물권법 총설', 'real-right-claim': '물권법 총설' },
  realestate: {
    'urban-structure-theory': '도시공간구조론',
    'elasticity-theory': '수요와 공급의 탄력성',
    'efficient-market-hypothesis': '부동산시장',
    'housing-filtering-market-segregation': '부동산시장',
    'market-failure-intervention': '부동산정책의 의의와 기능',
    'leverage-effect': '부동산투자의 의의',
    'time-value-of-money': '화폐의 시간가치',
    'operating-cash-flow': '부동산투자분석',
    'portfolio-theory': '부동산투자의 위험과 수익',
    'project-financing': '부동산증권론 및 개발금융',
    'reits-structure': '부동산투자회사',
    'financing-instrument-classification': '부동산증권론 및 개발금융',
    'development-risk-feasibility': '부동산이용 및 개발',
    'property-management-methods': '부동산관리',
    'percentage-lease-analysis': '부동산관리',
  },
  'broker-law': {
    'real-estate-information-network': '중개계약 및 부동산거래정보망',
    'document-retention': '개업공인중개사의 의무 및 책임',
    'market-order-disturbance': '교육 및 업무위탁, 포상금 제도',
    'graveyard-usage-right': '중개대상물의 조사·확인',
    'explanation-form-details': '중개대상물의 조사·확인',
    'statutory-superficies-and-purchase-right': '중개대상물의 조사·확인',
    'co-ownership-exclusive-use': '중개대상물의 조사·확인',
  },
  'realestate-public-law': {
    'urbanization-control-zone': '용도지역·용도지구·용도구역',
    'land-transaction-permit-npl': '용도지역·용도지구·용도구역',
    'urban-development-bond': '비용부담 등',
    'evacuation-facility-obligations': '건축물의 구조·재료 및 건축설비',
    'street-height-limit': '지역 및 지구 안의 건축물',
  },
}

const read = (p, rev) =>
  JSON.parse(rev ? execSync(`git -C ${APP} show ${rev}:${p}`, { maxBuffer: 1e9 }).toString() : fs.readFileSync(path.join(APP, p), 'utf8'))
const clean = (s) => String(s || '').replace(/^(PART|CHAPTER)\s*\d+\s*/i, '').replace(/　/g, ' ').trim()
const norm = (s) => clean(s).replace(/[\s·ㆍ.,()]/g, '')

/** 문항 → 장. 「목차별」과 같은 잣대(분류가 같고 세분류가 없거나 같으면, 목차 차례로 첫 칸) */
function placement(rev, [curPath, dir]) {
  const cur = read(curPath, rev)
  const chapters = []
  const filters = []
  cur.parts.forEach((part, pi) =>
    part.chapters.forEach((ch, ci) => {
      const c = { part: part.shortLabel || clean(part.label), label: ch.shortLabel || clean(ch.label), order: pi * 1000 + ci }
      chapters.push(c)
      for (const f of ch.filters || []) filters.push({ f, c })
    }),
  )
  const at = new Map()
  for (let year = 2016; year <= 2025; year += 1) {
    let json
    try {
      json = read(`${dir}/${year}.json`, rev)
    } catch {
      continue
    }
    for (const q of Array.isArray(json) ? json : json.questions) {
      const hit = filters.find(({ f }) => (!f.category || q.category === f.category) && (f.subcategory == null || q.subcategory === f.subcategory))
      if (hit) at.set(`${year}-${q.question_no}`, hit.c)
    }
  }
  return { chapters, at }
}

const top = (votes) => [...votes.entries()].sort((a, b) => b[1] - a[1] || a[0].order - b[0].order)[0]?.[0] ?? null
const vote = (votes, c) => votes.set(c, (votes.get(c) ?? 0) + 1)

for (const [subject, src] of Object.entries(SUBJECTS)) {
  const after = placement(null, src)
  const before = placement(OLD, src)
  // 옛 장 → 그 장 문항이 가장 많이 옮겨 간 새 장
  const oldToNew = new Map()
  for (const [key, oldCh] of before.at) {
    const n = after.at.get(key)
    if (!n) continue
    const k = norm(oldCh.label)
    const v = oldToNew.get(k) ?? new Map()
    vote(v, n)
    oldToNew.set(k, v)
  }

  const file = path.join('src/data/concepts', `${subject}.ts`)
  const text = fs.readFileSync(file, 'utf8')
  const start = text.indexOf('= [') + 2
  const end = text.lastIndexOf(']') + 1
  const cards = JSON.parse(text.slice(start, end))
  let byRefs = 0
  let byOld = 0
  let byHand = 0
  let kept = 0
  const placed = cards.map((card, index) => {
    let target = null
    if (BY_HAND[subject]?.[card.slug]) {
      target = after.chapters.find((c) => c.label === BY_HAND[subject][card.slug]) ?? null
      if (!target) throw new Error(`${subject} ${card.slug}: 새 목차에 없는 장 ${BY_HAND[subject][card.slug]}`)
      byHand += 1
    }
    if (!target && card.questionRefs?.length) {
      const v = new Map()
      for (const ref of card.questionRefs) {
        const c = after.at.get(`${ref.year}-${ref.questionNo}`)
        if (c) vote(v, c)
      }
      target = top(v)
      if (target) byRefs += 1
    }
    if (!target) {
      const v = oldToNew.get(norm(card.sectionKo))
      target = v ? top(v) : after.chapters.find((c) => norm(c.label) === norm(card.sectionKo)) ?? null
      if (target) byOld += 1
    }
    if (!target) {
      kept += 1
      return { card, order: Number.MAX_SAFE_INTEGER, index }
    }
    return { card: { ...card, chapterKo: target.part, sectionKo: target.label }, order: target.order, index }
  })
  placed.sort((a, b) => a.order - b.order || a.index - b.index)
  const next = placed.map((p) => p.card)
  fs.writeFileSync(file, text.slice(0, start) + JSON.stringify(next, null, 2) + text.slice(end))
  console.log(`${subject}: 카드 ${cards.length} · 기출로 ${byRefs} · 옛 장으로 ${byOld} · 손으로 ${byHand} · 그대로 ${kept}`)
}
