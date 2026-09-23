#!/usr/bin/env node
/**
 * 로컬 기출 원본 PDF → 홈페이지 자료실(archive) 일괄 업로드.
 * 관리자(newwavewind@gmail.com) 명의 · resource_type=past_exam · 전체 공개.
 *
 *   node --env-file=.env.local scripts/upload-original-exam-pdfs.mjs
 *   node --env-file=.env.local scripts/upload-original-exam-pdfs.mjs --dry-run
 *   node --env-file=.env.local scripts/upload-original-exam-pdfs.mjs --only real_estate
 */
import { createClient } from '@supabase/supabase-js'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import ws from 'ws'

const ADMIN_EMAIL = 'newwavewind@gmail.com'
const ADMIN_NICKNAME = '봄기출'
const BUCKET = 'archive'
const TITLE_PREFIX = '[기출 원본]'
const DRY = process.argv.includes('--dry-run')
const ONLY = (() => {
  const i = process.argv.indexOf('--only')
  return i >= 0 ? process.argv[i + 1] : null
})()

const HOME = process.env.HOME || '/Users/newsang'

const SUBJECT_LABEL = {
  realestate: '부동산학개론',
  civillaw: '민법',
  'broker-law': '공인중개사법',
  'registry-law': '부동산공시법',
  'realestate-tax': '부동산세법',
  'realestate-public-law': '부동산공법',
  constitution: '헌법',
  'criminal-law': '형사법',
  'police-science': '경찰학',
  accounting: '회계원리',
  facilities: '공동주택시설개론',
  'civil-law': '민법',
  'housing-law': '주택관리관계법규',
  'housing-admin': '공동주택관리실무',
  hangjunghak: '행정학개론',
  haengjeongbeop: '행정법총론',
  hyeongbeop: '형법',
  hyeongso: '형사소송법',
  hyeongsogaeron: '형사소송법',
  sebeop: '세법개론',
  jibangsebeop: '지방세법',
  gwansebeop: '관세법',
  bokji: '사회복지학개론',
  sobang: '소방학개론',
  sobangbeop: '소방관계법규',
  hoegyehak: '회계학',
  hoegyewonri: '회계원리',
  gyoyukhak: '교육학개론',
  gyojeonghak: '교정학',
  gukjebeop: '국제법',
  nodongbeop: '노동법',
  gugeo: '국어',
  minbeop: '민법',
  haengjeonghak: '행정학개론',
  other: '기타',
}

/** YY 또는 YYYY → 4자리 연도 (17→2017, 26→2026) */
function yearFromToken(token) {
  const n = Number(token)
  if (!Number.isFinite(n)) return null
  if (n >= 1990 && n <= 2099) return n
  if (n >= 0 && n <= 99) return 2000 + n
  return null
}

const ADMIN_SUBJECT_MAP = {
  haengjeongbeop: 'haengjeongbeop',
  hangjunghak: 'hangjunghak',
  hyeongbeop: 'hyeongbeop',
  hyeongso: 'hyeongso',
  hyeongsogaeron: 'hyeongsogaeron',
  sebeop: 'sebeop',
  jibangsebeop: 'sebeop',
  gwansebeop: 'gwansebeop',
  bokji: 'bokji',
  sobang: 'sobang',
  sobangbeop: 'sobangbeop',
  hoegyehak: 'hoegyehak',
  hoegyewonri: 'hoegyewonri',
  gyoyukhak: 'gyoyukhak',
  gyojeonghak: 'gyojeonghak',
  gukjebeop: 'gukjebeop',
  nodongbeop: 'nodongbeop',
}

function loadEnvFile(filename) {
  const path = resolve(process.cwd(), filename)
  if (!existsSync(path)) return
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const eq = t.indexOf('=')
    if (eq < 0) continue
    const key = t.slice(0, eq).trim()
    let value = t.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (!process.env[key]) process.env[key] = value
  }
}

loadEnvFile('.env.local')

