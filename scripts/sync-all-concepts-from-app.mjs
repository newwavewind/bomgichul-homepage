#!/usr/bin/env node
/**
 * 홈페이지 concepts 6과목 → ox-quiz-app 목차별 학습 curriculum 완전 동기화
 * - chapterKo(PART) / sectionKo(CHAPTER) / category·subcategory 정합
 * - curriculum 순서대로 배열 재정렬 + 하위개념(parentSlug) 부모 직후 배치
 *
 * node scripts/sync-all-concepts-from-app.mjs [--dry-run]
 */
import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const APP = path.join(ROOT, '..', 'ox-quiz-app')
const DRY = process.argv.includes('--dry-run')

const SUBJECTS = [
  {
    slug: 'civillaw',
    file: 'src/data/concepts/civillaw.ts',
    type: 'curriculum',
    path: 'data/curriculum.json',
  },
  {
    slug: 'realestate',
    file: 'src/data/concepts/realestate.ts',
    type: 'topic',
    path: 'src/data/subjects/realestate/topicTaxonomy.js',
  },
  {
    slug: 'broker-law',
    file: 'src/data/concepts/broker-law.ts',
    type: 'curriculum',
    path: 'data/broker-law/curriculum.json',
  },
  {
    slug: 'registry-law',
    file: 'src/data/concepts/registry-law.ts',
    type: 'curriculum',
    path: 'data/registry-law/curriculum.json',
  },
  {
    slug: 'realestate-tax',
    file: 'src/data/concepts/realestate-tax.ts',
    type: 'curriculum',
    path: 'data/realestate-tax/curriculum.json',
  },
  {
    slug: 'realestate-public-law',
    file: 'src/data/concepts/realestate-public-law.ts',
    type: 'curriculum',
    path: 'data/realestate-public-law/curriculum.json',
  },
]

/** slug → 올바른 subcategory (앱 curriculum 기준 수동 교정) */
const SUBCATEGORY_FIXES = {
  'realestate-tax': {
    'tax-liability-priority': '조세우선권',
    'tax-appeal-procedure': '조세불복',
    'tax-collection-and-notice': '납세의무 확장',
    'property-tax-taxable-object': '재산세 비과세',
    'property-tax-object-classification': '재산세 과세대상',
    'property-tax-taxpayer-determination': '재산세 납세의무자',
    'local-income-tax-capital-gains': '지방소득세',
  },
  'broker-law': {
    'subject-matter-case-law-qualification': '중개대상물',
    'subject-matter-apartment-right': '중개대상물',
  },
  civillaw: {
    'types-of-real-right-change': '권리의변동',
    'contract-classification': '권리의변동',
    'unilateral-act-classification': '권리의변동',
  },
}

function norm(s) {
  return (s || '').replace(/\s+/g, '').replace(/[·()]/g, '').toLowerCase()
}

function loadConcepts(slug) {
  const out = execSync(
    `npx --yes tsx -e "import c from './src/data/concepts/${slug}.ts'; console.log(JSON.stringify(c))"`,
    { cwd: ROOT, encoding: 'utf8', maxBuffer: 30 * 1024 * 1024 },
  )
  return JSON.parse(out.trim())
}

function buildCurriculumNav(curriculum) {
  const lookup = new Map()
  const ordered = []

  curriculum.parts.forEach((part, partIdx) => {
    part.chapters.forEach((chapter, chapterIdx) => {
      let sectionIdx = 0
      const seen = new Set()
      for (const f of chapter.filters || []) {
        if (f.subcategory != null) {
          const key = `${f.category}::${f.subcategory}`
          if (seen.has(key)) continue
          seen.add(key)
          const slot = {
            partIdx,
            chapterIdx,
            sectionIdx: sectionIdx++,
            chapterKo: part.shortLabel,
            sectionKo: chapter.shortLabel,
            category: f.category,
            subcategory: f.subcategory,
          }
          lookup.set(key, slot)
          ordered.push(slot)
        } else {
          const subs = (chapter.filters || [])
            .filter(x => x.category === f.category && x.subcategory != null)
            .map(x => x.subcategory)
          if (subs.length === 0) {
            const key = `${f.category}::`
            if (seen.has(key)) continue
            seen.add(key)
            const slot = {
              partIdx,
              chapterIdx,
              sectionIdx: sectionIdx++,
              chapterKo: part.shortLabel,
              sectionKo: chapter.shortLabel,
              category: f.category,
              subcategory: '',
            }
            lookup.set(key, slot)
            ordered.push(slot)
          }
        }
      }
    })
  })

  return { lookup, ordered }
}

