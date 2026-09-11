#!/usr/bin/env node
/**
 * 자료실 기출 원본 누락분 채우기.
 * - 사회복지사: Desktop/사회복지사1급_기출_10개년 (2022~2024 문제 HWP, 2017 문제, 2026 정답)
 * - 주택관리사: Desktop/주택관리사 중 앱 exam-pdfs에 없는 1차·정답
 *
 *   node --env-file=.env.local scripts/fill-missing-past-exam-pdfs.mjs
 *   node --env-file=.env.local scripts/fill-missing-past-exam-pdfs.mjs --dry-run
 */
import { createClient } from '@supabase/supabase-js'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, copyFileSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'

const ADMIN_EMAIL = 'newwavewind@gmail.com'
const ADMIN_NICKNAME = '봄기출'
const BUCKET = 'archive'
const TITLE_PREFIX = '[기출 원본]'
const DRY = process.argv.includes('--dry-run')
const HOME = process.env.HOME || '/Users/newsang'

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

function mimeFor(file) {
  const n = file.toLowerCase()
  if (n.endsWith('.pdf')) return 'application/pdf'
  if (n.endsWith('.hwp')) return 'application/x-hwp'
  if (n.endsWith('.hwpx')) return 'application/hwp+zip'
  return 'application/octet-stream'
}

function ensureDir(p) {
  mkdirSync(p, { recursive: true })
}

function copyInto(destDir, destName, src) {
  ensureDir(destDir)
  const dest = join(destDir, destName)
  if (!existsSync(dest)) copyFileSync(src, dest)
  return dest
}

function buildJobs() {
  const jobs = []
  const swRoot = join(HOME, 'Desktop/사회복지사1급_기출_10개년')
  const swApp = join(HOME, 'socialworkerbomgichul/public/exam-pdfs/social')

  const swPlan = [
    // 2017 문제 (HWP만)
    ...[1, 2, 3].flatMap((p) =>
      ['A', 'B'].map((t) => ({
        year: 2017,
        src: join(swRoot, `2017_제15회/문제/2017년 제15회 사회복지사 1급 시험문제 ${p}교시(${t}형).hwp`),
        destName: `2017-${p}교시-문제지-${t}형.hwp`,
        detail: `${p}교시 문제지 ${t}형`,
      })),
    ),
    // 2022~2024 문제 (HWP A형만)
    ...[2022, 2023, 2024].flatMap((year, yi) => {
      const round = 20 + yi
      return [1, 2, 3].map((p) => ({
        year,
        src: join(swRoot, `${year}_제${round}회/문제/제${round}회 사회복지사 1급 시험 ${p}교시 A형.hwp`),
        destName: `${year}-${p}교시-문제지-A형.hwp`,
        detail: `${p}교시 문제지 A형`,
      }))
    }),
    // 2026 정답 (HWP)
    {
      year: 2026,
      src: join(swRoot, '2026_제24회/정답/[붙임] 2026년 제24회 사회복지사1급 자격시험 최종 정답.hwp'),
      destName: '2026-최종정답.hwp',
      detail: '최종정답',
    },
  ]

  for (const item of swPlan) {
    if (!existsSync(item.src)) {
      console.warn('missing src', item.src)
      continue
    }
    const dest = copyInto(join(swApp, String(item.year)), item.destName, item.src)
    jobs.push({
      scope: 'social_worker',
      subject: 'other',
      title: `${TITLE_PREFIX} ${item.year}년 사회복지사 1급 · ${item.detail}`,
      content: `사회복지사 1급 기출 원본입니다. 전체 공개로 제공합니다.\n파일: ${item.destName}`,
      file: dest,
    })
  }

  // ——— 주택관리사 누락 (Desktop) ———
  const hsRoot = join(HOME, 'Desktop/주택관리사')
  const hsApp = join(HOME, 'housingbomgichul/public/exam-pdfs/housing')
  const hsPlan = [
    {
      year: 2016,
      src: join(hsRoot, '2016/2016년 제19회 주택관리사보 2차시험 객관식 최종정답.hwp'),
      destName: '2016-2차-최종정답-객관식.hwp',
      detail: '2차 최종정답 객관식',
    },
    {
      year: 2016,
      src: join(hsRoot, '2016/주택관리사보 2차시험 최종정답(주관식).hwp'),
      destName: '2016-2차-최종정답-주관식.hwp',
      detail: '2차 최종정답 주관식',
    },
    {
      year: 2018,
      src: join(hsRoot, '2018/1차 A형 주택21회 문제지원본 A형.hwp'),
      destName: '2018-1차-문제지-A형.hwp',
      detail: '1차 문제지 A형',
    },
    {
      year: 2018,
      src: join(hsRoot, '2018/1차 B형 주택21회 문제지원본 B형.hwp'),
      destName: '2018-1차-문제지-B형.hwp',
      detail: '1차 문제지 B형',
    },
    {
      year: 2018,
      src: join(hsRoot, '2018/2018년 제21회 주택관리사보 1차시험 최종정답.hwp'),
      destName: '2018-1차-최종정답.hwp',
      detail: '1차 최종정답',
    },
    {
      year: 2018,
      src: join(hsRoot, '2018/[붙임]2018년 제21회 주택관리사보 2차시험 최종정답(객관식).hwp'),
      destName: '2018-2차-최종정답-객관식.hwp',
      detail: '2차 최종정답 객관식',
    },
    {
      year: 2019,
      src: join(hsRoot, '2019/22회 주택관리사보 1차 1교시_A형.hwp'),
      destName: '2019-1차-1교시-문제지-A형.hwp',
      detail: '1차 1교시 문제지 A형',
    },
    {
      year: 2019,
      src: join(hsRoot, '2019/22회 주택관리사보 1차 1교시_B형.hwp'),
      destName: '2019-1차-1교시-문제지-B형.hwp',
      detail: '1차 1교시 문제지 B형',
    },
    {
      year: 2019,
      src: join(hsRoot, '2019/★2019년도 제22회 주택관리사보 2교시(민법) A형.hwp'),
      destName: '2019-1차-2교시-문제지-A형.hwp',
      detail: '1차 2교시 문제지 A형',
    },
    {
      year: 2019,
      src: join(hsRoot, '2019/★2019년도 제22회 주택관리사보 2교시(민법) B형.hwp'),
      destName: '2019-1차-2교시-문제지-B형.hwp',
      detail: '1차 2교시 문제지 B형',
    },
  ]

  for (const item of hsPlan) {
    if (!existsSync(item.src)) {
      console.warn('missing src', item.src)
      continue
    }
    const dest = copyInto(join(hsApp, String(item.year)), item.destName, item.src)
    jobs.push({
      scope: 'housing',
      subject: 'other',
      title: `${TITLE_PREFIX} ${item.year}년 주택관리사보 · ${item.detail}`,
      content: `주택관리사보 기출 원본입니다. 전체 공개로 제공합니다.\n파일: ${item.destName}`,
      file: dest,
    })
  }

  // ——— 경찰 2017–2021 (수집 원본 PDF/HWP) ———
  {
    const root = join(HOME, 'policebomgichul/public/exam-pdfs/police')
    for (const year of ['2017', '2018', '2019', '2020', '2021']) {
      const dir = join(root, year)
      if (!existsSync(dir)) continue
      for (const name of readdirSync(dir)) {
        const lower = name.toLowerCase()
        if (!lower.endsWith('.pdf') && !lower.endsWith('.hwp') && !lower.endsWith('.hwpx')) continue
        const file = join(dir, name)
        if (!statSync(file).isFile()) continue
        let detail = name.replace(/\.(pdf|hwp|hwpx)$/i, '').replace(/^\d{4}-/, '').replace(/-/g, ' ')
        jobs.push({
          scope: 'police',
          subject: 'other',
          title: `${TITLE_PREFIX} ${year}년 경찰공무원 · ${detail}`,
          content: `경찰공무원(순경 공채) 기출 원본입니다. 전체 공개로 제공합니다.\n파일: ${name}`,
          file,
        })
      }
    }
  }

  return jobs
}