function walkPdfs(dir) {
  if (!existsSync(dir)) return []
  const out = []
  const stack = [dir]
  while (stack.length) {
    const cur = stack.pop()
    for (const name of readdirSync(cur)) {
      const p = join(cur, name)
      const st = statSync(p)
      if (st.isDirectory()) stack.push(p)
      else if (name.toLowerCase().endsWith('.pdf')) out.push(p)
    }
  }
  return out.sort()
}

function nfc(s) {
  return String(s).normalize('NFC')
}

function kindFromName(name) {
  const n = nfc(name)
  if (/정답|정답표|가안/.test(n)) return '정답'
  if (/해설/.test(n)) return '해설'
  if (/문제/.test(n)) return '문제'
  return '자료'
}

function pickOne(files) {
  // Prefer largest when duplicates (hash variants)
  return files.slice().sort((a, b) => statSync(b).size - statSync(a).size)[0]
}

function collectJobs() {
  const jobs = []

  // ——— 공인중개사 ———
  {
    const root = join(HOME, 'ox-quiz-app/public/exam-pdfs')
    for (const file of walkPdfs(root)) {
      const name = nfc(basename(file))
      const year = (name.match(/^(\d{4})/) || [])[1]
      if (!year) continue
      const y = Number(year)
      if (y < 2016 || y > 2025) continue
      let detail = name.replace(/\.pdf$/i, '').replace(/^\d{4}-/, '')
      detail = detail.replace(/-/g, ' ')
      const title = `${TITLE_PREFIX} ${year}년 공인중개사 · ${detail}`
      jobs.push({
        scope: 'real_estate',
        subject: 'other',
        title,
        content: `출제기관 원본 PDF입니다. 전체 공개로 제공합니다.\n파일: ${name}`,
        file,
        dedupeKey: `real_estate|${year}|${name}`,
      })
    }
  }

  // ——— 공무원 ———
  {
    const root = join(HOME, 'ox-admin-quiz-app/public/exam-pdfs')
    const groups = new Map()
    for (const file of walkPdfs(root)) {
      const name = nfc(basename(file))
      const m = name.match(/^(\d{4})-([a-z0-9]+)-(문제|정답)-/i)
      if (!m) continue
      const [, year, slug, kind] = m
      const y = Number(year)
      if (y < 2017 || y > 2026) continue
      const key = `${year}|${slug}|${kind}`
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key).push(file)
    }
    for (const [key, files] of groups) {
      const [year, slug, kind] = key.split('|')
      const file = pickOne(files)
      const subject = ADMIN_SUBJECT_MAP[slug] || 'other'
      const label = SUBJECT_LABEL[slug] || slug
      const title = `${TITLE_PREFIX} ${year}년 공무원 ${label} · ${kind}`
      jobs.push({
        scope: 'public_service',
        subject,
        title,
        content: `국가직·지방직 등 공무원 기출 원본 PDF입니다. 전체 공개로 제공합니다.\n과목: ${label}\n파일: ${basename(file)}`,
        file,
        dedupeKey: `public_service|${key}`,
      })
    }
  }

  // ——— 경찰 ———
  {
    const root = join(HOME, 'policebomgichul/public/exam-pdfs')
    for (const file of walkPdfs(root)) {
      const name = nfc(basename(file))
      const year = (name.match(/^(\d{4})/) || [])[1]
      if (!year) continue
      let detail = name.replace(/\.pdf$/i, '').replace(/^\d{4}-/, '').replace(/-/g, ' ')
      const title = `${TITLE_PREFIX} ${year}년 경찰공무원 · ${detail}`
      jobs.push({
        scope: 'police',
        subject: 'other',
        title,
        content: `경찰공무원(순경 공채) 기출 원본 PDF입니다. 전체 공개로 제공합니다.\n파일: ${name}`,
        file,
        dedupeKey: `police|${name}`,
      })
    }
  }

  // ——— 주택관리사 ———
  {
    const root = join(HOME, 'housingbomgichul/public/exam-pdfs')
    for (const file of walkPdfs(root)) {
      const name = nfc(basename(file))
      const year = (name.match(/^(\d{4})/) || [])[1]
      if (!year) continue
      const y = Number(year)
      if (y < 2016 || y > 2026) continue
      let detail = name.replace(/\.pdf$/i, '').replace(/^\d{4}-/, '').replace(/-/g, ' ')
      const title = `${TITLE_PREFIX} ${year}년 주택관리사보 · ${detail}`
      jobs.push({
        scope: 'housing',
        subject: 'other',
        title,
        content: `주택관리사보 기출 원본 PDF입니다. 전체 공개로 제공합니다.\n파일: ${name}`,
        file,
        dedupeKey: `housing|${name}`,
      })
    }
  }

  // ——— 사회복지사 ———
  {
    const root = join(HOME, 'socialworkerbomgichul/public/exam-pdfs')
    for (const file of walkPdfs(root)) {
      const name = nfc(basename(file))
      const year = (name.match(/^(\d{4})/) || [])[1]
      if (!year) continue
      let detail = name.replace(/\.pdf$/i, '').replace(/^\d{4}-/, '').replace(/-/g, ' ')
      const title = `${TITLE_PREFIX} ${year}년 사회복지사 1급 · ${detail}`
      jobs.push({
        scope: 'social_worker',
        subject: 'other',
        title,
        content: `사회복지사 1급 기출 원본 PDF입니다. 전체 공개로 제공합니다.\n파일: ${name}`,
        file,
        dedupeKey: `social_worker|${name}`,
      })
    }
  }

  // ——— 공무원 영어 ———
  {
    const root = join(HOME, 'englishbomgichul/public/exam-pdfs')
    for (const file of walkPdfs(root)) {
      const name = nfc(basename(file))
      const year = (name.match(/^(\d{4})/) || [])[1]
      if (!year) continue
      let detail = name.replace(/\.pdf$/i, '').replace(/^\d{4}-/, '').replace(/-/g, ' ')
      const title = `${TITLE_PREFIX} ${year}년 공무원 영어 · ${detail}`
      jobs.push({
        scope: 'english',
        subject: 'other',
        title,
        content: `공무원 영어 기출 원본 PDF입니다. 전체 공개로 제공합니다.\n파일: ${name}`,
        file,
        dedupeKey: `english|${name}`,
      })
    }
  }

  // ——— 한국사 (데스크탑 묶음 + 추가 폴더) ———
  {
    const roots = [
      join(HOME, 'Desktop/한국사능력검정_심화_기출5회'),
      join(HOME, 'historybomgichul/public/exam-pdfs'),
      join(HOME, 'Desktop/봄기출 데이터/한국사'),
    ]
    for (const root of roots) {
      for (const file of walkPdfs(root)) {
        const name = nfc(basename(file))
        const round = (name.match(/(\d{2,3})\s*회/) || name.match(/^(\d{2,3})회/))?.[1]
        const kind = kindFromName(name)
        const title = round
          ? `${TITLE_PREFIX} 한국사능력검정 심화 ${round}회 · ${kind}`
          : `${TITLE_PREFIX} 한국사능력검정 · ${name.replace(/\.pdf$/i, '')}`
        jobs.push({
          scope: 'history',
          subject: 'other',
          title,
          content: `한국사능력검정시험 심화 기출 원본 PDF입니다. 전체 공개로 제공합니다.\n파일: ${name}`,
          file,
          dedupeKey: `history|${name}`,
        })
      }
    }
  }

  // ——— 소방공무원 (앱 과목별 + 데스크탑 원본) ———
  {
    const FIRE_SUBJECT_MAP = {
      sobang: 'sobang',
      sobangbeop: 'sobangbeop',
      haengjeongbeop: 'haengjeongbeop',
    }
    const appRoot = join(HOME, 'firebomgichul/public/exam-pdfs')
    const groups = new Map()
    for (const file of walkPdfs(appRoot)) {
      const name = nfc(basename(file))
      const m = name.match(/^(\d{4})-([a-z0-9]+)-(문제|정답)-/i)
      if (!m) continue
      const [, year, slug, kind] = m
      const y = Number(year)
      if (y < 2018 || y > 2026) continue
      const key = `${year}|${slug}|${kind}`
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key).push(file)
    }
    for (const [key, files] of groups) {
      const [year, slug, kind] = key.split('|')
      const file = pickOne(files)
      const subject = FIRE_SUBJECT_MAP[slug] || 'other'
      const label = SUBJECT_LABEL[slug] || slug
      const title = `${TITLE_PREFIX} ${year}년 소방공무원 ${label} · ${kind}`
      jobs.push({
        scope: 'firefighter',
        subject,
        title,
        content: `소방공무원 공채 기출 원본 PDF입니다. 전체 공개로 제공합니다.\n과목: ${label}\n파일: ${basename(file)}`,
        file,
        dedupeKey: `firefighter|app|${key}`,
      })
    }

    const deskRoot = join(HOME, 'Desktop/소방공무원_기출_9개년')
    for (const file of walkPdfs(deskRoot)) {
      if (/[/\\]_(버림|원본메타)[/\\]/.test(file)) continue
      const name = nfc(basename(file))
      const yy = (name.match(/^(\d{2})/) || [])[1]
      const year = yearFromToken(yy)
      if (!year || year < 2018 || year > 2026) continue
      let subject = 'other'
      let label = '자료'
      let detail = name.replace(/\.pdf$/i, '').replace(/^\d{2}/, '').replace(/^[-_\s]+/, '')
      if (/행정법/.test(name) || /행정법총론/.test(file)) {
        subject = 'haengjeongbeop'
        label = '행정법총론'
        detail = detail.replace(/^행정법총론[-_]?/, '') || kindFromName(name)
        // 앱 과목 PDF와 제목이 겹치지 않도록 데스크탑 원본은 책형/원본 표기
        if (!detail || detail === '자료' || detail === '문제') {
          detail = '원본'
        }
      } else if (/확정답안|정답/.test(name) || /확정답안/.test(file)) {
        label = '확정답안'
        detail = '확정답안'
      } else if (/전과목/.test(name) || /원본문제지/.test(file)) {
        label = '전과목'
        detail =
          detail
            .replace(/^소방공무원공채[-_]?/, '')
            .replace(/^전과목[-_]?/, '')
            .trim() || '문제'
      }
      const kind = /확정답안|정답/.test(name) ? '정답' : '문제'
      if (!detail || detail === '자료') detail = kind
      const title =
        label === '확정답안'
          ? `${TITLE_PREFIX} ${year}년 소방공무원 · 확정답안`
          : `${TITLE_PREFIX} ${year}년 소방공무원 ${label} · ${detail}`
      jobs.push({
        scope: 'firefighter',
        subject,
        title,
        content: `소방공무원 공채 기출 원본 PDF입니다. 전체 공개로 제공합니다.\n파일: ${name}`,
        file,
        dedupeKey: `firefighter|desk|${name}`,
      })
    }
  }

  // ——— 공무원 국어 (앱 + 데스크탑) ———
  {
    const appRoot = join(HOME, 'gugeobomgichul/public/exam-pdfs')
    for (const file of walkPdfs(appRoot)) {
      const name = nfc(basename(file))
      const m = name.match(/^(\d{4})-(국가직|지방직)(?:-국어)?-(문제|정답)/)
      if (!m) continue
      const [, year, track, kind] = m
      const y = Number(year)
      if (y < 2017 || y > 2026) continue
      const title = `${TITLE_PREFIX} ${year}년 공무원 국어 ${track} · ${kind}`
      jobs.push({
        scope: 'gugeo',
        subject: 'gugeo',
        title,
        content: `공무원 9급 국어 기출 원본 PDF입니다. 전체 공개로 제공합니다.\n구분: ${track}\n파일: ${name}`,
        file,
        dedupeKey: `gugeo|app|${year}|${track}|${kind}`,
      })
    }

    const deskRoot = join(HOME, 'Desktop/공무원국어_기출10개년')
    for (const file of walkPdfs(deskRoot)) {
      if (/[/\\]_원본메타[/\\]/.test(file)) continue
      const name = nfc(basename(file))
      const year = (name.match(/^(\d{4})/) || [])[1]
      if (!year) continue
      const y = Number(year)
      if (y < 2017 || y > 2026) continue
      const track = /국가직/.test(name) || /[/\\]국가직[/\\]/.test(file)
        ? '국가직'
        : /지방직/.test(name) || /[/\\]지방직[/\\]/.test(file)
          ? '지방직'
          : '기타'
      const isAnswer = /정답/.test(name) || /[/\\]정답표[/\\]/.test(file)
      let book =
        (name.match(/([가나다라마바사아자차카타파하ABCDEF])책형/i) || [])[1] ||
        (name.match(/([가나다라마바사아자차카타파하])형/) || [])[1] ||
        ''
      if (book && !/책형$/.test(book) && /^[가-힣A-Za-z]$/.test(book)) {
        book = `${book}책형`
      }
      const extra = /추가선발/.test(name) ? ' 추가선발' : ''
      const kind = isAnswer ? '정답' : '문제'
      const bookPart = book ? ` ${book}` : ''
      // 정답표는 파일명이 길어 고유 접미사로 구분
      const answerTag = isAnswer
        ? (() => {
            const short = name
              .replace(/\.pdf$/i, '')
              .replace(/^\d{4}_[^_]+_/, '')
              .replace(/\s+/g, ' ')
              .slice(0, 40)
            return short ? ` · ${short}` : ''
          })()
        : bookPart
          ? ` · ${book}`
          : ''
      const title = isAnswer
        ? `${TITLE_PREFIX} ${year}년 공무원 국어 ${track}${extra} · 정답${answerTag}`
        : `${TITLE_PREFIX} ${year}년 공무원 국어 ${track}${extra} · ${kind}${bookPart}`
      jobs.push({
        scope: 'gugeo',
        subject: 'gugeo',
        title,
        content: `공무원 9급 국어 기출 원본 PDF입니다. 전체 공개로 제공합니다.\n구분: ${track}\n파일: ${name}`,
        file,
        dedupeKey: `gugeo|desk|${name}`,
      })
    }
  }

  // ——— 행정사 (데스크탑 10개년) ———
  {
    const deskRoot = join(HOME, 'Desktop/행정사_기출_10개년')
    for (const file of walkPdfs(deskRoot)) {
      if (/[/\\]\.venv[/\\]|[/\\]_버림[/\\]/.test(file)) continue
      const name = nfc(basename(file))
      const parent = nfc(basename(dirname(file)))
      const folderYear = (parent.match(/_(\d{4})$/) || [])[1]
      const folderRound = (parent.match(/제(\d+)회/) || [])[1]
      const nameYear = (name.match(/(\d{4})\s*년/) || name.match(/^(\d{4})/))?.[1]
      const nameRound = (name.match(/제\s*(\d+)\s*회/) || [])[1]
      const year = Number(folderYear || nameYear)
      const round = folderRound || nameRound
      if (!year || year < 2017 || year > 2026) continue

      const kind = kindFromName(name)
      let detail = name
        .replace(/\.pdf$/i, '')
        .replace(/^\d{4}\s*년도?\s*/, '')
        .replace(/제\s*\d+\s*회\s*/, '')
        .replace(/^행정사\s*/, '')
        .replace(/\s+/g, ' ')
        .trim()
      if (!detail) detail = kind

      const roundLabel = round ? `제${round}회 ` : ''
      const title = `${TITLE_PREFIX} ${year}년 ${roundLabel}행정사 · ${detail}`
      jobs.push({
        scope: 'haengjeongsa',
        subject,
        title,
        content: `행정사 국가자격시험 기출 원본 PDF입니다. 전체 공개로 제공합니다.\n파일: ${name}`,
        file,
        dedupeKey: `haengjeongsa|${year}|${name}`,
      })
    }
  }

  return jobs
}

