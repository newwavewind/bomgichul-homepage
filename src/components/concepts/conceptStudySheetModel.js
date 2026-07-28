function row(id, left, right) {
  return { id, left, right }
}

function mapObjectRows(items, leftKey, rightKey, formatLeft) {
  return items.map((item, index) => row(
    item[leftKey] ?? `row-${index}`,
    formatLeft ? formatLeft(item) : item[leftKey],
    item[rightKey],
  ))
}

function table(id, title, columnLeft, columnRight, rows) {
  if (!rows?.length) return null
  return { id, title, columnLeft, columnRight, rows }
}

function versusBlock(id, title, left, right) {
  return { id, title, left, right }
}

function noteBlock(id, label, text) {
  if (!text) return null
  return { id, label, text }
}

export function buildConceptStudySheet(guide) {
  const tables = []
  const versus = []
  const notes = []

  if (Array.isArray(guide.criteria) && guide.criteria[0]?.situation) {
    tables.push(table(
      'criteria',
      null,
      '상황',
      '결정기준점',
      guide.criteria.map((item) => row(item.situation, item.situation, item.marker)),
    ))
  } else if (Array.isArray(guide.criteria) && typeof guide.criteria[0] === 'string') {
    tables.push(table(
      'criteria',
      null,
      '순번',
      guide.criteriaLabels?.marker ?? '기준',
      guide.criteria.map((item, index) => row(`criteria-${index}`, String(index + 1).padStart(2, '0'), item)),
    ))
  }

  if (guide.cases?.[0]?.situation && guide.cases[0].result != null) {
    tables.push(table('cases', null, '상황', '판정', mapObjectRows(guide.cases, 'situation', 'result')))
    const why = guide.cases.map((item) => item.why).filter(Boolean).join(' · ')
    if (why) notes.push(noteBlock('cases-why', '판정 이유', why))
  }

  if (guide.request?.[0]?.situation) {
    tables.push(table('request', '의뢰·열람', '상황', '경로', mapObjectRows(guide.request, 'situation', 'route')))
  }

  if (guide.desk?.[0]?.point) {
    tables.push(table('desk', '기준점 창구', '기준점', '열람 창구', mapObjectRows(guide.desk, 'point', 'office')))
  }

  if (guide.consent?.[0]?.situation) {
    tables.push(table('consent', null, '이해관계인', '등기 방식', mapObjectRows(guide.consent, 'situation', 'result')))
  }

  if (guide.allocation?.[0]?.situation) {
    tables.push(table('allocation', null, '상황', '배분', mapObjectRows(guide.allocation, 'situation', 'result')))
  }

  if (guide.remedies?.[0]?.situation) {
    tables.push(table('remedies', null, '상황', '구제수단', mapObjectRows(guide.remedies, 'situation', 'claim')))
  }

  if (guide.conflicts?.[0]?.situation) {
    tables.push(table('conflicts', null, '상황', '선택 기준', mapObjectRows(guide.conflicts, 'situation', 'choice')))
  }

  if (guide.scene?.[0]?.marker != null) {
    tables.push(table(
      'scene',
      '현장 표지',
      '경계점',
      '표지',
      mapObjectRows(guide.scene, 'point', 'marker', (item) => `${item.point} · ${item.clue}`),
    ))
  }

  if (guide.shore?.[0]?.name) {
    tables.push(table(
      'shore',
      '육지 → 물속',
      '구분',
      '상태 · 소유',
      guide.shore.map((item) => row(item.name, item.name, `${item.state} · ${item.owner}`)),
    ))
  }

  if (guide.actors?.[0]?.situation && guide.actors[0].actor != null) {
    tables.push(table('actors', null, '상황', '신고의무자', mapObjectRows(guide.actors, 'situation', 'actor')))
    const detail = guide.actors.map((item) => item.detail).filter(Boolean).join(' · ')
    if (detail) notes.push(noteBlock('actors-detail', '세부', detail))
  }

  const pair = guide.confusionPair ?? guide.waterPair
  if (pair) {
    versus.push(versusBlock(
      'primary-pair',
      guide.pairTitle ?? (guide.waterPair ? '헷갈리는 짝 · 해면 vs 수면' : '헷갈리는 짝'),
      { hint: pair.left.hint, label: pair.left.situation, answer: pair.left.marker },
      { hint: pair.right.hint, label: pair.right.situation, answer: pair.right.marker },
    ))
  }

  if (guide.confusionPairs?.length) {
    guide.confusionPairs.forEach((entry, index) => {
      versus.push(versusBlock(
        `pair-${index}`,
        entry.title ?? guide.pairTitle ?? '헷갈리는 짝',
        { hint: entry.left.hint, label: entry.left.situation, answer: entry.left.marker },
        { hint: entry.right.hint, label: entry.right.situation, answer: entry.right.marker },
      ))
    })
  }

  if (guide.buildingRule) notes.push(noteBlock('building-rule', '분할선 주의', guide.buildingRule))
  if (guide.notCriteria) notes.push(noteBlock('not-criteria', '기준 아님', guide.notCriteria))
  if (guide.notExpanded) notes.push(noteBlock('not-expanded', '확대 해석 금지', guide.notExpanded))
  if (guide.excluded?.length) notes.push(noteBlock('excluded', '기록하지 않음', guide.excluded.join(' · ')))

  if (guide.studySheet) {
    return {
      intro: guide.studySheet.intro ?? guide.summary ?? null,
      tables: guide.studySheet.tables?.length ? guide.studySheet.tables : tables,
      versus: guide.studySheet.versus?.length ? guide.studySheet.versus : versus,
      notes: guide.studySheet.notes?.length ? guide.studySheet.notes : notes.filter(Boolean),
      pairFirst: guide.studySheet.pairFirst ?? false,
    }
  }

  return {
    intro: guide.summary ?? null,
    tables: tables.filter(Boolean),
    versus,
    notes: notes.filter(Boolean),
    pairFirst: Boolean(guide.pairFirst),
  }
}
