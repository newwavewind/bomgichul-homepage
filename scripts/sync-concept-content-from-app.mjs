#!/usr/bin/env node
/**
 * ox-quiz-app 개념 본문(definition/intuition/keyPoints/pitfalls/example 등)을
 * 홈페이지 src/data/concepts/*.ts 에 slug 매칭으로 반영한다.
 *
 * 시각화 UI(ConceptsScreen 전용 kind)는 이식하지 않는다 — 홈페이지는 study-map 으로
 * 갱신된 본문을 표시한다.
 *
 * node scripts/sync-concept-content-from-app.mjs [--dry-run]
 */
import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const APP = path.join(ROOT, '..', 'ox-quiz-app')
const DRY = process.argv.includes('--dry-run')

const SUBJECTS = [
  'civillaw',
  'realestate',
  'broker-law',
  'registry-law',
  'realestate-tax',
  'realestate-public-law',
]

const CONTENT_KEYS = [
  'definition',
  'intuition',
  'keyPoints',
  'pitfalls',
  'example',
  'titleKo',
  'titleEn',
]

function loadHomepageConcepts(slug) {
  const out = execSync(
    `npx --yes tsx -e "import c from './src/data/concepts/${slug}.ts'; console.log(JSON.stringify(c))"`,
    { cwd: ROOT, encoding: 'utf8', maxBuffer: 30 * 1024 * 1024 },
  )
  return JSON.parse(out.trim())
}

async function loadAppConcepts(slug) {
  const file = path.join(APP, 'src', 'data', 'concepts', `${slug}.js`)
  const mod = await import(pathToFileURL(file).href + `?t=${Date.now()}`)
  const concepts = mod.default || mod.concepts
  if (!Array.isArray(concepts)) {
    throw new Error(`App concepts not an array: ${slug}`)
  }
  return concepts
}

function serializeValue(value, indent) {
  const pad = ' '.repeat(indent)
  if (typeof value === 'string') {
    const escaped = JSON.stringify(value)
    if (value.length > 60 || value.includes('\n')) {
      return escaped
    }
    return escaped
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]'
    if (typeof value[0] === 'string') {
      return `[\n${value.map((v) => `${pad}  ${JSON.stringify(v)},`).join('\n')}\n${pad}]`
    }
    // questionRefs etc.
    const items = value.map((item) => {
      if (item && typeof item === 'object') {
        const entries = Object.entries(item)
          .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
          .join(', ')
        return `${pad}  { ${entries} },`
      }
      return `${pad}  ${JSON.stringify(item)},`
    })
    return `[\n${items.join('\n')}\n${pad}]`
  }
  return JSON.stringify(value)
}

function serializeConcept(c, indent = 2) {
  const pad = ' '.repeat(indent)
  const lines = [`${pad}{`]
  const order = [
    'slug',
    'chapterKo',
    'sectionKo',
    'category',
    'subcategory',
    'parentSlug',
    'titleKo',
    'titleEn',
    'definition',
    'intuition',
    'keyPoints',
    'pitfalls',
    'example',
    'amended',
    'questionRefs',
  ]
  const keys = [
    ...order.filter((k) => c[k] !== undefined && c[k] !== null && !(Array.isArray(c[k]) && c[k].length === 0 && k !== 'keyPoints')),
    ...Object.keys(c).filter((k) => !order.includes(k) && c[k] !== undefined),
  ]

  for (const key of keys) {
    const value = c[key]
    if (value === undefined) continue
    if (key === 'keyPoints' || key === 'questionRefs' || Array.isArray(value)) {
      lines.push(`${pad}  ${key}: ${serializeValue(value, indent + 2)},`)
    } else if (typeof value === 'string') {
      lines.push(`${pad}  ${key}: ${JSON.stringify(value)},`)
    } else if (typeof value === 'boolean' || typeof value === 'number') {
      lines.push(`${pad}  ${key}: ${JSON.stringify(value)},`)
    } else {
      lines.push(`${pad}  ${key}: ${JSON.stringify(value)},`)
    }
  }
  lines.push(`${pad}},`)
  return lines.join('\n')
}

function writeConceptsFile(slug, concepts) {
  const lines = [
    'import type { Concept } from "@/lib/concepts";',
    '',
    'const concepts: Concept[] = [',
  ]

  let lastPart = null
  for (const c of concepts) {
    const part = c.chapterKo ?? ''
    if (part && part !== lastPart) {
      lines.push(`  // ───────── ${part} ─────────`)
      lastPart = part
    }
    lines.push(serializeConcept(c))
  }

  lines.push('];', '', 'export default concepts;', '')
  const target = path.join(ROOT, 'src', 'data', 'concepts', `${slug}.ts`)
  if (!DRY) fs.writeFileSync(target, lines.join('\n'))
  return target
}

function same(a, b) {
  return JSON.stringify(a) === JSON.stringify(b)
}

async function main() {
  const report = []

  for (const slug of SUBJECTS) {
    const homepage = loadHomepageConcepts(slug)
    const app = await loadAppConcepts(slug)
    const appBySlug = new Map(app.map((c) => [c.slug, c]))

    let updated = 0
    const updatedSlugs = []
    const missing = []

    const next = homepage.map((hp) => {
      const fromApp = appBySlug.get(hp.slug)
      if (!fromApp) {
        missing.push(hp.slug)
        return hp
      }
      let touched = false
      const merged = { ...hp }
      for (const key of CONTENT_KEYS) {
        if (fromApp[key] === undefined) continue
        if (!same(hp[key], fromApp[key])) {
          merged[key] = fromApp[key]
          touched = true
        }
      }
      if (touched) {
        updated += 1
        updatedSlugs.push(hp.slug)
      }
      return merged
    })

    const out = writeConceptsFile(slug, next)
    report.push({ subject: slug, updated, updatedSlugs, missingOnApp: missing.length, out })
  }

  console.log(JSON.stringify(report, null, 2))
  if (DRY) console.log('(dry-run — no files written)')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
