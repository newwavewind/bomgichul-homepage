import { buildConceptStudySheet } from './conceptStudySheetModel.js'

function StudyTable({ block }) {
  return (
    <section className="cssheet-table liquid-glass liquid-glass--tint" aria-label={block.title ?? '결정기준'}>
      {block.title ? <h4 className="cssheet-table__title">{block.title}</h4> : null}
      <div className="cssheet-table__head" role="row">
        <span role="columnheader">{block.columnLeft}</span>
        <span role="columnheader">{block.columnRight}</span>
      </div>
      <dl className="cssheet-table__body">
        {block.rows.map((entry) => (
          <div key={entry.id} className="cssheet-table__row" role="row">
            <dt>{entry.left}</dt>
            <dd><span className="cssheet-answer">{entry.right}</span></dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function StudyVersus({ block }) {
  return (
    <section className="cssheet-versus liquid-glass liquid-glass--tint" aria-label={block.title}>
      <h4 className="cssheet-versus__title">{block.title}</h4>
      <div className="cssheet-versus__grid">
        <div className="cssheet-versus__side">
          {block.left.hint ? <small>{block.left.hint}</small> : null}
          <span>{block.left.label}</span>
          <strong>{block.left.answer}</strong>
        </div>
        <i className="cssheet-versus__mid" aria-hidden>vs</i>
        <div className="cssheet-versus__side">
          {block.right.hint ? <small>{block.right.hint}</small> : null}
          <span>{block.right.label}</span>
          <strong>{block.right.answer}</strong>
        </div>
      </div>
    </section>
  )
}

function StudyNote({ block }) {
  return (
    <aside className="cssheet-note">
      <b>{block.label}</b>
      <p>{block.text}</p>
    </aside>
  )
}

export function ConceptStudySheet({
  guide,
  intro,
  pairFirst = false,
  showIntro = true,
}) {
  const sheet = buildConceptStudySheet(guide)
  const lede = intro ?? (showIntro ? sheet.intro : null)
  const orderPairFirst = pairFirst || sheet.pairFirst

  if (!lede && !sheet.tables.length && !sheet.versus.length && !sheet.notes.length) {
    return null
  }

  const tables = sheet.tables.map((block) => <StudyTable key={block.id} block={block} />)
  const pairs = sheet.versus.map((block) => <StudyVersus key={block.id} block={block} />)
  const notes = sheet.notes.map((block) => <StudyNote key={block.id} block={block} />)

  return (
    <div className="cssheet">
      {lede ? <p className="cssheet-intro">{lede}</p> : null}
      <div className="cssheet-stack">
        {orderPairFirst ? <>{pairs}{tables}</> : <>{tables}{pairs}</>}
        {notes}
      </div>
    </div>
  )
}
