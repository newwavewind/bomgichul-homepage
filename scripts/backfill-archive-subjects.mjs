#!/usr/bin/env node
/**
 * 자료실 posts.subject 백필 — 제목의 과목 표기 → slug.
 * 직렬(track) 필터가 subjectIds로 동작하도록 public_service 등 보정.
 *
 *   node --env-file=.env.local scripts/backfill-archive-subjects.mjs
 *   node --env-file=.env.local scripts/backfill-archive-subjects.mjs --dry-run
 */
import { createClient } from '@supabase/supabase-js'

const DRY = process.argv.includes('--dry-run')
const TITLE_PREFIX = '[기출 원본]'

/** 긴 라벨 우선 매칭 */
const PUBLIC_SERVICE_LABELS = [
  ['형사소송법개론', 'hyeongsogaeron'],
  ['사회복지학개론', 'bokji'],
  ['행정법총론', 'haengjeongbeop'],
  ['행정학개론', 'hangjunghak'],
  ['교육학개론', 'gyoyukhak'],
  ['노동법개론', 'nodongbeop'],
  ['국제법개론', 'gukjebeop'],
  ['관세법개론', 'gwansebeop'],
  ['교정학개론', 'gyojeonghak'],
  ['소방관계법규', 'sobangbeop'],
  ['소방학개론', 'sobang'],
  ['세법개론', 'sebeop'],
  ['형사소송법', 'hyeongso'],
  ['회계원리', 'hoegyewonri'],
  ['지방세법', 'sebeop'],
  ['관세법', 'gwansebeop'],
  ['교정학', 'gyojeonghak'],
  ['국제법', 'gukjebeop'],
  ['노동법', 'nodongbeop'],
  ['회계학', 'hoegyehak'],
  ['형법', 'hyeongbeop'],
]

function inferPublicServiceSubject(title) {
  for (const [label, slug] of PUBLIC_SERVICE_LABELS) {
    if (title.includes(label)) return slug
  }
  return null
}

function inferEnglishSubject(title) {
  if (title.includes('공무원 영어') || title.includes('영어')) return 'english'
  return null
}

function inferHistorySubject(title) {
  if (title.includes('심화')) return 'advanced'
  if (title.includes('기본')) return 'basic'
  return null
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('SUPABASE env 필요')

  const admin = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  let from = 0
  const pageSize = 500
  let updated = 0
  let scanned = 0

  for (;;) {
    const { data, error } = await admin
      .from('posts')
      .select('id, title, subject, community_scope')
      .eq('category', 'resource')
      .like('title', `${TITLE_PREFIX}%`)
      .range(from, from + pageSize - 1)

    if (error) throw error
    if (!data?.length) break

    for (const row of data) {
      scanned += 1
      let next = null
      if (row.community_scope === 'public_service') {
        next = inferPublicServiceSubject(row.title)
      } else if (row.community_scope === 'english') {
        next = inferEnglishSubject(row.title)
      } else if (row.community_scope === 'history') {
        next = inferHistorySubject(row.title)
      }
      if (!next || next === row.subject) continue

      console.log(`${row.subject} → ${next} | ${row.title}`)
      if (!DRY) {
        const { error: upErr } = await admin
          .from('posts')
          .update({ subject: next })
          .eq('id', row.id)
        if (upErr) {
          console.error('update fail', row.id, upErr.message)
          continue
        }
      }
      updated += 1
    }

    if (data.length < pageSize) break
    from += pageSize
  }

  console.log(`scanned=${scanned} updated=${updated}${DRY ? ' (dry-run)' : ''}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