async function resolveAdmin(admin) {
  const { data, error } = await admin.auth.admin.listUsers({ perPage: 200 })
  if (error) throw new Error(`관리자 조회 실패: ${error.message}`)
  const user = data.users.find((u) => u.email === ADMIN_EMAIL)
  if (!user) throw new Error(`${ADMIN_EMAIL} 없음`)
  await admin.from('profiles').upsert({ id: user.id, nickname: ADMIN_NICKNAME, username_set: true })
  return user.id
}

async function existingTitles(admin) {
  const set = new Set()
  let from = 0
  for (;;) {
    const { data, error } = await admin
      .from('posts')
      .select('title')
      .eq('category', 'resource')
      .eq('resource_type', 'past_exam')
      .like('title', `${TITLE_PREFIX}%`)
      .range(from, from + 999)
    if (error) throw new Error(error.message)
    if (!data?.length) break
    for (const row of data) set.add(row.title)
    if (data.length < 1000) break
    from += 1000
  }
  return set
}

async function uploadOne(admin, authorId, job) {
  const buf = readFileSync(job.file)
  const hash = createHash('sha256').update(buf).digest('hex').slice(0, 12)
  const asciiName =
    basename(job.file)
      .normalize('NFKD')
      .replace(/[^\x00-\x7F]/g, '')
      .replace(/[^a-zA-Z0-9._-]+/g, '_')
      .replace(/^_+|_+$/g, '') || 'exam.bin'
  const ext = basename(job.file).includes('.') ? basename(job.file).split('.').pop() : 'bin'
  const storageName = asciiName.includes('.') ? asciiName : `${asciiName}.${ext}`

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
    contentType: mimeFor(job.file),
    upsert: false,
  })
  if (upErr) throw new Error(`storage: ${upErr.message}`)

  const { error: attErr } = await admin.from('post_attachments').insert({
    post_id: post.id,
    file_name: basename(job.file),
    file_path: path,
    file_size: buf.length,
    mime_type: mimeFor(job.file),
  })
  if (attErr) throw new Error(`attachment: ${attErr.message}`)
  return post.id
}

async function main() {
  const jobs = buildJobs()
  console.log(`jobs=${jobs.length}${DRY ? ' (dry-run)' : ''}`)

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('SUPABASE env 필요')
  const admin = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
  const authorId = await resolveAdmin(admin)
  const have = await existingTitles(admin)

  let created = 0
  let skipped = 0
  for (const [i, job] of jobs.entries()) {
    if (have.has(job.title)) {
      skipped += 1
      continue
    }
    process.stdout.write(`[${i + 1}/${jobs.length}] ${job.title} … `)
    if (DRY) {
      console.log('dry')
      created += 1
      continue
    }
    try {
      await uploadOne(admin, authorId, job)
      have.add(job.title)
      created += 1
      console.log('ok')
    } catch (e) {
      console.log('FAIL', e.message)
    }
  }
  console.log(`created=${created} skipped=${skipped}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