async function buildTopicNav(topicPath) {
  const mod = await import(pathToFileURL(path.join(APP, topicPath)).href)
  const lookup = new Map()
  const ordered = []

  mod.TOPIC_TAXONOMY.forEach((part, partIdx) => {
    part.chapters.forEach((chapter, chapterIdx) => {
      chapter.topics.forEach((topic, sectionIdx) => {
        const slot = {
          partIdx,
          chapterIdx,
          sectionIdx,
          chapterKo: part.partLabel,
          sectionKo: chapter.unitLabel,
          category: topic.topicCode,
          subcategory: topic.topicLabel,
          topicLabel: topic.topicLabel,
        }
        lookup.set(norm(topic.topicLabel), slot)
        lookup.set(topic.topicCode, slot)
        ordered.push(slot)
      })
    })
  })

  return { lookup, ordered }
}

function resolveSlot(subject, concept, nav) {
  const fixes = SUBCATEGORY_FIXES[subject.slug]?.[concept.slug]
  const sub = fixes ?? concept.subcategory ?? ''
  const cat = concept.category

  const keys = [`${cat}::${sub}`, `${cat}::`]
  for (const k of keys) {
    if (nav.lookup.has(k)) return nav.lookup.get(k)
  }

  if (subject.type === 'topic') {
    const bySub = nav.lookup.get(norm(sub))
    if (bySub) return bySub
    const byTitle = nav.lookup.get(norm(concept.titleKo))
    if (byTitle) return byTitle
    for (const [k, slot] of nav.lookup) {
      if (norm(sub).includes(k) || k.includes(norm(sub))) return slot
    }
  }

  for (const slot of nav.ordered) {
    if (norm(slot.category) !== norm(cat)) continue
    if (!sub || norm(slot.subcategory) === norm(sub)) return slot
    if (norm(sub).includes(norm(slot.subcategory)) || norm(slot.subcategory).includes(norm(sub)))
      return slot
  }

  return null
}

function orderWithChildrenAfterParent(items) {
  const bySlug = new Map(items.map(c => [c.slug, c]))
  const childrenByParent = new Map()
  const topLevel = []

  for (const c of items) {
    if (c.parentSlug && bySlug.has(c.parentSlug)) {
      const arr = childrenByParent.get(c.parentSlug) ?? []
      arr.push(c)
      childrenByParent.set(c.parentSlug, arr)
    } else {
      topLevel.push(c)
    }
  }

  const out = []
  for (const c of topLevel) {
    out.push(c)
    const kids = childrenByParent.get(c.slug)
    if (kids) out.push(...kids)
  }
  return out
}

function sortConcepts(subject, concepts, nav) {
  const enriched = concepts.map((c, fileIdx) => {
    const fixes = SUBCATEGORY_FIXES[subject.slug]?.[c.slug]
    const subcategory = fixes ?? c.subcategory
    const slot = resolveSlot(subject, { ...c, subcategory }, nav)
    return {
      ...c,
      subcategory,
      chapterKo: slot?.chapterKo ?? c.chapterKo,
      sectionKo: slot?.sectionKo ?? c.sectionKo ?? c.category,
      _slot: slot,
      _fileIdx: fileIdx,
    }
  })

  const byPartChapter = new Map()
  for (const c of enriched) {
    const key = `${c._slot?.partIdx ?? 99}::${c._slot?.chapterIdx ?? 99}`
    if (!byPartChapter.has(key)) byPartChapter.set(key, [])
    byPartChapter.get(key).push(c)
  }

  const sorted = []
  const partChapterKeys = [...byPartChapter.keys()].sort()
  for (const key of partChapterKeys) {
    const group = byPartChapter.get(key)
    const bySection = new Map()
    for (const c of group) {
      const sk = c._slot?.sectionIdx ?? 999
      if (!bySection.has(sk)) bySection.set(sk, [])
      bySection.get(sk).push(c)
    }
    for (const sk of [...bySection.keys()].sort((a, b) => a - b)) {
      const sectionItems = bySection.get(sk)
      sectionItems.sort((a, b) => a._fileIdx - b._fileIdx)
      sorted.push(...orderWithChildrenAfterParent(sectionItems))
    }
  }

  return sorted.map(({ _slot, _fileIdx, ...c }) => c)
}

function serializeStringArray(arr, indent) {
  if (!arr?.length) return '[]'
  const pad = indent + '  '
  return `[\n${arr.map(s => `${pad}${JSON.stringify(s)},`).join('\n')}\n${indent}]`
}