async function resolveAdmin(admin) {
  const { data, error } = await admin.auth.admin.listUsers({ perPage: 200 })
  if (error) throw new Error(`관리자 조회 실패: ${error.message}`)
  const user = data.users.find((u) => u.email === ADMIN_EMAIL)
  if (!user) throw new Error(`${ADMIN_EMAIL} 없음`)
  await admin
    .from('profiles')
    .upsert({ id: user.id, nickname: ADMIN_NICKNAME, username_set: true })
  return user.id
}

async function existingTitles(admin) {
  const set = new Set()
  let from = 0
  const page = 1000
  for (;;) {
    const { data, error } = await admin
      .from('posts')
      .select('title')
      .eq('category', 'resource')
      .eq('resource_type', 'past_exam')
      .like('title', `${TITLE_PREFIX}%`)
      .range(from, from + page - 1)
    if (error) throw new Error(error.message)
    if (!data?.length) break
    for (const row of data) set.add(row.title)
    if (data.length < page) break
    from += page
  }
  return set
}

async function uploadOne(admin, authorId, job) {
  const buf = readFileSync(job.file)
  const hash = createHash('sha256').update(buf).digest('hex').slice(0, 12)
  // Storage object keys must be ASCII — keep Korean only in display file_name.
  const asciiName = basename(job.file)
    .normalize('NFKD')
    .replace(/[^\x00-\x7F]/g, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '_')
    .replace(/^_+|_+$/g, '') || 'exam.pdf'
  const storageName = asciiName.toLowerCase().endsWith('.pdf') ? asciiName : `${asciiName}.pdf`

  const { data: post, error: postErr } = await admin
    .from('posts')
    .insert({
      author_id: authorId,
      category: 'resource',
      community_scope: job.scope,
      resource_type: 'past_exam',
      subject: job.subject,
      title: job.title,
      content: job.content,
    })
    .select('id')
    .single()
  if (postErr) throw new Error(`post: ${postErr.message}`)

  const path = `${authorId}/${post.id}/${Date.now()}-${hash}-${storageName}`
  const { error: upErr } = await admin.storage.from(BUCKET).upload(path, buf, {
    contentType: 'application/pdf',
    upsert: false,
  })
  if (upErr) {
    await admin.from('posts').delete().eq('id', post.id)
    throw new Error(`storage: ${upErr.message}`)
  }

  const { error: attErr } = await admin.from('post_attachments').insert({
    post_id: post.id,
    file_name: basename(job.file),
    file_path: path,
    file_size: buf.length,
    mime_type: 'application/pdf',
  })
  if (attErr) throw new Error(`attachment: ${attErr.message}`)
  return post.id
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('SUPABASE env 필요')

  const admin = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { 'X-Client-Info': 'upload-original-exam-pdfs' } },
    realtime: { transport: ws },
  })

  let jobs = collectJobs()
  if (ONLY) jobs = jobs.filter((j) => j.scope === ONLY)
  console.log(`후보 ${jobs.length}개${DRY ? ' (dry-run)' : ''}`)

  const authorId = await resolveAdmin(admin)
  console.log(`author ${authorId}`)
  const have = await existingTitles(admin)
  console.log(`기존 [기출 원본] ${have.size}개`)

  let created = 0
  let skipped = 0
  let errors = 0

  for (const [i, job] of jobs.entries()) {
    if (have.has(job.title)) {
      skipped += 1
      continue
    }
    process.stdout.write(`[${i + 1}/${jobs.length}] ${job.title} … `)
    if (DRY) {
      console.log('DRY')
      continue
    }
    try {
      const id = await uploadOne(admin, authorId, job)
      have.add(job.title)
      created += 1
      console.log(`OK ${id}`)
    } catch (e) {
      errors += 1
      console.log(`FAIL ${e.message}`)
    }
  }

  console.log(`\n끝 created=${created} skipped=${skipped} errors=${errors}`)
}

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href
if (isDirectRun) {
  main().catch((e) => {
    console.error(e)
    process.exit(1)
  })
}