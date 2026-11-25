import { useState } from 'react'
import { AppearanceControls } from '@/components/layout/AppearanceControls'
import SettingsGearButton from './SettingsGearButton'

export function examLabel(exam) {
  const { year, round, source, question_no } = exam
  const session = round ? ' 제' + round + '회' : source ? ' ' + source : ''
  return year + '년' + session + ' · ' + question_no + '번'
}

export function lastAttemptWrong(progress, exam, item) {
  return Boolean(progress?.[exam.id]?.[item.key])
}

export function ScreenHeader({ titleHighlight, onBack }) {
  const [settings, setSettings] = useState(false)
  return (
    <header className="cc-d4-header-card cc-d4-header-card--compact ds-app-header">
      <div className="sh-d4-header-row sh-d4-header-row--title-line">
        <button type="button" className="sh-d4-title-back" aria-label="뒤로 가기" onClick={onBack}>
          <span className="cc-d4-ref-back" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </span>
        </button>
        <h1 className="cc-d4-title cc-d4-title--screen"><span className="cc-d4-highlight">{titleHighlight}</span></h1>
        <div className="sh-d4-header-actions sh-d4-header-actions--settings">
          <SettingsGearButton compact ariaExpanded={settings} onClick={() => setSettings(value => !value)} />
        </div>
      </div>
      {settings && <div className="pc-workbook-settings"><AppearanceControls /></div>}
    </header>
  )
}
