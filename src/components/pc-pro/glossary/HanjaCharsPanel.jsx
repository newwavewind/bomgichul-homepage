import { useMemo } from 'react'
import { getTermHanjaBreakdown } from './hanjaBreakdown'
import './hanja-panel.css'

/**
 * 한자어 글자별 풀이 — 뜻·음·획·급수·부수.
 * 용어 카드·한자 풀이 창이 같은 모양을 쓴다.
 */
export default function HanjaCharsPanel({ term, hanja }) {
  const chars = useMemo(() => getTermHanjaBreakdown(term, hanja), [term, hanja])
  if (!chars.length) return null
  const howParts = chars.filter(c => c.meaning && c.sound)
  return (
    <section className="ltm-hanja" aria-label="한자 글자 풀이">
      <p className="ltm-hanja__hanja" lang="ko-Hani">
        {hanja}
      </p>
      {howParts.length > 1 ? (
        <div className="ltm-hanja__how">
          <p className="ltm-hanja__parts">
            {howParts.map((c, i) => (
              <span key={`${c.char}-${i}`}>
                {i ? <i aria-hidden> + </i> : null}
                <span className="ltm-hanja__p-hun">{c.meaning}</span>{' '}
                <b className="ltm-hanja__p-eum">{c.sound}</b>
              </span>
            ))}
          </p>
        </div>
      ) : null}
      <ul className="ltm-hanja__list">
        {chars.map((c, i) => {
          const rep = c.others?.[0]
          const repDiff = rep && (rep.meaning !== c.meaning || rep.sound !== c.sound)
          return (
            <li key={`${c.char}-${i}`} className="ltm-hanja__item">
              <div className="ltm-hanja__row">
                <span className="ltm-hanja__ch" lang="ko-Hani">
                  {c.char}
                </span>
                <span className={`ltm-hanja__hun${c.meaning ? '' : ' is-empty'}`}>
                  <span>
                    {c.meaning || '확인 중'} <b>{c.sound || '—'}</b>
                  </span>
                  {c.strokes != null || c.grade ? (
                    <span className="ltm-hanja__meta">
                      {c.strokes != null ? <span className="ltm-hanja__stroke">{c.strokes}획</span> : null}
                      {c.grade ? <span className="ltm-hanja__grade">{c.grade}</span> : null}
                    </span>
                  ) : null}
                  {c.wordSoundDiffers ? (
                    <small className="ltm-hanja__rep">이 낱말에서는 ‘{c.wordSound}’</small>
                  ) : null}
                  {repDiff ? (
                    <small className="ltm-hanja__rep">
                      다른 뜻 {rep.meaning} {rep.sound}
                    </small>
                  ) : null}
                </span>
                {c.radical ? (
                  <>
                    <span className="ltm-hanja__rule" aria-hidden />
                    <span className="ltm-hanja__rad">
                      <span className="ltm-hanja__rad-k">부수</span>
                      <span className="ltm-hanja__rad-v">
                        <b lang="ko-Hani">{c.radical}</b>
                        {c.radicalName ? ` ${c.radicalName}` : ''}
                      </span>
                    </span>
                  </>
                ) : null}
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