function serializeQuestionRefs(refs, indent) {
  if (!refs?.length) return ''
  const pad = indent + '  '
  const lines = refs.map(
    r => `${pad}{ year: ${r.year}, questionNo: ${r.questionNo} },`,
  )
  return `questionRefs: [\n${lines.join('\n')}\n${indent}],`
}

function serializeConcept(c, indent = '  ') {
  const lines = [`${indent}{`, `${indent}  slug: ${JSON.stringify(c.slug)},`]

  if (c.chapterKo) lines.push(`${indent}  chapterKo: ${JSON.stringify(c.chapterKo)},`)
  if (c.sectionKo) lines.push(`${indent}  sectionKo: ${JSON.stringify(c.sectionKo)},`)
  lines.push(`${indent}  category: ${JSON.stringify(c.category)},`)
  lines.push(`${indent}  subcategory: ${JSON.stringify(c.subcategory)},`)
  if (c.parentSlug) lines.push(`${indent}  parentSlug: ${JSON.stringify(c.parentSlug)},`)

  lines.push(`${indent}  titleKo: ${JSON.stringify(c.titleKo)},`)
  lines.push(`${indent}  titleEn: ${JSON.stringify(c.titleEn)},`)
  lines.push(`${indent}  definition:\n${indent}    ${JSON.stringify(c.definition)},`)
  lines.push(`${indent}  intuition:\n${indent}    ${JSON.stringify(c.intuition)},`)
  lines.push(`${indent}  keyPoints: ${serializeStringArray(c.keyPoints, indent + '  ')},`)
  lines.push(`${indent}  pitfalls:\n${indent}    ${JSON.stringify(c.pitfalls)},`)
  lines.push(`${indent}  example:\n${indent}    ${JSON.stringify(c.example)},`)

  const refs = serializeQuestionRefs(c.questionRefs, indent + '  ')
  if (refs) lines.push(`${indent}  ${refs}`)

  lines.push(`${indent}},`)
  return lines.join('\n')
}

function writeConceptsFile(subject, concepts) {
  const partComments = []
  let lastPart = null
  const blocks = []

  for (const c of concepts) {
    const part = c.chapterKo ?? ''
    if (part && part !== lastPart) {
      partComments.push({ part, firstSlug: c.slug })
      lastPart = part
    }
    blocks.push(c)
  }

  const lines = [
    'import type { Concept } from "@/lib/concepts";',
    '',
    'const concepts: Concept[] = [',
  ]

  let commentIdx = 0
  for (let i = 0; i < blocks.length; i++) {
    const c = blocks[i]
    if (commentIdx < partComments.length && c.slug === partComments[commentIdx].firstSlug) {
      lines.push(`  // ───────── ${partComments[commentIdx].part} ─────────`)
      commentIdx++
    }
    lines.push(serializeConcept(c))
  }

  lines.push('];', '', 'export default concepts;', '')
  const out = lines.join('\n')
  const target = path.join(ROOT, subject.file)
  if (!DRY) fs.writeFileSync(target, out)
  return target
}

async function main() {
  const report = []

  for (const subject of SUBJECTS) {
    const concepts = loadConcepts(subject.slug)
    const nav =
      subject.type === 'topic'
        ? await buildTopicNav(subject.path)
        : buildCurriculumNav(JSON.parse(fs.readFileSync(path.join(APP, subject.path), 'utf8')))

    const sorted = sortConcepts(subject, concepts, nav)
    const unmatched = sorted.filter(c => {
      const slot = resolveSlot(subject, c, nav)
      return !slot
    })

    const navChanged = sorted.filter((c, i) => {
      const orig = concepts.find(o => o.slug === c.slug)
      return (
        orig?.chapterKo !== c.chapterKo ||
        orig?.sectionKo !== c.sectionKo ||
        orig?.subcategory !== c.subcategory
      )
    })

    const orderChanged = sorted.some((c, i) => concepts[i]?.slug !== c.slug)

    const out = writeConceptsFile(subject, sorted)
    report.push({
      subject: subject.slug,
      count: sorted.length,
      navChanged: navChanged.length,
      orderChanged,
      unmatched: unmatched.map(c => c.slug),
      out,
    })
  }

  console.log(DRY ? 'DRY RUN\n' : '')
  for (const r of report) {
    console.log(
      `${r.subject}: ${r.count}개 | nav수정 ${r.navChanged} | 순서변경 ${r.orderChanged ? 'Y' : 'N'} | 미매칭 ${r.unmatched.length}`,
    )
    if (r.unmatched.length) console.log('  미매칭:', r.unmatched.join(', '))
  }
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
