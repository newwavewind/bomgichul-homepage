#!/usr/bin/env node
/**
 * 부동산세법 concepts를 ox-quiz-app curriculum 3PART 구조에 동기화
 * node scripts/sync-realestate-tax-concepts.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const APP_CURRICULUM = path.join(ROOT, '..', 'ox-quiz-app', 'data', 'realestate-tax', 'curriculum.json')
const CONCEPTS_FILE = path.join(ROOT, 'src/data/concepts/realestate-tax.ts')

const curriculum = JSON.parse(fs.readFileSync(APP_CURRICULUM, 'utf8'))

/** category::subcategory → { chapterKo, sectionKo } */
const navMap = new Map()
for (const part of curriculum.parts) {
  for (const ch of part.chapters) {
    for (const f of ch.filters) {
      const key = `${f.category}::${f.subcategory ?? ''}`
      navMap.set(key, { chapterKo: part.shortLabel, sectionKo: ch.shortLabel })
    }
  }
}

/** 잘못된 subcategory 교정 (앱 curriculum 기준) */
const subcategoryFixes = {
  'tax-liability-priority': '조세우선권',
  'tax-appeal-procedure': '조세불복',
  'tax-collection-and-notice': '납세의무 확장',
  'property-tax-taxable-object': '재산세 비과세',
  'property-tax-object-classification': '재산세 과세대상',
  'property-tax-taxpayer-determination': '재산세 납세의무자',
  'local-income-tax-capital-gains': '지방소득세',
}

const concepts = JSON.parse(
  execSync(
    `npx --yes tsx -e "import c from './src/data/concepts/realestate-tax.ts'; console.log(JSON.stringify(c.map(x=>({slug:x.slug,category:x.category,subcategory:x.subcategory}))))"`,
    { cwd: ROOT, encoding: 'utf8' },
  ).trim(),
)

let src = fs.readFileSync(CONCEPTS_FILE, 'utf8')
let updated = 0
let fixed = 0

for (const c of concepts) {
  const newSub = subcategoryFixes[c.slug] ?? c.subcategory
  const key = `${c.category}::${newSub}`
  const nav = navMap.get(key)
  if (!nav) {
    console.warn('No nav for', c.slug, key)
    continue
  }

  const slugPattern = new RegExp(
    `(slug: "${c.slug}"[\\s\\S]*?)(chapterKo: ")[^"]*(")([\\s\\S]*?sectionKo: ")[^"]*(")`,
  )
  const subPattern = new RegExp(`(slug: "${c.slug}"[\\s\\S]*?subcategory: ")[^"]*(")`)

  const before = src
  src = src.replace(slugPattern, `$1$2${nav.chapterKo}$3$4${nav.sectionKo}$5`)
  if (newSub !== c.subcategory) {
    src = src.replace(subPattern, `$1${newSub}$2`)
    fixed += 1
  }
  if (src !== before) updated += 1
}

// 섹션 주석 헤더 갱신
src = src.replace(
  /\/\/ ───────── [^─]+ ─────────/g,
  (match, offset) => match, // keep; optional cleanup below
)

fs.writeFileSync(CONCEPTS_FILE, src)
console.log(`Updated ${updated} concepts, fixed ${fixed} subcategories`)

// 검증
const verify = JSON.parse(
  execSync(
    `npx --yes tsx -e "import c from './src/data/concepts/realestate-tax.ts'; console.log(JSON.stringify([...new Set(c.map(x=>x.chapterKo))]))"`,
    { cwd: ROOT, encoding: 'utf8' },
  ).trim(),
)
console.log('chapterKo parts:', verify)
