'use client'

/** Ported from ox-quiz-app ConceptsScreen Kind UI (기출 올인원). */

import '@/styles/concepts/conceptsScreen.css'
import '@/styles/concepts/conceptsVisualBatch17.css'
import '@/styles/concepts/conceptsVisualBatch18.css'
import '@/styles/concepts/conceptsVisualBatch19.css'
import '@/styles/concepts/conceptsVisualBatch20.css'
import '@/styles/concepts/conceptsVisualBatch21.css'
import '@/styles/concepts/conceptsVisualBatch22.css'
import '@/styles/concepts/conceptsVisualBatch23.css'
import '@/styles/concepts/conceptsVisualBatch24.css'
import '@/styles/concepts/conceptsVisualBatch25.css'
import '@/styles/concepts/conceptsVisualBatch26.css'
import '@/styles/concepts/conceptsVisualBatch27.css'
import '@/styles/concepts/conceptsVisualBatch28.css'
import '@/styles/concepts/conceptsVisualBatch29.css'
import '@/styles/concepts/conceptsVisualBatch30.css'
import '@/styles/concepts/conceptsVisualBatch31.css'
import '@/styles/concepts/conceptsVisualBatch32.css'
import '@/styles/concepts/conceptsVisualBatch33.css'
import '@/styles/concepts/conceptsVisualBatch34.css'
import '@/styles/concepts/conceptsVisualBatch35.css'
import '@/styles/concepts/conceptsVisualBatch36.css'
import '@/styles/concepts/conceptsVisualBatch37.css'
import '@/styles/concepts/conceptsVisualBatch38.css'
import '@/styles/concepts/conceptsVisualBatch39.css'
import '@/styles/concepts/conceptsVisualBatch40.css'
import '@/styles/concepts/conceptsVisualBatch41.css'
import '@/styles/concepts/conceptsVisualBatch42.css'
import '@/styles/concepts/conceptsVisualBatch43.css'
import '@/styles/concepts/conceptsVisualBatch44.css'
import '@/styles/concepts/conceptsVisualBatch45.css'
import '@/styles/concepts/conceptsVisualBatch46.css'
import '@/styles/concepts/conceptsVisualBatch47.css'
import '@/styles/concepts/conceptsVisualBatch48.css'
import '@/styles/concepts/conceptsVisualBatch49.css'
import '@/styles/concepts/conceptsVisualBatch50.css'
import '@/styles/concepts/conceptsVisualBatch51.css'
import '@/styles/concepts/conceptsVisualBatch52.css'
import '@/styles/concepts/conceptsVisualBatch53.css'
import '@/styles/concepts/conceptsVisualBatch54.css'
import '@/styles/concepts/conceptsVisualBatch55.css'
import '@/styles/concepts/conceptsVisualBatch56.css'
import '@/styles/concepts/conceptsVisualBatch57.css'
import '@/styles/concepts/conceptsVisualBatch58.css'
import '@/styles/concepts/conceptsVisualBatch59.css'
import '@/styles/concepts/conceptsVisualBatch60.css'
import '@/styles/concepts/conceptsVisualBatch61.css'
import '@/styles/concepts/conceptsVisualBatch62.css'
import '@/styles/concepts/conceptsVisualBatch63.css'
import '@/styles/concepts/conceptsVisualBatch64.css'
import '@/styles/concepts/conceptsVisualBatch65.css'
import '@/styles/concepts/conceptsVisualBatch66.css'
import '@/styles/concepts/conceptsVisualBatch67.css'
import '@/styles/concepts/conceptsVisualBatch68.css'
import '@/styles/concepts/conceptsVisualBatch69.css'
import '@/styles/concepts/conceptsVisualBatch70.css'
import '@/styles/concepts/conceptsVisualBatch71.css'
import '@/styles/concepts/conceptsVisualBatch72.css'
import '@/styles/concepts/conceptsVisualBatch73.css'

function SectionBlock({ label, index = null, amended = false, children }) {
  return (
    <section className="cx-section">
      <h3 className="cx-section__label">
        {index != null ? (
          <span className="cx-section__index" aria-hidden>
            {String(index).padStart(2, '0')}
          </span>
        ) : null}
        <span className="cx-section__label-text">{label}</span>
        {amended ? <span className="cx-amend-badge">개정 반영</span> : null}
      </h3>
      <div className="cx-section__body">{children}</div>
    </section>
  )
}

function ConceptVisualGuide({ guide }) {
  if (!guide) return null
  if (guide.kind === 'study-map') return <ConceptStudyMap guide={guide} />
  if (guide.kind === 'legal-thresholds') return <LegalThresholdGuide guide={guide} />
  if (guide.kind === 'report-process') return <ReportProcessGuide guide={guide} />
  if (guide.kind === 'registry-visual') return <RegistryVisualGuide guide={guide} />
  if (guide.kind === 'registration-effects') return <RegistrationEffectsGuide guide={guide} />
  if (guide.kind === 'return-risk') return <ReturnRiskGuide guide={guide} />
  if (guide.kind === 'sham-relation') return <ShamRelationGuide guide={guide} />
  if (guide.kind === 'appraisal-system') return <AppraisalSystemGuide guide={guide} />
  if (guide.kind === 'ownership-chain') return <OwnershipChainGuide guide={guide} />
  if (guide.kind === 'cancellation-timer') return <CancellationTimerGuide guide={guide} />
  if (guide.kind === 'land-vocabulary') return <LandVocabularyGuide guide={guide} />
  if (guide.kind === 'land-causality') return <LandCausalityGuide guide={guide} />
  if (guide.kind === 'broker-registration') return <BrokerRegistrationGuide guide={guide} />
  if (guide.kind === 'brokerage-fee') return <BrokerageFeeGuide guide={guide} />
  if (guide.kind === 'registration-procedure') return <RegistrationProcedureGuide guide={guide} />
  if (guide.kind === 'housing-definitions') return <HousingDefinitionsGuide guide={guide} />
  if (guide.kind === 'rent-theories') return <RentTheoriesGuide guide={guide} />
  if (guide.kind === 'urban-models') return <UrbanModelsGuide guide={guide} />
  if (['public-order-act','policy-status','broker-pause','land-movement','tax-gates','housing-association'].includes(guide.kind)) return <SixSubjectGuide guide={guide} />
  if (['agency-scope','investment-metrics','broker-roles','special-registration','registration-tax','housing-project'].includes(guide.kind)) return <NextSixGuide guide={guide} />
  if (['void-effects','elasticity-market','prohibited-conduct','usufruct-registry','acquisition-clock','density-districts'].includes(guide.kind)) return <ThirdSixGuide guide={guide} />
  if (['joint-mortgage','elasticity-calculation','broker-guarantee','provisional-registration','capital-gain-machine','renewal-consent'].includes(guide.kind)) return <FourthSixGuide guide={guide} />
  if (['mortgage-scope','ratio-workbench','explanation-matrix','registration-applicants','tax-relief-clock','plan-authority'].includes(guide.kind)) return <FifthSixGuide guide={guide} />
  if (['risk-allocation','equilibrium-solver','agency-contracts','application-packets','property-tax-sort','facility-expiry'].includes(guide.kind)) return <SixthSixGuide guide={guide} />
  if (['sub-agency','amortization-ledger','foreigner-report','lot-system','tax-liability-time','development-zone'].includes(guide.kind)) return <SeventhSixGuide guide={guide} />
  if (guide.kind === 'rule-workbench') return <RuleWorkbenchGuide guide={guide} />
  if (['sale-fruits-timeline','tax-incidence-scale','office-relocation-route','survey-control-tower','expense-filter','maintenance-plan-clock'].includes(guide.kind)) return <EighthSixGuide guide={guide} />
  if (['warranty-remedy-selector','stp-funnel','auction-agency-boundary','mortgage-registry-anatomy','capital-special-router','building-permit-switchboard'].includes(guide.kind)) return <NinthSixGuide guide={guide} />
  if (['contract-classification-cube','curve-shift-compass','cancellation-decision-tree','provisional-cancellation-shield','capital-return-calendar','building-report-switch'].includes(guide.kind)) return <TenthSixGuide guide={guide} />
  if (['unilateral-arrival-gate','cap-rate-balance','broker-role-badges','area-rounding-ruler','capital-rate-timeline','use-group-elevator'].includes(guide.kind)) return <EleventhSixGuide guide={guide} />
  if (['passage-route-map','equilibrium-four-board','disqualification-locks','survey-appeal-stairs','trust-tax-handoff','building-agreement-consensus'].includes(guide.kind)) return <TwelfthSixGuide guide={guide} />
  if (['apparent-agency-three-doors','repayment-profile-race','explanation-duty-checkpoint','cadastral-notice-two-clocks','acquisition-rate-shelves','metropolitan-authority-router'].includes(guide.kind)) return <ThirteenthSixGuide guide={guide} />
  if (['rescission-signal-console','cost-approach-restoration-lab','brokerage-fee-routing-calculator','boundary-cross-section-atlas','registration-tax-rights-ledger','use-district-family-tree'].includes(guide.kind)) return <FourteenthSixGuide guide={guide} />
  if (['earnest-money-exit-gate','official-price-twin-process','reward-claim-funnel','integrated-register-dashboard','fair-market-ratio-mixer','floor-area-ratio-skyline'].includes(guide.kind)) return <FifteenthSixGuide guide={guide} />
  if (['repurchase-boomerang-timeline','cobweb-stability-spirals','transaction-form-blueprint','survey-necessity-detector','tax-appeal-route-map','facility-project-control-panel'].includes(guide.kind)) return <SixteenthSixGuide guide={guide} />
  if (['reservation-option-console','retail-gravity-balance','transaction-sanction-scale','cadastral-committee-table','acquisition-price-basket','density-charge-twin-board'].includes(guide.kind)) return <SeventeenthSixGuide guide={guide} />
  if (['exchange-contract-scales','huff-probability-lab','lease-report-threshold-gate','survey-request-switchboard','acquisition-clock-dial','infrastructure-demand-meter'].includes(guide.kind)) return <EighteenthSixGuide guide={guide} />
  if (['lease-expense-triage','location-quotient-calculator','foreigner-acquisition-calendar','registration-rejection-filter','deemed-acquisition-xray','utility-tunnel-cross-section'].includes(guide.kind)) return <NineteenthSixGuide guide={guide} />
  if (['sublease-consent-router','weber-location-compass','land-use-enforcement-clock','registrar-objection-conveyor','building-component-xray','facility-plan-passport'].includes(guide.kind)) return <TwentiethSixGuide guide={guide} />
  if (['unfairness-balance-lab','dcf-discount-workbench','lease-rights-timeline','trust-registry-layers','property-tax-exemption-filter','renewal-project-selector'].includes(guide.kind)) return <TwentyFirstSixGuide guide={guide} />
  if (['mortgage-tether-map','loan-limit-dual-gauge','auction-agent-license-desk','subregistration-priority-stack','land-tax-bracket-elevator','urban-basic-plan-control-room'].includes(guide.kind)) return <TwentySecondSixGuide guide={guide} />
  if (['mutual-rescission-mixer','appraisal-method-matching-wall','corporate-broker-blueprint','cadastral-restoration-lab','acquisition-time-switchyard','resident-proposal-consent-gate'].includes(guide.kind)) return <TwentyThirdSixGuide guide={guide} />
  if (['rescission-thirdparty-airlock','direct-capitalization-waterfall','broker-signboard-compliance','coownership-registry-ledger','property-taxpayer-detective','development-permit-command-center'].includes(guide.kind)) return <TwentyFourthSixGuide guide={guide} />
  if (['lease-deposit-counterweight','sales-comparison-adjustment-console','exclusive-brokerage-calendar','development-land-movement-dock','tax-priority-race','zoning-three-layer-atlas'].includes(guide.kind)) return <TwentyFifthSixGuide guide={guide} />
  if (['attachment-independence-lab','business-cycle-waveboard','land-permit-validity-airlock','boundary-point-fieldbook','nonfiling-penalty-meter','building-compliance-switchboard'].includes(guide.kind)) return <TwentySixthSixGuide guide={guide} />
  if (['mortgage-value-transformer','housing-finance-three-gauges','three-party-title-trust-chain','cadastral-survey-dual-clock','tax-liability-extinction-vault','housing-administration-casefiles'].includes(guide.kind)) return <TwentySeventhSixGuide guide={guide} />
  if (['transfer-security-two-layer-ledger','real-estate-policy-timeline','housing-lease-protection-envelope','repurchase-registration-form','coowner-property-tax-splitter','farmland-entrustment-gate'].includes(guide.kind)) return <TwentyEighthSixGuide guide={guide} />
  if (['land-lessee-protection-ladder','public-rental-housing-portfolio','commercial-renewal-control-panel','cadastral-category-constellation','june-first-tax-snapshot','urban-association-consent-blueprint'].includes(guide.kind)) return <TwentyNinthSixGuide guide={guide} />
  if (['non-genuine-intent-three-minds','mbs-risk-routing-board','commercial-deposit-threshold-xray','building-registry-two-desk','property-tax-payment-in-kind-checkpoint','maintenance-zone-procedure-rail'].includes(guide.kind)) return <ThirtiethSixGuide guide={guide} />
  if (['prescription-two-engine','auction-rights-lifeboat','broker-license-security-card','coverage-ratio-sky-map','emigration-tax-countdown','farmland-certificate-gate'].includes(guide.kind)) return <ThirtyFirstSixGuide guide={guide} />
  if (['pfi-ownership-timeline','house-price-three-offices','auction-bid-control-room','disposition-plan-change-gate','building-area-layer-cake','regulated-area-twin-radar'].includes(guide.kind)) return <ThirtySecondSixGuide guide={guide} />
  if (['standard-price-adjustment-lab','maintenance-implementer-handoff','predecision-permit-bundle','remodeling-expansion-dashboard','special-housing-three-models','agency-form-overlay'].includes(guide.kind)) return <ThirtyThirdSixGuide guide={guide} />
  if (['possessor-recoverer-ledger','lien-connexity-filter','holding-period-rate-track','market-efficiency-radius','leverage-amplifier','prohibition-scope-penalty-grid'].includes(guide.kind)) return <ThirtyFourthSixGuide guide={guide} />
  if (['lease-protection-scope-gate','commercial-lease-priority-ladder','comprehensive-tax-threshold-dial','rental-income-exclusion-filter','use-zone-four-tier-map','district-unit-plan-rule-board'].includes(guide.kind)) return <ThirtyFifthSixGuide guide={guide} />
  if (['misrepresentation-classifier','real-right-source-gate','title-trust-auction-shield','joint-ownership-tax-election','transfer-exclusion-filter','urban-innovation-override-list'].includes(guide.kind)) return <ThirtySixthSixGuide guide={guide} />
  if (['superficies-independence-badge','easement-accessory-chain','chonsegwon-dual-nature','floating-invalidity-timeline','ratification-demand-clock','tax-base-date-anchor'].includes(guide.kind)) return <ThirtySeventhSixGuide guide={guide} />
  if (['real-right-claim-scope-fence','registration-requirement-split','offer-invitation-gate','third-party-benefit-limits','reconstruction-vote-threshold','liquidation-sequence-clock'].includes(guide.kind)) return <ThirtyEighthSixGuide guide={guide} />
  if (['arrival-principle-shield','condition-outcome-matrix','fine-authority-router','penalty-tier-scale','jurisdiction-location-rule','escrow-agent-eligibility-gate'].includes(guide.kind)) return <ThirtyNinthSixGuide guide={guide} />
  if (['income-tax-base-split','acquisition-cost-exclusion-line','farmland-substance-test','unregistered-transfer-penalty-gate','overseas-filing-parity','overseas-liability-scope-fence'].includes(guide.kind)) return <FortiethSixGuide guide={guide} />
  if (['complex-concept-lens','housing-type-threshold-board','flow-stock-classifier','central-place-range-scale','market-efficiency-tier-recap','intervention-direct-indirect-sort'].includes(guide.kind)) return <FortyFirstSixGuide guide={guide} />
  if (['ratio-formula-panel','risk-diversification-dial','reverse-mortgage-eligibility-board','reits-type-capital-board','management-tradeoff-scale','percentage-lease-calc-steps'].includes(guide.kind)) return <FortySecondSixGuide guide={guide} />
  if (['committee-chair-scope-board','brokerage-subject-scope-gate','education-type-timing-board','seal-registration-rule-board','one-office-principle-map','concurrent-business-allow-deny-list'].includes(guide.kind)) return <FortyThirdSixGuide guide={guide} />
  if (['license-revocation-flow-board','suspension-vs-revocation-scale','closure-period-succession-gate','mutual-aid-supervision-chain','fee-obligation-filter','document-retention-exemption-rule'].includes(guide.kind)) return <FortyFourthSixGuide guide={guide} />
  if (['externality-policy-rationale','sale-price-formula-board','tax-classification-grid','coefficient-purpose-matcher','cash-flow-waterfall','expected-return-formula-panel'].includes(guide.kind)) return <FortyFifthSixGuide guide={guide} />
  if (['customary-superficies-requirements','minority-co-owner-remedy-fence','seller-knowledge-outcome-fork','real-name-act-exception-penalty-board','permit-zone-effective-timeline','permit-exemption-case-list'].includes(guide.kind)) return <FortySixthSixGuide guide={guide} />
  if (['grave-right-timeline-fork','cadastral-ledger-split','common-area-defect-presumption','grave-area-limit-dial','renewal-notice-registration-gate','contract-document-checklist'].includes(guide.kind)) return <FortySeventhSixGuide guide={guide} />
  if (['brokerage-subject-matter-case-filter','office-posting-checklist','posting-obligation-include-exclude','branch-registration-form-fields','info-network-designation-flow','market-disturbance-report-flow'].includes(guide.kind)) return <FortyEighthSixGuide guide={guide} />
  if (['ksic-industry-branch-map','equilibrium-calc-steps','elasticity-revenue-scale','regulation-type-sorter','info-value-formula-panel','securitization-structure-board'].includes(guide.kind)) return <FortyNinthSixGuide guide={guide} />
  if (['association-report-obligation-flow','reward-eligibility-filter','network-revocation-grounds-board','report-target-contract-filter','fund-plan-threshold-gate','use-violation-remedy-exception-board'].includes(guide.kind)) return <FiftiethSixGuide guide={guide} />
  if (['mbs-duration-price-scale','pf-nonrecourse-trust-board','financing-type-sorter','wofford-risk-triad','redevelopment-type-matrix','land-acquisition-method-scale'].includes(guide.kind)) return <FiftyFirstSixGuide guide={guide} />
  if (['marketing-4p-sorter','appraisal-procedure-flow','regional-individual-principle-board','three-approach-reconciliation-panel','rent-formula-triad','depreciation-reproduction-board'].includes(guide.kind)) return <FiftySecondSixGuide guide={guide} />
  if (['right-acquisition-type-tree','metro-zone-designator-board','metro-plan-content-filter','urban-plan-project-scope-board','survey-exemption-dual-list','opinion-hearing-checklist'].includes(guide.kind)) return <FiftyThirdSixGuide guide={guide} />
  if (['hearing-procedure-mixed-board','committee-structure-board','terminology-swap-filter','residential-apartment-zone-map','settlement-district-building-list','use-district-rule-matrix'].includes(guide.kind)) return <FiftyFourthSixGuide guide={guide} />
  if (['location-regulation-zone-list','growth-area-zone-filter','use-district-definition-card','control-zone-designation-board','coverage-relaxation-calculator','growth-plan-procedure-relaxation-board'].includes(guide.kind)) return <FiftyFifthSixGuide guide={guide} />
  if (['facility-project-authority-board','density-district-detail-board','coverage-relaxation-zone-filter','permit-area-threshold-board','facility-classification-tree','outside-urban-relaxation-board'].includes(guide.kind)) return <FiftySixthSixGuide guide={guide} />
  if (['district-unit-plan-definition-card','location-regulation-special-rules-board','growth-plan-content-board','district-unit-zone-eligibility-board','plan-decision-expiry-timeline','special-zone-deemed-filter'].includes(guide.kind)) return <FiftySeventhSixGuide guide={guide} />
  if (['joint-committee-scope-board','permit-criteria-filter','facility-vesting-matrix','facility-charge-numbers-board','scale-exemption-list','zone-release-timeline'].includes(guide.kind)) return <FiftyEighthSixGuide guide={guide} />
  if (['implementer-change-board','implementation-method-flow','expropriation-method-board','original-land-supply-board','implementation-plan-approval-board','completion-inspection-board'].includes(guide.kind)) return <FiftyNinthSixGuide guide={guide} />
  if (['plan-change-consent-filter','agency-delegation-scope-board','cost-sharing-rules-board','permission-acts-filter','substitution-bond-board','association-officer-representative-board'].includes(guide.kind)) return <SixtiethSixGuide guide={guide} />
  if (['membership-voting-board','delegated-agent-scope-filter','replot-type-comparison','burden-rate-formula-calculator','joint-agreement-clause-filter','disposition-timeline-board'].includes(guide.kind)) return <SixtyFirstSixGuide guide={guide} />
  if (['concurrent-project-implementer-filter','minor-change-numbers-board','proportion-rate-calculator','liquidation-money-rules-board','consent-counting-rules-board','scheduled-land-effects-board'].includes(guide.kind)) return <SixtySecondSixGuide guide={guide} />
  if (['bond-redemption-board','facility-exception-filter','safety-diagnosis-board','completion-procedure-timeline','subscription-notice-board','liquidation-cost-rules-board'].includes(guide.kind)) return <SixtyThirdSixGuide guide={guide} />
  if (['small-housing-supply-board','lh-implementation-regulation-board','land-lease-housing-numbers-board','officer-qualification-board','representative-delegation-scope-board','preparation-committee-notice-filter'].includes(guide.kind)) return <SixtyFourthSixGuide guide={guide} />
  if (['resident-assembly-composition-board','implementation-method-validity-filter','common-utility-cost-board','rental-housing-acquisition-board','announcement-content-filter','compensation-target-filter'].includes(guide.kind)) return <SixtyFifthSixGuide guide={guide} />
  if (['temporary-housing-obligation-filter','landscaping-exemption-filter','building-terminology-board','building-act-exclusion-filter','multi-use-building-criteria-board','special-structure-criteria-board'].includes(guide.kind)) return <SixtySixthSixGuide guide={guide} />
  if (['structural-safety-submission-board','primary-structural-filter','evacuation-zone-numbers-board','structure-report-threshold-board','floating-relaxation-filter','register-maintenance-triggers-board'].includes(guide.kind)) return <SixtySeventhSixGuide guide={guide} />
  if (['evacuation-passage-width-board','neighborhood-facility-classification-board','narrow-road-building-line-board','major-renovation-threshold-board','interior-finish-blank-fill-board','combined-building-scope-board'].includes(guide.kind)) return <SixtyEighthSixGuide guide={guide} />
  if (['special-zone-exemption-filter','dispute-committee-party-filter','safety-evaluation-process-board','public-open-space-rules-board','exit-seismic-threshold-board','street-height-factors-board'].includes(guide.kind)) return <SixtyNinthSixGuide guide={guide} />
  if (['housing-bond-issuer-board','business-registration-exemption-filter','resale-restriction-consent-board','housing-supply-rules-board','post-inspection-sale-claim-board','bond-issuance-limits-board'].includes(guide.kind)) return <SeventiethSixGuide guide={guide} />
  if (['remodeling-approval-board','supervisor-duty-timeline-board','purchase-price-formula-board','penalty-vs-fine-filter','use-inspection-applicant-board','pre-move-in-timeline-board'].includes(guide.kind)) return <SeventyFirstSixGuide guide={guide} />
  if (['subscription-savings-notice-board','quality-panel-numbers-board','farmer-recognition-or-board','farmland-lease-term-board','acquisition-certificate-exemption-filter','non-cultivation-ownership-filter'].includes(guide.kind)) return <SeventySecondSixGuide guide={guide} />
  if (['promotion-area-exclusion-filter','proxy-cultivator-rules-board','farmland-register-numbers-board','conversion-exemption-filter','temp-use-report-filter','fill-report-exemption-board'].includes(guide.kind)) return <SeventyThirdSixGuide guide={guide} />
  return (
    <article className="cx-card cx-visual-card">
      <SectionBlock label="한눈에 구조화" index={5}>
        <p className="cx-visual-lede">{guide.summary}</p>

        <div className="cx-tree" aria-label="권리취득 유형 분류도">
          <div className="cx-tree__root">권리의 취득</div>
          <div className="cx-tree__line" aria-hidden />
          <div className="cx-tree__branches">
            {guide.branches.map((branch, index) => (
              <div key={branch.type} className={`cx-branch cx-branch--${branch.tone}`} style={{ '--cx-delay': `${index * 90}ms` }}>
                <span className="cx-branch__cue">{branch.cue}</span>
                <strong>{branch.type}</strong>
                <p>{branch.description}</p>
                <div className="cx-branch__examples">
                  {branch.examples.map((example) => <span key={example}>{example}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="cx-study-grid">
          <div className="cx-decision">
            <h4><span aria-hidden>✓</span> 10초 판별법</h4>
            <ol>
              {guide.decision.map(([number, question, answer]) => (
                <li key={number}>
                  <span className="cx-decision__num">{number}</span>
                  <span><strong>{question}</strong><small>{answer}</small></span>
                </li>
              ))}
            </ol>
          </div>

          <figure className="cx-rights-demo">
            <figcaption>저당권 설정을 그림으로 보면</figcaption>
            <div className="cx-rights-demo__land">
              <span className="cx-rights-demo__owner">{guide.scenario.owner}</span>
              <span className="cx-rights-demo__right">{guide.scenario.right}</span>
            </div>
            <p>{guide.scenario.caption}</p>
          </figure>
        </div>

        <aside className="cx-caution"><strong>시험 함정</strong><span>{guide.caution}</span></aside>

        <div className="cx-sources">
          <span className="cx-sources__title">법령 근거</span>
          {guide.sources.map((source) => (
            <a key={source.label} href={source.href} target="_blank" rel="noreferrer">
              <strong>{source.label}</strong><span>{source.note}</span><i aria-hidden>↗</i>
            </a>
          ))}
        </div>
      </SectionBlock>
    </article>
  )
}

function TwentiethSixGuide({ guide }) {
  let label = '개념 전용 판정 도구'
  let body
  if (guide.kind === 'sublease-consent-router') {
    label = '전대차 동의 라우터'
    body = <><div className="cx-sublease-routes">{guide.routes.map(x=><section key={x.consent}><strong>{x.consent}</strong><span>{x.tenant}</span><b>{x.landlord}</b><small>{x.end}</small></section>)}</div><aside className="cx-case-note">{guide.smallPart}</aside><div className="cx-payment-line">{guide.payment.map(x=><span key={x}>{x}</span>)}</div></>
  } else if (guide.kind === 'weber-location-compass') {
    label = '베버 최소비용 입지 나침반'
    body = <><div className="cx-weber-triangle">{guide.triangle.map(x=><section key={x.point} style={{'--weight':x.weight}}><strong>{x.point}</strong><b>{x.weight}t</b></section>)}<i>최소운송비점</i></div><div className="cx-material-index">{guide.material.map(x=><section key={x.index}><strong>{x.index}</strong><b>{x.direction}</b><span>{x.reason}</span></section>)}</div><div className="cx-isodapane-line">{guide.isodapane.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div></>
  } else if (guide.kind === 'land-use-enforcement-clock') {
    label = '토지 이용의무 이행강제금 시계'
    body = <><div className="cx-enforcement-clock">{guide.clock.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div><div className="cx-enforcement-rates">{guide.rates.map(x=><section key={x.violation}><strong>{x.violation}</strong><b>{x.rate}%</b></section>)}</div><div className="cx-stop-rules">{guide.stop.map(x=><span key={x}>⏹ {x}</span>)}</div></>
  } else if (guide.kind === 'registrar-objection-conveyor') {
    label = '등기관 처분 이의 컨베이어'
    body = <><div className="cx-objection-conveyor">{guide.conveyor.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div><div className="cx-objection-blocks">{guide.blocks.map(x=><section key={x.claim}><strong>{x.claim}</strong><b>{x.result}</b></section>)}</div><aside className="cx-case-note">{guide.afterOrder}</aside></>
  } else if (guide.kind === 'building-component-xray') {
    label = '건축물 부대설비 X-ray'
    body = <><div className="cx-building-layers">{guide.layers.map(x=><section key={x.layer}><strong>{x.layer}</strong><span>{x.examples}</span><b>{x.owner}</b></section>)}</div><div className="cx-component-tests">{guide.tests.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div><aside className="cx-case-note">{guide.case}</aside></>
  } else {
    label = '기반시설 계획결정 여권심사'
    body = <><div className="cx-plan-passports">{guide.passports.map(x=><section className={x.pass.includes('가능')?'is-pass':'is-check'} key={x.facility}><strong>{x.facility}</strong><b>{x.pass}</b></section>)}</div><div className="cx-principle-line">{guide.principle.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div></>
  }
  return <article className="cx-card cx-visual-card"><SectionBlock label={label} index={5}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function TwentyFirstSixGuide({ guide }) {
  let label = '개념 전용 판정 연구실'
  let body
  if (guide.kind === 'unfairness-balance-lab') {
    label = '불공정 법률행위 3중 저울'
    body = <><div className="cx-unfair-gates">{guide.gates.map((x,i)=><section key={x.label}><b>{i+1}</b><strong>{x.label}</strong><span>{x.test}</span><small>{x.pass}</small></section>)}</div><div className="cx-agency-standards">{guide.agency.map(x=><section key={x.factor}><strong>{x.factor}</strong><i>판단</i><b>{x.standard}</b></section>)}</div><div className="cx-exclusion-stamps">{guide.exclusions.map(x=><span key={x}>적용 제외 · {x}</span>)}</div><aside className="cx-case-note">{guide.case}</aside></>
  } else if (guide.kind === 'dcf-discount-workbench') {
    label = 'DCF 현금흐름 할인 작업대'
    body = <><div className="cx-dcf-head"><span>할인율 <b>{guide.rate}%</b></span><span>초기투자 <b>{guide.investment}</b></span></div><div className="cx-dcf-table">{guide.cashflows.map((x,i)=><section key={`${x.year}-${i}`}><strong>{x.year}년차{x.tag&&<small>{x.tag}</small>}</strong><span>{x.cash}</span><i>× {x.factor}</i><b>{x.pv}</b></section>)}</div><div className="cx-dcf-results">{guide.results.map(x=><section key={x.metric}><strong>{x.metric}</strong><b>{x.value}</b></section>)}</div><div className="cx-formula-strip">{guide.formulas.map(x=><code key={x}>{x}</code>)}</div><aside className="cx-case-note">{guide.decision}</aside></>
  } else if (guide.kind === 'lease-rights-timeline') {
    label = '임차인 권리 획득 타임라인'
    body = <><div className="cx-lease-tracks">{guide.tracks.map(x=><section key={x.right}><strong>{x.right}</strong><div>{x.ingredients.map(v=><span key={v}>{v}</span>)}</div><b>{x.time}</b><small>{x.power}</small></section>)}</div><div className="cx-lease-race">{guide.race.map((x,i)=><section key={x.time}><b>{i+1}</b><strong>{x.time}</strong><span>{x.event}</span></section>)}</div><div className="cx-caution-list">{guide.cautions.map(x=><span key={x}>! {x}</span>)}</div></>
  } else if (guide.kind === 'trust-registry-layers') {
    label = '신탁등기 3층 기록부'
    body = <><div className="cx-trust-layers">{guide.layers.map((x,i)=><section key={x.layer}><b>{3-i}F</b><strong>{x.layer}</strong><span>{x.record}</span></section>)}</div><div className="cx-trust-routes">{guide.routes.map(x=><section key={x.event}><strong>{x.event}</strong><span>{x.applicant}</span><b>{x.pair}</b></section>)}</div><aside className="cx-case-note">{guide.coTrustees}</aside></>
  } else if (guide.kind === 'property-tax-exemption-filter') {
    label = '재산세 비과세 필터'
    body = <><div className="cx-tax-date">{guide.date}</div><div className="cx-tax-filters">{guide.filters.map(x=><section className={x.verdict==='과세'?'is-taxed':''} key={x.item}><strong>{x.item}</strong><span>{x.condition}</span><b>{x.verdict}</b></section>)}</div><div className="cx-tax-examples">{guide.examples.map(x=><section key={x.case}><strong>{x.case}</strong><b>{x.result}</b></section>)}</div></>
  } else {
    label = '정비사업 선택 지도'
    body = <><div className="cx-renewal-grid">{guide.projects.map(x=><section key={x.name}><strong>{x.name}</strong><span>기반시설 · {x.infra}</span><b>{x.stock}</b><small>{x.method}</small></section>)}</div><div className="cx-housing-counts">{guide.housingCounts.map(x=><section key={x.composition}><strong>{x.composition}</strong><b>{x.threshold}</b></section>)}</div><div className="cx-route-steps">{guide.route.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div><aside className="cx-case-note">{guide.case}</aside></>
  }
  return <article className="cx-card cx-visual-card"><SectionBlock label={label} index={5}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function TwentySecondSixGuide({ guide }) {
  let label = '개념 전용 실전 제어판'
  let body
  if (guide.kind === 'mortgage-tether-map') {
    label = '저당권 부종성 연결 지도'
    body = <><div className="cx-mortgage-tether">{guide.tether.map((x,i)=><section key={x.asset}><strong>{x.asset}</strong><span>{x.role}</span>{i===0&&<i>연결</i>}</section>)}</div><div className="cx-mortgage-rules">{guide.rules.map(x=><section key={x.change}><strong>{x.change}</strong><b>{x.mortgage}</b></section>)}</div><div className="cx-thirdparty-tools">{guide.thirdParty.map(x=><section key={x.tool}><strong>{x.tool}</strong><small>{x.article}</small></section>)}</div><aside className="cx-case-note">{guide.case}</aside></>
  } else if (guide.kind === 'loan-limit-dual-gauge') {
    label = 'LTV·DCR 이중 대출한도 게이지'
    body = <><div className="cx-loan-inputs">{guide.inputs.map(x=><section key={x.label}><span>{x.label}</span><b>{x.value}</b></section>)}</div><div className="cx-loan-gauges">{guide.gauges.map(x=><section key={x.standard}><strong>{x.standard}</strong><div><i style={{width:`${x.ratio}%`}}/></div><span>{x.formula}</span><b>{x.limit}</b></section>)}</div><div className="cx-dcr-steps">{guide.dcrSteps.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div><aside className="cx-case-note">{guide.caution}</aside></>
  } else if (guide.kind === 'auction-agent-license-desk') {
    label = '매수신청대리 등록 창구'
    body = <><div className="cx-agent-applicants">{guide.applicants.map(x=><section className={x.result.includes('불가')?'is-denied':''} key={x.actor}><strong>{x.actor}</strong><b>{x.result}</b></section>)}</div><div className="cx-agent-checklist">{guide.checklist.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div><div className="cx-agent-scope">{guide.scope.map(x=><section key={x.task}><strong>{x.task}</strong><b>{x.court}</b></section>)}</div><aside className="cx-case-note">{guide.restart}</aside></>
  } else if (guide.kind === 'subregistration-priority-stack') {
    label = '부기등기 순위 스택'
    body = <><div className="cx-registration-stack">{guide.stack.map(x=><section className={x.number.includes('-')?'is-sub':''} key={x.number}><b>{x.number}</b><strong>{x.label}</strong><span>{x.priority}</span></section>)}</div><div className="cx-subreg-types">{guide.types.map(x=><section key={x.event}><strong>{x.event}</strong><b>{x.form}</b></section>)}</div><div className="cx-consent-route">{guide.consent.map(x=><section key={x.situation}><strong>{x.situation}</strong><b>{x.result}</b></section>)}</div></>
  } else if (guide.kind === 'land-tax-bracket-elevator') {
    label = '종합합산 토지세율 엘리베이터'
    body = <><div className="cx-tax-elevator">{guide.brackets.slice().reverse().map(x=><section key={x.floor}><strong>{x.floor}</strong><span>{x.range}</span><b>{x.rate}</b><small>{x.base}</small></section>)}</div><div className="cx-tax-layer-example"><strong>{guide.example.standard}</strong>{guide.example.layers.map(x=><span key={x}>{x}</span>)}<b>{guide.example.total}</b></div><div className="cx-landtax-compare">{guide.compare.map(x=><section key={x.class}><strong>{x.class}</strong><b>{x.top}</b><small>{x.note}</small></section>)}</div></>
  } else {
    label = '도시·군기본계획 통제실'
    body = <><div className="cx-plan-routes">{guide.routes.map(x=><section key={x.maker}><strong>{x.maker}</strong><div>{x.stages.map((v,i)=><span key={v}><b>{i+1}</b>{v}</span>)}</div></section>)}</div><div className="cx-plan-clocks">{guide.clocks.map(x=><section key={`${x.number}-${x.task}`}><strong>{x.number}</strong><span>{x.task}</span></section>)}</div><div className="cx-plan-hierarchy">{guide.hierarchy.map((x,i)=><span key={x} style={{'--level':i}}>{x}</span>)}</div><aside className="cx-case-note">{guide.caution}</aside></>
  }
  return <article className="cx-card cx-visual-card"><SectionBlock label={label} index={5}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function TwentyThirdSixGuide({ guide }) {
  let label = '개념 전용 실전 분석실'
  let body
  if (guide.kind === 'mutual-rescission-mixer') {
    label = '합의해제 효과 믹서'
    body = <><div className="cx-rescission-compare"><header><b>쟁점</b><strong>법정해제</strong><strong>합의해제</strong></header>{guide.compare.map(x=><section key={x.item}><b>{x.item}</b><span>{x.statutory}</span><span>{x.mutual}</span></section>)}</div><div className="cx-mutual-signals">{guide.signals.map(x=><span key={x}>✓ {x}</span>)}</div><div className="cx-ownership-return">{guide.ownership.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div><aside className="cx-case-note">{guide.case}</aside></>
  } else if (guide.kind === 'appraisal-method-matching-wall') {
    label = '물건별 감정평가 매칭 벽'
    body = <><div className="cx-appraisal-wall">{guide.methods.map(x=><section className={`is-${x.tone}`} key={x.method}><strong>{x.method}</strong><span>{x.cue}</span><div>{x.assets.map(v=><b key={v}>{v}</b>)}</div></section>)}</div><div className="cx-appraisal-traps">{guide.traps.map(x=><section key={x.pair}><strong>{x.pair}</strong><b>{x.answer}</b></section>)}</div><aside className="cx-case-note">{guide.fallback}</aside></>
  } else if (guide.kind === 'corporate-broker-blueprint') {
    label = '법인 중개사무소 등록 설계도'
    body = <><div className="cx-corp-blueprint">{guide.blueprint.map((x,i)=><section key={x.zone}><b>{String(i+1).padStart(2,'0')}</b><strong>{x.zone}</strong><span>{x.rule}</span></section>)}</div><div className="cx-officer-calculator"><span>대표자 제외 임원·사원 <b>{guide.calculator.officers}명</b></span><i>× 1/3</i><strong>{guide.calculator.required}명 이상 공인중개사</strong><small>대표자는 {guide.calculator.representative}</small></div><div className="cx-corp-education">{guide.education.map(x=><section key={x.person}><strong>{x.person}</strong><b>{x.status}</b></section>)}</div><aside className="cx-case-note">{guide.trap}</aside></>
  } else if (guide.kind === 'cadastral-restoration-lab') {
    label = '지적공부 복구 증거 실험실'
    body = <><div className="cx-restoration-evidence">{guide.evidence.map(x=><section className={!x.accepted?'is-rejected':''} key={x.document}><strong>{x.document}</strong><span>{x.use}</span><b>{x.accepted?'복구자료':'제외'}</b></section>)}</div><div className="cx-restoration-process">{guide.procedure.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div><div className="cx-restoration-split">{guide.split.map(x=><section key={x.target}><strong>{x.target}</strong><b>{x.source}</b></section>)}</div><aside className="cx-case-note">{guide.case}</aside></>
  } else if (guide.kind === 'acquisition-time-switchyard') {
    label = '양도세 취득시기 선로 전환기'
    body = <><div className="cx-time-switches">{guide.switches.map(x=><section key={x.event}><strong>{x.event}</strong><b>{x.first}</b><span>{x.fallback}</span></section>)}</div><div className="cx-tax-timeline">{guide.timeline.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div><div className="cx-replot-exchange"><section><strong>{guide.exchange.old}</strong><b>{guide.exchange.time}</b></section><section><strong>{guide.exchange.delta}</strong><b>{guide.exchange.deltaTime}</b></section></div><aside className="cx-case-note">{guide.caution}</aside></>
  } else {
    label = '주민 입안제안 동의 게이트'
    body = <><div className="cx-proposal-gates">{guide.gates.map(x=><section key={x.clause}><b>{x.clause}</b><strong>{x.proposal}</strong><span>{x.consent}</span></section>)}</div><div className="cx-proposal-excluded">{guide.excluded.map(x=><span key={x}>× {x}</span>)}</div><div className="cx-consent-math"><span>{guide.calculation.whole}</span><i>− {guide.calculation.public}</i><strong>{guide.calculation.denominator}</strong><b>4/5 → {guide.calculation.fourFifths}</b><b>2/3 → {guide.calculation.twoThirds}</b></div><div className="cx-proposal-process">{guide.process.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div></>
  }
  return <article className="cx-card cx-visual-card"><SectionBlock label={label} index={5}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function TwentyFourthSixGuide({ guide }) {
  let label = '개념 전용 실전 판정실'
  let body
  if (guide.kind === 'rescission-thirdparty-airlock') {
    label = '해제 제3자 보호 에어록'
    body = <><div className="cx-rescission-airlocks">{guide.airlocks.map(x=><section key={x.timing}><strong>{x.timing}</strong><span>{x.relation}</span><b>{x.requirement}</b><small>{x.goodFaith}</small><i>{x.result}</i></section>)}</div><div className="cx-restitution-pairs">{guide.restitution.map(x=><section key={x.duty}><strong>{x.duty}</strong><b>{x.pair}</b></section>)}</div><div className="cx-rights-chain">{guide.chain.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div><aside className="cx-case-note">{guide.case}</aside></>
  } else if (guide.kind === 'direct-capitalization-waterfall') {
    label = '직접환원 NOI 폭포 계산기'
    body = <><div className="cx-noi-waterfall">{guide.waterfall.map((x,i)=><section key={x.stage} style={{'--drop':i}}><span>{x.sign}</span><strong>{x.stage}</strong><b>{x.amount.toLocaleString()}만원</b></section>)}</div><div className="cx-expense-buckets">{guide.include.map(x=><section className={x.bucket==='제외'?'is-out':''} key={x.item}><strong>{x.item}</strong><b>{x.bucket}</b></section>)}</div><div className="cx-cap-calculator"><span>NOI {guide.calculator.noi}</span><i>÷ {guide.calculator.capRate}</i><strong>{guide.calculator.value}</strong><small>{guide.calculator.inverse}</small></div><div className="cx-cap-sensitivity">{guide.sensitivity.map(x=><section key={x.rate}><strong>{x.rate}</strong><b>{x.value}</b></section>)}</div></>
  } else if (guide.kind === 'broker-signboard-compliance') {
    label = '중개사무소 간판 준법 점검'
    body = <><div className="cx-signboards">{guide.signboards.map(x=><section key={x.office}><strong>{x.office}</strong><b>{x.required}</b><span>{x.name}</span></section>)}</div><div className="cx-sign-removal">{guide.removal.map(x=><section className={x.action.includes('없음')?'is-stay':''} key={x.event}><strong>{x.event}</strong><b>{x.action}</b></section>)}</div><div className="cx-enforcement-arrow">{guide.enforcement.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div><aside className="cx-case-note">{guide.trap}</aside></>
  } else if (guide.kind === 'coownership-registry-ledger') {
    label = '공유·합유 등기부 비교'
    body = <><div className="cx-coownership-ledgers">{guide.ledgers.map(x=><section key={x.type}><strong>{x.type}</strong><div>{x.record.map(v=><span key={v}>{v}</span>)}</div><b>{x.disposal}</b></section>)}</div><div className="cx-preservation-sheet"><strong>{guide.preservation.property}</strong><div>{guide.preservation.owners.map(x=><span key={x}>{x}</span>)}</div><b>{guide.preservation.applicant}</b><i>{guide.preservation.result}</i></div><div className="cx-coowner-attachments">{guide.attachments.map(x=><section key={x.case}><strong>{x.case}</strong><b>{x.document}</b></section>)}</div></>
  } else if (guide.kind === 'property-taxpayer-detective') {
    label = '재산세 납세의무자 탐정판'
    body = <><div className="cx-taxpayer-cases">{guide.cases.map(x=><section key={x.clue}><strong>{x.clue}</strong><b>{x.taxpayer}</b></section>)}</div><div className="cx-taxpayer-primary">{guide.primary.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div><div className="cx-heir-card"><strong>{guide.heir.order}</strong><span>동률이면 {guide.heir.tie}</span><b>{guide.heir.report}</b></div><aside className="cx-case-note">{guide.trap}</aside></>
  } else {
    label = '개발행위허가 지휘통제실'
    body = <><div className="cx-development-radar">{guide.radar.map(x=><section key={x.action}><strong>{x.action}</strong><b>{x.permit}</b></section>)}</div><div className="cx-development-bypass">{guide.bypass.map(x=><section key={x.event}><strong>{x.event}</strong><b>{x.route}</b></section>)}</div><div className="cx-restriction-clock">{guide.restriction.map(x=><section key={x.phase}><strong>{x.phase}</strong><b>{x.period}</b><span>{x.review}</span></section>)}</div><div className="cx-development-process">{guide.process.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div></>
  }
  return <article className="cx-card cx-visual-card"><SectionBlock label={label} index={5}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function TwentyFifthSixGuide({ guide }) {
  let label = '개념 전용 실전 분석판'
  let body
  if (guide.kind === 'lease-deposit-counterweight') {
    label = '보증금·인도 동시이행 저울'
    body = <><div className="cx-deposit-balance">{guide.balance.map((x,i)=><section key={x.side}><strong>{x.side}</strong><b>{x.duty}</b><span>{x.effect}</span>{i===0?<i>⇄</i>:null}</section>)}</div><div className="cx-lease-use-states">{guide.states.map(x=><section key={x.act}><strong>{x.act}</strong><b>{x.result}</b><span>{x.money}</span></section>)}</div><div className="cx-rent-change-flow">{guide.rent.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div></>
  } else if (guide.kind === 'sales-comparison-adjustment-console') {
    label = '거래사례비교 보정 콘솔'
    body = <><div className="cx-comparison-formula">{guide.formula.map((x,i)=><span key={x}>{x}{i<guide.formula.length-1?<i>×</i>:null}</span>)}<strong>= {guide.result}</strong></div><div className="cx-factor-console">{guide.factors.map(x=><section key={x.name}><strong>{x.name}</strong><span>{x.question}</span><b>{x.cue}</b></section>)}</div><div className="cx-check-strip">{guide.checks.map(x=><span key={x}>✓ {x}</span>)}</div></>
  } else if (guide.kind === 'exclusive-brokerage-calendar') {
    label = '전속중개계약 다섯 시계'
    body = <><div className="cx-exclusive-timeline">{guide.timeline.map((x,i)=><section key={x.time}><b>{i+1}</b><strong>{x.time}</strong><span>{x.task}</span></section>)}</div><div className="cx-exclusive-clocks">{guide.clocks.map(x=><section key={x.number}><strong>{x.number}</strong><span>{x.label}</span></section>)}</div><div className="cx-privacy-locks">{guide.privacy.map(x=><span key={x}>🔒 {x}</span>)}</div></>
  } else if (guide.kind === 'development-land-movement-dock') {
    label = '개발사업 토지이동 도크'
    body = <><div className="cx-land-dock">{guide.dock.map((x,i)=><section key={x.phase}><b>{i+1}</b><strong>{x.phase}</strong><span>{x.clock}</span><small>{x.record}</small></section>)}</div><div className="cx-land-movement-rules">{guide.rules.map(x=><section key={x.issue}><strong>{x.issue}</strong><b>{x.answer}</b></section>)}</div><div className="cx-substitute-tags">{guide.substitutes.map(x=><span key={x}>{x}</span>)}</div></>
  } else if (guide.kind === 'tax-priority-race') {
    label = '조세채권 우선순위 레이스'
    body = <><div className="cx-tax-priority-gates">{guide.gates.map(x=><section key={x.test}><strong>{x.test}</strong><span>YES · {x.yes}</span><b>NO · {x.no}</b></section>)}</div><div className="cx-tax-podium">{guide.podium.map(x=><section key={x.rank}><b>{x.rank}</b><strong>{x.claim}</strong><span>{x.reason}</span></section>)}</div><div className="cx-priority-warnings">{guide.warnings.map(x=><span key={x}>! {x}</span>)}</div></>
  } else {
    label = '용도지역·지구·구역 3층 지도'
    body = <><div className="cx-zoning-layers">{guide.layers.map((x,i)=><section key={x.layer}><b>{3-i}F</b><strong>{x.layer}</strong><span>{x.role}</span><small>{x.overlap}</small></section>)}</div><div className="cx-zoning-switches">{guide.switches.map(x=><section key={x.event}><strong>{x.event}</strong><b>{x.route}</b></section>)}</div><div className="cx-zoning-locks">{guide.locks.map(x=><span key={x}>🔒 {x}</span>)}</div></>
  }
  return <article className="cx-card cx-visual-card"><SectionBlock label={label} index={5}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function TwentySixthSixGuide({ guide }) {
  let label = '개념 전용 실전 검증실'
  let body
  if (guide.kind === 'attachment-independence-lab') {
    label = '부합 독립성 3관문 실험실'
    body = <><div className="cx-attachment-gates">{guide.gates.map((x,i)=><section key={x.test}><b>{i+1}</b><strong>{x.test}</strong><span>YES · {x.yes}</span><small>NO · {x.no}</small></section>)}</div><div className="cx-attachment-cases">{guide.cases.map(x=><section key={x.fixture}><strong>{x.fixture}</strong><span>{x.title}</span><b>{x.result}</b></section>)}</div><aside className="cx-case-note">{guide.restitution}</aside></>
  } else if (guide.kind === 'business-cycle-waveboard') {
    label = '부동산 경기 4국면 파도판'
    body = <><div className="cx-cycle-wave">{guide.phases.map((x,i)=><section key={x.phase} style={{'--wave':i}}><strong>{x.phase}</strong><span>{x.price}</span><b>{x.volume}</b><small>{x.leader}</small></section>)}</div><div className="cx-cycle-signals">{guide.signals.map(x=><section key={x.signal}><strong>{x.signal}</strong><b>{x.clue}</b></section>)}</div><div className="cx-cycle-cautions">{guide.cautions.map(x=><span key={x}>! {x}</span>)}</div></>
  } else if (guide.kind === 'land-permit-validity-airlock') {
    label = '토지거래허가 효력 에어록'
    body = <><div className="cx-permit-designation">{guide.designation.map((x,i)=><section key={x.event}><b>{x.day}</b><strong>{x.event}</strong>{i<guide.designation.length-1?<i>→</i>:null}</section>)}</div><div className="cx-permit-thresholds">{guide.thresholds.map(x=><section key={x.zone}><strong>{x.zone}</strong><b>{x.area}</b></section>)}</div><div className="cx-permit-states">{guide.states.map(x=><section key={x.state}><strong>{x.state}</strong><b>{x.effect}</b><span>{x.action}</span></section>)}</div></>
  } else if (guide.kind === 'boundary-point-fieldbook') {
    label = '지상경계점 현장 필드북'
    body = <><div className="cx-boundary-sheet">{guide.sheet.map(x=><section key={x.field}><strong>{x.field}</strong><span>{x.value}</span></section>)}</div><div className="cx-boundary-scene">{guide.scene.map(x=><section key={x.point}><b>{x.point}</b><strong>{x.marker}</strong><span>{x.clue}</span></section>)}</div><div className="cx-boundary-excluded">{guide.excluded.map(x=><span key={x}>× {x}</span>)}</div></>
  } else if (guide.kind === 'nonfiling-penalty-meter') {
    label = '무신고가산세 20·40 계기판'
    body = <><div className="cx-penalty-meters">{guide.meters.map(x=><section key={x.type}><strong>{x.type}</strong><div><i style={{width:`${x.rate*2}%`}} /></div><b>{x.rate}%</b><span>{x.basis}</span></section>)}</div><div className="cx-penalty-example"><strong>{guide.example.tax}</strong><span>{guide.example.normal}</span><b>{guide.example.fraud}</b></div><div className="cx-penalty-route">{guide.route.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div><div className="cx-penalty-warnings">{guide.warnings.map(x=><span key={x}>! {x}</span>)}</div></>
  } else {
    label = '건축법 6스위치 준법판'
    body = <><div className="cx-building-switches">{guide.switches.map((x,i)=><section key={x.desk}><b>{i+1}</b><strong>{x.desk}</strong><span>{x.rule}</span></section>)}</div><div className="cx-structure-objects">{guide.objects.map(x=><section key={x.object}><strong>{x.object}</strong><b>{x.threshold}</b></section>)}</div><div className="cx-enforcement-ladder">{guide.ladder.map((x,i)=><span key={x}><b>{guide.ladder.length-i}</b>{x}</span>)}</div></>
  }
  return <article className="cx-card cx-visual-card"><SectionBlock label={label} index={5}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function TwentySeventhSixGuide({ guide }) {
  let label = '개념 전용 실전 기록실'
  let body
  if (guide.kind === 'mortgage-value-transformer') {
    label = '저당가치 물상대위 변환기'
    body = <><div className="cx-value-transform">{guide.transform.map(x=><section key={x.from}><strong>{x.from}</strong><i>→</i><b>{x.to}</b></section>)}</div><div className="cx-subrogation-process">{guide.process.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div><div className="cx-subrogation-races">{guide.races.map(x=><section key={x.event}><strong>{x.event}</strong><b>{x.result}</b></section>)}</div></>
  } else if (guide.kind === 'housing-finance-three-gauges') {
    label = 'LTV·DTI·DSR 3중 계기판'
    body = <><div className="cx-finance-gauges">{guide.gauges.map(x=><section key={x.name}><strong>{x.name}</strong><span>{x.numerator}</span><i>÷</i><span>{x.denominator}</span><b>{x.example}</b></section>)}</div><div className="cx-equity-slide">{guide.equity.map(x=><section key={x.ltv}><strong>{x.ltv}</strong><b>{x.equity}</b></section>)}</div><div className="cx-rate-risk">{guide.risk.map(x=><section key={x.rate}><strong>{x.rate}</strong><b>{x.bearer}</b></section>)}</div></>
  } else if (guide.kind === 'three-party-title-trust-chain') {
    label = '3자간 명의신탁 계약·등기 이중선'
    body = <><div className="cx-title-actors">{guide.actors.map(x=><section key={x.actor}><strong>{x.actor}</strong><span>{x.role}</span></section>)}</div><div className="cx-title-lines">{guide.lines.map(x=><section key={`${x.from}-${x.to}`}><b>{x.from}</b><i>→</i><b>{x.to}</b><strong>{x.line}</strong></section>)}</div><div className="cx-title-remedies">{guide.remedies.map(x=><section key={x.situation}><strong>{x.situation}</strong><b>{x.claim}</b></section>)}</div></>
  } else if (guide.kind === 'cadastral-survey-dual-clock') {
    label = '지적측량 5·4 이중시계'
    body = <><div className="cx-survey-clocks">{guide.clocks.map(x=><section className={`is-${x.color}`} key={x.task}><strong>{x.task}</strong><b>{x.base}일</b></section>)}</div><div className="cx-survey-increments">{guide.increments.map(x=><section key={x.points}><strong>{x.points}</strong><b>{x.add}</b></section>)}</div><div className="cx-survey-agreement"><strong>{guide.agreement.whole}</strong><span>{guide.agreement.survey}</span><b>{guide.agreement.inspect}</b></div><div className="cx-survey-calendar">{guide.calendar.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div></>
  } else if (guide.kind === 'tax-liability-extinction-vault') {
    label = '납세의무 소멸 3문 금고'
    body = <><div className="cx-extinction-doors">{guide.doors.map((x,i)=><section key={x.door}><b>{i+1}</b><strong>{x.door}</strong><span>{x.clock}</span><small>{x.result}</small></section>)}</div><div className="cx-tax-transfers">{guide.transfers.map(x=><section key={x.event}><strong>{x.event}</strong><b>{x.route}</b></section>)}</div><div className="cx-tax-time-compare">{guide.compare.map(x=><section key={x.term}><strong>{x.term}</strong><b>{x.target}</b><span>{x.interruption}</span></section>)}</div></>
  } else {
    label = '주택법 행정 사건파일'
    body = <><div className="cx-housing-casefiles">{guide.files.map(x=><section key={x.file}><b>{x.file}</b><strong>{x.title}</strong><span>{x.trigger}</span><small>{x.effect}</small></section>)}</div><div className="cx-housing-sanctions">{guide.sanctions.map(x=><span key={x}>× {x}</span>)}</div><div className="cx-hearing-list">{guide.hearing.map(x=><span key={x}>청문 · {x}</span>)}</div></>
  }
  return <article className="cx-card cx-visual-card"><SectionBlock label={label} index={5}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function TwentyEighthSixGuide({ guide }) {
  let label = '개념 전용 정밀 판정판'
  let body
  if (guide.kind === 'transfer-security-two-layer-ledger') {
    label = '양도담보 겉·속 이중원장'
    body = <><div className="cx-transfer-layers">{guide.layers.map(x=><section key={x.layer}><small>{x.layer}</small><strong>{x.owner}</strong><b>{x.purpose}</b></section>)}</div><div className="cx-transfer-lease">{guide.lease.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div><div className="cx-transfer-forks">{guide.forks.map(x=><section key={x.event}><strong>{x.event}</strong><b>{x.result}</b></section>)}</div></>
  } else if (guide.kind === 'real-estate-policy-timeline') {
    label = '부동산제도 도입·존폐 연표'
    body = <><div className="cx-policy-timeline">{guide.timeline.map(x=><section className={x.state==='폐지'?'is-off':''} key={`${x.year}-${x.name}`}><b>{x.year}</b><strong>{x.name}</strong><span>{x.state}</span></section>)}</div><div className="cx-policy-status">{guide.status.map(x=><section className={x.state==='폐지'?'is-off':''} key={x.state}><strong>{x.state}</strong><span>{x.items}</span></section>)}</div><aside className="cx-policy-trap">! {guide.trap}</aside></>
  } else if (guide.kind === 'housing-lease-protection-envelope') {
    label = '주택임대차 보호범위·시계'
    body = <><div className="cx-hlpa-scope">{guide.scope.map(x=><section key={x.case}><strong>{x.case}</strong><b>{x.result}</b></section>)}</div><div className="cx-hlpa-clocks">{guide.clocks.map(x=><section key={x.trigger}><strong>{x.trigger}</strong><b>{x.clock}</b><span>{x.option}</span></section>)}</div><div className="cx-hlpa-succession">{guide.succession.map(x=><span key={x}>→ {x}</span>)}</div></>
  } else if (guide.kind === 'repurchase-registration-form') {
    label = '환매특약등기 공식 서식'
    body = <><div className="cx-repurchase-form">{guide.fields.map(x=><section key={x.field}><strong>{x.field}</strong><span>{x.value}</span><b>{x.required}</b></section>)}</div><div className="cx-repurchase-rejected"><strong>기록하지 않음</strong>{guide.rejected.map(x=><span key={x}>× {x}</span>)}</div><div className="cx-repurchase-process">{guide.process.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div></>
  } else if (guide.kind === 'coowner-property-tax-splitter') {
    label = '공유재산 재산세 분배기'
    body = <><aside className="cx-coowner-formula">{guide.formula}</aside><div className="cx-coowner-examples">{guide.examples.map(x=><section key={x.setup}><strong>{x.setup}</strong><span>{x.tax}</span><b>{x.split}</b></section>)}</div><div className="cx-coowner-gates">{guide.gates.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div></>
  } else {
    label = '농지 위탁경영 법정사유 게이트'
    body = <><div className="cx-farmland-allowed">{guide.allowed.map(x=><section key={x.reason}><strong>{x.reason}</strong><b>{x.threshold}</b></section>)}</div><div className="cx-farmland-denied">{guide.denied.map(x=><section key={x.case}><strong>× {x.case}</strong><span>{x.why}</span></section>)}</div><div className="cx-farmland-decision">{guide.decision.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div></>
  }
  return <article className="cx-card cx-visual-card"><SectionBlock label={label} index={5}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function TwentyNinthSixGuide({ guide }) {
  let label = '개념 전용 정밀 학습도'
  let body
  if (guide.kind === 'land-lessee-protection-ladder') {
    label = '토지임차인 보호 5단 사다리'
    body = <><div className="cx-lessee-ladder">{guide.ladder.map((x,i)=><section key={x.step}><b>{i+1}</b><strong>{x.step}</strong><span>{x.condition}</span></section>)}</div><div className="cx-lessee-gates">{guide.gates.map(x=><section className={x.result.includes('불가')?'is-no':''} key={x.case}><strong>{x.case}</strong><b>{x.result}</b></section>)}</div><aside className="cx-lessee-price">{guide.price}</aside></>
  } else if (guide.kind === 'public-rental-housing-portfolio') {
    label = '공공임대주택 8종 포트폴리오'
    body = <><div className="cx-rental-portfolio">{guide.portfolio.map(x=><section key={x.name}><strong>{x.name}</strong><span>{x.cue}</span><b>{x.term}</b></section>)}</div><div className="cx-rental-routes">{guide.routes.map(x=><section key={x.verb}><strong>{x.verb}</strong><span>{x.types}</span></section>)}</div><aside className="cx-rental-outsider">× {guide.outsider}</aside></>
  } else if (guide.kind === 'commercial-renewal-control-panel') {
    label = '상가 갱신요구 6·1·10 제어판'
    body = <><div className="cx-renewal-window">{guide.window.map(x=><section key={x.mark}><strong>{x.mark}</strong><span>{x.state}</span></section>)}</div><div className="cx-renewal-total">{guide.total.map(x=><section key={x.elapsed}><strong>{x.elapsed}</strong><b>{x.result}</b></section>)}</div><div className="cx-renewal-locks">{guide.locks.map(x=><span key={x}>🔒 {x}</span>)}</div><aside className="cx-renewal-exception">판례 예외 · {guide.exception}</aside></>
  } else if (guide.kind === 'cadastral-category-constellation') {
    label = '법정 지목 28개 별자리'
    body = <><div className="cx-category-families">{guide.families.map(x=><section key={x.family}><strong>{x.family}</strong><div>{x.items.map(v=><span key={v}>{v}</span>)}</div></section>)}</div><div className="cx-category-symbols">{guide.symbols.map(x=><section key={x.name}><b>{x.code}</b><span>{x.name}</span></section>)}</div><aside className="cx-category-trap">! {guide.trap}</aside></>
  } else if (guide.kind === 'june-first-tax-snapshot') {
    label = '6월 1일 과세 스냅샷'
    body = <><div className="cx-tax-snapshot">{guide.calendar.map((x,i)=><section className={i===1?'is-focus':''} key={x.date}><strong>{x.date}</strong><b>{x.event}</b><span>{x.taxpayer}</span></section>)}</div><div className="cx-tax-base-compare">{guide.compare.map(x=><section key={x.tax}><strong>{x.tax}</strong><span>{x.statute}</span><b>{x.date}</b></section>)}</div><aside className="cx-tax-settlement">{guide.settlement}</aside></>
  } else {
    label = '도시개발조합 동의 설계도'
    body = <><div className="cx-association-blueprint">{guide.blueprint.map((x,i)=><section key={x.step}><b>{i+1}</b><strong>{x.step}</strong><span>{x.value}</span></section>)}</div><div className="cx-public-land-rule">{guide.landRule.map(x=><section key={x.scene}><strong>{x.scene}</strong><b>{x.publicLand}</b><span>{x.denominator}</span></section>)}</div><aside className="cx-association-memory">{guide.memory}</aside></>
  }
  return <article className="cx-card cx-visual-card"><SectionBlock label={label} index={5}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function ThirtiethSixGuide({ guide }) {
  let label = '개념 전용 검증 보드'
  let body
  if (guide.kind === 'non-genuine-intent-three-minds') {
    label = '비진의표시 세 마음 판독기'
    body = <><div className="cx-intent-minds">{guide.minds.map((x,i)=><section key={x.layer}><b>{i+1}</b><strong>{x.layer}</strong><span>{x.question}</span><small>{x.effect}</small></section>)}</div><div className="cx-intent-matrix">{guide.matrix.map(x=><section key={`${x.speaker}-${x.listener}`}><span>{x.speaker}</span><i>×</i><span>{x.listener}</span><strong>{x.result}</strong></section>)}</div><div className="cx-thirdparty-flow">{guide.thirdParty.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div></>
  } else if (guide.kind === 'mbs-risk-routing-board') {
    label = 'MBS 위험·현금흐름 배관도'
    body = <><div className="cx-mbs-board">{guide.products.map(x=><section key={x.name}><header><strong>{x.name}</strong><span>{x.form}</span></header><p>{x.cash}</p><div><b>조기상환 · {x.prepay}</b><b>채무불이행 · {x.defaultRisk}</b></div></section>)}</div><div className="cx-prepay-flow">{guide.prepayFlow.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div><aside className="cx-mbs-caution">! {guide.caution}</aside></>
  } else if (guide.kind === 'commercial-deposit-threshold-xray') {
    label = '환산보증금 초과 X-ray'
    body = <><aside className="cx-deposit-formula">{guide.formula}</aside><div className="cx-threshold-xray"><section><strong>초과해도 적용</strong>{guide.survives.map(x=><span key={x.rule}>○ {x.rule}<b>{x.article}</b></span>)}</section><section className="is-out"><strong>초과하면 배제</strong>{guide.excluded.map(x=><span key={x.rule}>× {x.rule}<b>{x.article}</b></span>)}</section></div><div className="cx-deposit-case"><span>{guide.case.deposit}</span><span>{guide.case.rent}</span><b>{guide.case.converted}</b><strong>{guide.case.result}</strong></div></>
  } else if (guide.kind === 'building-registry-two-desk') {
    label = '건물등기 표제부·권리부 두 창구'
    body = <><div className="cx-registry-desks">{guide.desks.map(x=><section key={x.desk}><header><strong>{x.desk}</strong><b>{x.subject}</b></header><div>{x.fields.map(v=><span key={v}>{v}</span>)}</div><footer>{x.clock}</footer></section>)}</div><div className="cx-building-merger">{guide.merger.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div><div className="cx-rank-pair">{guide.rank.map(x=><section key={x.registry}><strong>{x.registry}</strong><b>{x.rank}</b></section>)}</div></>
  } else if (guide.kind === 'property-tax-payment-in-kind-checkpoint') {
    label = '재산세 물납 5검문소'
    body = <><div className="cx-kind-checkpoints">{guide.checkpoints.map((x,i)=><section key={x.gate}><b>{i+1}</b><strong>{x.gate}</strong><span>{x.pass}</span></section>)}</div><div className="cx-kind-clock">{guide.clock.map(x=><section key={x.day}><strong>{x.day}</strong><span>{x.action}</span></section>)}</div><aside className="cx-kind-example"><span>{guide.example.tax}</span><span>{guide.example.property}</span><strong>{guide.example.verdict}</strong></aside></>
  } else {
    label = '정비계획·구역지정 절차 레일'
    body = <><div className="cx-maintenance-rail">{guide.rail.map((x,i)=><section key={x.station}><b>{i+1}</b><strong>{x.station}</strong><span>{x.detail}</span></section>)}</div><div className="cx-maintenance-clocks">{guide.clocks.map(x=><section key={x.task}><strong>{x.task}</strong><b>{x.period}</b></section>)}</div><div className="cx-integrated-tags">{guide.integrated.map(x=><span key={x}>✓ {x}</span>)}</div></>
  }
  return <article className="cx-card cx-visual-card"><SectionBlock label={label} index={5}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function ThirtyFirstSixGuide({ guide }) {
  let label = '31차 개념 전용 검증 보드'
  let body
  if (guide.kind === 'prescription-two-engine') {
    label = '취득시효 이중 엔진·자주점유 판독기'
    body = <><div className="cx-prescription-engines">{guide.engines.map(x=><section key={x.name}><strong>{x.name}</strong><b>{x.period}</b>{x.requirements.map(v=><span key={v}>✓ {v}</span>)}</section>)}</div><div className="cx-possession-tests">{guide.tests.map((x,i)=><section className={x.verdict==='추정 번복'?'is-break':''} key={x.fact}><b>{i+1}</b><strong>{x.fact}</strong><span>{x.verdict}</span></section>)}</div><aside className="cx-prescription-finish">{guide.finish}</aside></>
  } else if (guide.kind === 'auction-rights-lifeboat') {
    label = '경매 권리 소멸·인수 구명정'
    body = <><div className="cx-auction-waterline"><strong>말소기준권리</strong><span>대항할 수 없는 후순위 권리는 원칙적으로 매각으로 소멸</span></div><div className="cx-auction-boats">{guide.rights.map(x=><section className={x.result==='인수'?'is-aboard':'is-sink'} key={x.right}><strong>{x.right}</strong><b>{x.result}</b><span>{x.condition}</span></section>)}</div><div className="cx-auction-clock">{guide.clock.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div></>
  } else if (guide.kind === 'broker-license-security-card') {
    label = '공인중개사 자격증 보안카드'
    body = <><div className="cx-license-issue">{guide.issue.map((x,i)=><section key={x.step}><b>{i+1}</b><strong>{x.step}</strong><span>{x.detail}</span></section>)}</div><div className="cx-license-prohibitions">{guide.prohibitions.map(x=><section key={x.actor}><strong>{x.actor}</strong><b>{x.ban}</b><span>{x.effect}</span></section>)}</div><aside className="cx-license-memory">{guide.memory}</aside></>
  } else if (guide.kind === 'coverage-ratio-sky-map') {
    label = '건폐율 상한 스카이맵'
    body = <><div className="cx-coverage-bars">{guide.zones.map(x=><section key={x.zone}><div><i style={{height:`${x.cap*1.55}px`}}><b>{x.cap}%</b></i></div><strong>{x.zone}</strong></section>)}</div><div className="cx-coverage-specials">{guide.specials.map(x=><section key={x.place}><strong>{x.place}</strong><b>{x.cap}</b></section>)}</div><aside className="cx-local-rule">{guide.localRule}</aside></>
  } else if (guide.kind === 'emigration-tax-countdown') {
    label = '해외이주 1주택 비과세 카운트다운'
    body = <><div className="cx-emigration-line">{guide.timeline.map((x,i)=><section className={x.state==='마감'?'is-deadline':''} key={x.mark}><b>{x.mark}</b><strong>{x.event}</strong><span>{x.state}</span></section>)}</div><div className="cx-emigration-gates">{guide.gates.map(x=><span key={x}>✓ {x}</span>)}</div><div className="cx-emigration-cases">{guide.cases.map(x=><section className={x.result==='비과세 특례 가능'?'is-yes':'is-no'} key={x.sale}><strong>{x.sale}</strong><b>{x.result}</b></section>)}</div></>
  } else {
    label = '농지취득자격증명 1,000㎡·7일 게이트'
    body = <><div className="cx-farmland-area"><section><strong>세대원 A</strong><b>{guide.area.a}</b></section><i>+</i><section><strong>세대원 B</strong><b>{guide.area.b}</b></section><i>=</i><section className="is-total"><strong>세대 합계</strong><b>{guide.area.total}</b><span>{guide.area.verdict}</span></section></div><div className="cx-farmland-clocks">{guide.clocks.map(x=><section key={x.type}><strong>{x.type}</strong><b>{x.days}</b><span>{x.note}</span></section>)}</div><div className="cx-farmland-route">{guide.route.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div></>
  }
  return <article className="cx-card cx-visual-card"><SectionBlock label={label} index={5}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function ThirtySecondSixGuide({ guide }) {
  let label = '32차 개념 전용 검증 보드'
  let body
  if (guide.kind === 'pfi-ownership-timeline') {
    label = '민간투자사업 소유권 타임라인'
    body = <><div className="cx-pfi-timelines">{guide.methods.map(x=><section key={x.name}><header><strong>{x.name}</strong><b>{x.words}</b></header><div>{x.steps.map((v,i)=><span key={v}><i>{i+1}</i>{v}</span>)}</div><footer>{x.revenue}</footer></section>)}</div><aside className="cx-pfi-axis">{guide.axis}</aside></>
  } else if (guide.kind === 'house-price-three-offices') {
    label = '주택가격 공시 세 관청'
    body = <><div className="cx-price-offices">{guide.offices.map(x=><section key={x.price}><strong>{x.price}</strong><b>{x.actor}</b><span>{x.method}</span><small>이의 · {x.appeal}</small></section>)}</div><div className="cx-price-flow">{guide.flow.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div><aside className="cx-price-trap">{guide.trap}</aside></>
  } else if (guide.kind === 'auction-bid-control-room') {
    label = '경매 입찰·보증금 관제실'
    body = <><div className="cx-auction-methods">{guide.methods.map(x=><span key={x}>{x}</span>)}</div><div className="cx-bid-calculator"><section><small>최저매각가격</small><b>{guide.calc.minimum}</b></section><i>×</i><section><small>원칙 보증률</small><b>{guide.calc.rate}</b></section><i>=</i><section><small>매수신청보증</small><b>{guide.calc.deposit}</b></section></div><div className="cx-bid-route">{guide.route.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div><aside className="cx-next-bid">{guide.nextBid}</aside></>
  } else if (guide.kind === 'disposition-plan-change-gate') {
    label = '관리처분계획 변경 게이트'
    body = <><div className="cx-disposition-gates">{guide.changes.map(x=><section className={x.route==='변경인가'?'is-approval':'is-report'} key={x.change}><strong>{x.change}</strong><b>{x.route}</b><span>{x.condition}</span></section>)}</div><div className="cx-disposition-rail">{guide.rail.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div><aside className="cx-disposition-use">{guide.use}</aside></>
  } else if (guide.kind === 'building-area-layer-cake') {
    label = '건축물 면적 레이어 케이크'
    body = <><div className="cx-area-layers">{guide.layers.map(x=><section key={x.layer}><strong>{x.layer}</strong><b>{x.formula}</b><div>{x.rules.map(v=><span key={v}>{v}</span>)}</div></section>)}</div><div className="cx-floor-counter">{guide.floor.map(x=><section key={x.case}><strong>{x.case}</strong><b>{x.rule}</b></section>)}</div><aside className="cx-area-worked">{guide.worked}</aside></>
  } else {
    label = '투기과열·조정대상 쌍둥이 레이더'
    body = <><div className="cx-regulated-radars">{guide.areas.map(x=><section key={x.name}><header><strong>{x.name}</strong><b>{x.actor}</b></header><div>{x.tests.map(v=><span key={v}>• {v}</span>)}</div><footer>{x.review}</footer></section>)}</div><div className="cx-radar-numbers">{guide.numbers.map(x=><section key={x.signal}><strong>{x.signal}</strong><b>{x.value}</b></section>)}</div><aside className="cx-radar-memory">{guide.memory}</aside></>
  }
  return <article className="cx-card cx-visual-card"><SectionBlock label={label} index={5}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function ThirtyThirdSixGuide({ guide }) {
  let label = '33차 개념 전용 검증 보드'
  let body
  if (guide.kind === 'standard-price-adjustment-lab') {
    label = '공시지가기준법 보정 실험실'
    body = <><div className="cx-standard-selection">{guide.selection.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div><div className="cx-standard-equation">{guide.factors.map((x,i)=><section key={x.name}><small>{x.name}</small><strong>{x.value}</strong>{i<guide.factors.length-1?<i>×</i>:null}</section>)}</div><div className="cx-standard-result"><span>계산 결과</span><b>{guide.result}</b></div><aside className="cx-b33-note">{guide.check}</aside></>
  } else if (guide.kind === 'maintenance-implementer-handoff') {
    label = '정비사업 시행자 인계·의제 판독판'
    body = <><div className="cx-handoff-line">{guide.handoff.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div><div className="cx-role-cards">{guide.roles.map(x=><section key={x.actor}><strong>{x.actor}</strong><span>{x.rule}</span></section>)}</div><div className="cx-permit-sort">{guide.permits.map(x=><section className={x.result.includes('없음')?'is-out':'is-in'} key={x.name}><strong>{x.name}</strong><b>{x.result}</b></section>)}</div></>
  } else if (guide.kind === 'predecision-permit-bundle') {
    label = '건축 사전결정 허가 묶음'
    body = <><div className="cx-predecision-bundle">{guide.bundle.map(x=><section key={x.permit}><i>✓</i><strong>{x.permit}</strong><b>{x.state}</b></section>)}</div><div className="cx-predecision-clocks">{guide.clocks.map(x=><section key={x.mark}><small>{x.mark}</small><b>{x.value}</b><span>{x.note}</span></section>)}</div><aside className="cx-b33-note is-alert">하천점용허가도 의제된다. ‘하천은 제외’라는 지문은 X.</aside></>
  } else if (guide.kind === 'remodeling-expansion-dashboard') {
    label = '공동주택 리모델링 숫자 계기판'
    body = <><div className="cx-remodel-gauges">{guide.gauges.map(x=><section key={x.label}><div><i style={{width:`${x.value*2}%`}} /></div><strong>{x.value}{x.suffix}</strong><span>{x.label}</span></section>)}</div><div className="cx-remodel-votes">{guide.votes.map(x=><section key={x.scope}><strong>{x.scope}</strong><b>{x.main}</b><span>{x.sub}</span></section>)}</div><div className="cx-handoff-line">{guide.route.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div></>
  } else if (guide.kind === 'special-housing-three-models') {
    label = '특수주택 세 모델 전시장'
    body = <><div className="cx-housing-models">{guide.models.map(x=><section key={x.name}><header><strong>{x.name}</strong><b>{x.visual}</b></header>{x.rules.map(v=><span key={v}>✓ {v}</span>)}</section>)}</div><div className="cx-landlease-strip"><span>토지임대기간 <b>{guide.lease.term}</b></span><i>→</i><span>{guide.lease.renewal}</span></div></>
  } else {
    label = '일반·전속중개계약서 겹쳐보기'
    body = <><div className="cx-form-overlay"><section><strong>두 서식 공통</strong>{guide.common.map(x=><span key={x}>✓ {x}</span>)}</section><section className="is-exclusive"><strong>전속계약 추가</strong>{guide.exclusive.map(x=><span key={x.duty}><b>{x.clock}</b>{x.duty}</span>)}</section></div><div className="cx-form-penalties">{guide.penalties.map(x=><section key={x.case}><strong>{x.case}</strong><b>{x.cost}</b></section>)}</div></>
  }
  return <article className="cx-card cx-visual-card cx-visual-card--b33"><SectionBlock label={label} index={5}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function ThirtyFourthSixGuide({ guide }) {
  let label = '34차 개념 전용 검증 보드'
  let body
  if (guide.kind === 'possessor-recoverer-ledger') {
    label = '점유자·회복자 권리 장부'
    body = <><div className="cx-possessor-ledger"><div className="cx-possessor-ledger__head"><span /><span>과실취득권</span><span>필요비</span><span>유익비</span></div>{guide.rows.map(r=><div className="cx-possessor-ledger__row" key={r.type}><strong>{r.type}</strong><span>{r.fruit}</span><span>{r.necessary}</span><span>{r.useful}</span></div>)}</div><aside className="cx-b34-note">{guide.note}</aside></>
  } else if (guide.kind === 'lien-connexity-filter') {
    label = '유치권 견련관계 필터'
    body = <><div className="cx-lien-gates">{guide.gates.map(g=><section key={g.q}><strong>{g.q}</strong><div><span className="is-pass">{g.pass}</span><span className="is-fail">{g.fail}</span></div></section>)}</div><div className="cx-lien-examples">{guide.examples.map(e=><section className={e.pass?'is-pass':'is-fail'} key={e.claim}><i aria-hidden>{e.pass?'✓':'✗'}</i><strong>{e.claim}</strong><span>{e.note}</span></section>)}</div><aside className="cx-b34-note">{guide.aside}</aside></>
  } else if (guide.kind === 'holding-period-rate-track') {
    label = '보유기간별 세율 트랙'
    body = <><div className="cx-rate-track">{guide.track.map((t,i)=><section key={t.stage}><b>{i+1}</b><strong>{t.stage}</strong><span>{t.rate}</span><small>{t.tag}</small></section>)}</div><div className="cx-rate-sidenote"><strong>{guide.sideNote.label}</strong><span>{guide.sideNote.text}</span></div><aside className="cx-b34-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'market-efficiency-radius') {
    label = '효율적 시장 3단계 반경'
    body = <><div className="cx-efficiency-rings">{guide.rings.map(r=><section key={r.level}><div className="cx-efficiency-rings__bar"><i style={{ width: `${r.width}%` }} /></div><strong>{r.level}</strong><span>{r.scope}</span></section>)}</div><div className="cx-efficiency-traits">{guide.traits.map(t=><span key={t}>{t}</span>)}</div></>
  } else if (guide.kind === 'leverage-amplifier') {
    label = '레버리지 증폭기'
    body = <><div className="cx-leverage-states">{guide.states.map(s=><section className={s.type.includes('정(') ? 'is-plus' : s.type.includes('중립') ? 'is-neutral' : 'is-minus'} key={s.type}><strong>{s.type}</strong><span>{s.condition}</span><b>{s.effect}</b></section>)}</div><div className="cx-leverage-ratio"><strong>{guide.ratioClarify.ratio}</strong><span>{guide.ratioClarify.meaning}</span></div><aside className="cx-b34-note is-alert">{guide.caution}</aside></>
  } else {
    label = '금지행위 대상·처벌 격자'
    body = <><div className="cx-prohibition-grid">{guide.columns.map(c=><section key={c.title}><header><strong>{c.title}</strong><b>{c.tag}</b></header>{c.items.map(it=><span key={it}>{it}</span>)}</section>)}</div><aside className="cx-b34-note">{guide.extra}</aside><aside className="cx-b34-note is-alert">{guide.caution}</aside></>
  }
  return <article className="cx-card cx-visual-card cx-visual-card--b34"><SectionBlock label={label} index={5}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function ThirtyFifthSixGuide({ guide }) {
  let label = '35차 개념 전용 검증 보드'
  let body
  if (guide.kind === 'lease-protection-scope-gate') {
    label = '주임법 적용범위·대항력 사다리'
    body = <><div className="cx-lease-gate">{guide.gate.map(g=><section className={g.result.includes('X')?'is-out':'is-in'} key={g.case}><strong>{g.case}</strong><b>{g.result}</b><span>{g.note}</span></section>)}</div><div className="cx-lease-ladder">{guide.ladder.map(l=><section key={l.right}><strong>{l.right}</strong>{l.need.map(n=><span key={n}>{n}</span>)}</section>)}</div><aside className="cx-b35-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'commercial-lease-priority-ladder') {
    label = '상가임대차 대항력·우선변제 사다리'
    body = <><div className="cx-lease-ladder">{guide.ladder.map(l=><section key={l.right}><strong>{l.right}</strong>{l.need.map(n=><span key={n}>{n}</span>)}</section>)}</div><div className="cx-lease-exclude"><strong>{guide.exclude.rule}</strong><span>{guide.exclude.example}</span></div><div className="cx-lease-overcap"><strong>{guide.overCap.rule}</strong><div><span className="is-keep"><b>유지</b>{guide.overCap.keep.map(k=><i key={k}>{k}</i>)}</span><span className="is-lose"><b>미적용</b>{guide.overCap.lose.map(k=><i key={k}>{k}</i>)}</span></div></div><aside className="cx-b35-note">{guide.twin}</aside><aside className="cx-b35-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'comprehensive-tax-threshold-dial') {
    label = '종부세 과세기준 다이얼'
    body = <><div className="cx-tax-thresholds">{guide.thresholds.map(t=><section key={t.who}><strong>{t.who}</strong><b>{t.amount}</b></section>)}</div><div className="cx-tax-method"><span>{guide.method.default}</span><i>↔</i><span>{guide.method.option}</span></div><aside className="cx-b35-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'rental-income-exclusion-filter') {
    label = '지상권 대여소득 공익사업 필터'
    body = <><div className="cx-rental-filter">{guide.filter.map(f=><section key={f.q}><strong>{f.q}</strong><div><span className="is-yes">{f.yes}</span><span className="is-no">{f.no}</span></div></section>)}</div><div className="cx-rental-overseas"><strong>{guide.overseas.rule}</strong><span>{guide.overseas.note}</span></div><aside className="cx-b35-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'use-zone-four-tier-map') {
    label = '용도지역 4단 지도'
    body = <><div className="cx-zone-tiers">{guide.tiers.map(t=><section key={t.tier}><strong>{t.tier}</strong>{t.subs.map(s=><span key={s}>{s}</span>)}</section>)}</div><div className="cx-zone-check">{guide.check.map(c=><span className={c.isUrban?'is-urban':'is-not-urban'} key={c.name}>{c.name} → {c.tier}</span>)}</div><aside className="cx-b35-note is-alert">{guide.caution}</aside></>
  } else {
    label = '지구단위계획 규칙판'
    body = <><div className="cx-dup-board"><section><strong>결정권자</strong><span>{guide.decide}</span></section><section><strong>지정 가능 구역</strong>{guide.zones.map(z=><span key={z}>{z}</span>)}</section></div><div className="cx-dup-mandatory"><strong>의무 지정</strong><span>{guide.mandatory.trigger}</span><b>{guide.mandatory.rule}</b></div><div className="cx-dup-relax"><strong>{guide.relax.item}</strong><b>{guide.relax.value}</b></div><aside className="cx-b35-note is-alert">{guide.trap}</aside></>
  }
  return <article className="cx-card cx-visual-card cx-visual-card--b35"><SectionBlock label={label} index={5} amended={guide.amended}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function ThirtySixthSixGuide({ guide }) {
  let label = '36차 개념 전용 검증 보드'
  let body
  if (guide.kind === 'misrepresentation-classifier') {
    label = '오표시무해·취소사유 분류기'
    body = <><div className="cx-mis-compare">{guide.compare.map(c=><section key={c.case}><strong>{c.case}</strong><b>{c.result}</b><span>{c.tag}</span></section>)}</div><div className="cx-mis-effect">{guide.effectCompare.map(e=><span key={e.type}><b>{e.type}</b>{e.effect}</span>)}</div><aside className="cx-b36-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'real-right-source-gate') {
    label = '물권 창설 통로 게이트'
    body = <><div className="cx-rrs-gates">{guide.gates.map(g=><span className={g.valid?'is-valid':'is-invalid'} key={g.name}>{g.name}</span>)}</div><div className="cx-rrs-examples"><strong>관습법상 인정된 예</strong>{guide.customExamples.map(x=><span key={x}>{x}</span>)}</div><aside className="cx-b36-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'title-trust-auction-shield') {
    label = '명의신탁 유형·경매 방패'
    body = <><div className="cx-tt-types">{guide.types.map(t=><section key={t.name}><strong>{t.name}</strong><span>{t.desc}</span></section>)}</div><div className="cx-tt-auction"><section><strong>일반 매매</strong><span>{guide.auctionRule.normal}</span></section><section className="is-shield"><strong>경매</strong><span>{guide.auctionRule.auction}</span></section></div><aside className="cx-b36-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'joint-ownership-tax-election') {
    label = '공동명의 1주택 특례 신청 경로'
    body = <><div className="cx-handoff-line">{guide.route.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div><div className="cx-jot-noapply">{guide.noApply}</div><aside className="cx-b36-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'transfer-exclusion-filter') {
    label = '양도소득세 제외 필터'
    body = <><div className="cx-transfer-excl">{guide.excluded.map(e=><section key={e.case}><strong>{e.case}</strong><span>{e.reason}</span></section>)}</div><div className="cx-transfer-inc">{guide.included}</div><aside className="cx-b36-note is-alert">{guide.caution}</aside></>
  } else {
    label = '도시혁신구역 특례 목록'
    body = <><div className="cx-uio-list">{guide.overrides.map(o=><span key={o}>{o}</span>)}</div><div className="cx-uio-not">{guide.notOverride}</div><aside className="cx-b36-note is-alert">{guide.caution}</aside></>
  }
  return <article className="cx-card cx-visual-card cx-visual-card--b36"><SectionBlock label={label} index={5} amended={guide.amended}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function ThirtySeventhSixGuide({ guide }) {
  let label = '37차 개념 전용 검증 보드'
  let body
  if (guide.kind === 'superficies-independence-badge') {
    label = '지상권 독립성 배지'
    body = <><div className="cx-fact-qa">{guide.facts.map(f=><section key={f.q}><strong>{f.q}</strong><span>{f.a}</span></section>)}</div><aside className="cx-b37-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'easement-accessory-chain') {
    label = '지역권 부종성 체인'
    body = <><div className="cx-handoff-line">{guide.chain.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div><div className="cx-easement-extra">{guide.extra}</div><aside className="cx-b37-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'chonsegwon-dual-nature') {
    label = '전세권 이중성 배지'
    body = <><div className="cx-cg-natures">{guide.natures.map(n=><section key={n.type}><strong>{n.type}</strong><span>{n.desc}</span></section>)}</div><div className="cx-fact-qa">{guide.facts.map(f=><section key={f.q}><strong>{f.q}</strong><span>{f.a}</span></section>)}</div><aside className="cx-b37-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'floating-invalidity-timeline') {
    label = '유동적 무효 타임라인'
    body = <><div className="cx-float-timeline">{guide.timeline.map((t,i)=><section key={t.stage}><b>{i+1}</b><strong>{t.stage}</strong><span>{t.state}</span></section>)}</div><div className="cx-easement-extra">{guide.extra}</div><aside className="cx-b37-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'ratification-demand-clock') {
    label = '추인·최고 시계'
    body = <><div className="cx-cg-natures">{guide.rule.map(r=><section key={r.event}><strong>{r.event}</strong><span>{r.effect}</span></section>)}</div><div className="cx-easement-extra">{guide.extra}</div><aside className="cx-b37-note is-alert">{guide.caution}</aside></>
  } else {
    label = '종부세 기준일 앵커'
    body = <><div className="cx-anchor-date">{guide.anchor}</div><div className="cx-easement-extra">{guide.rule}</div><div className="cx-easement-extra">{guide.exclusion}</div><aside className="cx-b37-note is-alert">{guide.caution}</aside></>
  }
  return <article className="cx-card cx-visual-card cx-visual-card--b37"><SectionBlock label={label} index={5} amended={guide.amended}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function ThirtyEighthSixGuide({ guide }) {
  let label = '38차 개념 전용 검증 보드'
  let body
  if (guide.kind === 'real-right-claim-scope-fence') {
    label = '물권적 청구권 범위 울타리'
    body = <><div className="cx-fence-row"><section className="is-in"><strong>청구 가능</strong><span>{guide.allowed}</span></section><section className="is-out"><strong>청구 불가</strong><span>{guide.notAllowed}</span></section></div><div className="cx-easement-extra">{guide.holder}</div><aside className="cx-b38-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'registration-requirement-split') {
    label = '등기 요부 분기점'
    body = <><div className="cx-reg-split"><section className="is-no"><strong>등기 불요</strong>{guide.noRegistration.map(x=><span key={x}>{x}</span>)}</section><section className="is-yes"><strong>등기 필요</strong>{guide.registrationRequired.map(x=><span key={x}>{x}</span>)}</section></div><aside className="cx-b38-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'offer-invitation-gate') {
    label = '청약·유인 판별 게이트'
    body = <><div className="cx-fence-row">{guide.gate.map(g=><section className={g.result==='청약'?'is-in':'is-out'} key={g.item}><strong>{g.result}</strong><span>{g.item}</span></section>)}</div><div className="cx-easement-extra">{guide.match}</div><div className="cx-easement-extra">{guide.extra}</div><aside className="cx-b38-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'third-party-benefit-limits') {
    label = '수익자 권리 한계선'
    body = <><div className="cx-fence-row"><section className="is-in"><strong>{guide.rights.who} — 있음</strong>{guide.rights.has.map(x=><span key={x}>{x}</span>)}</section><section className="is-out"><strong>없음</strong>{guide.rights.not.map(x=><span key={x}>{x}</span>)}</section></div><div className="cx-easement-extra">{guide.timing}</div><aside className="cx-b38-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'reconstruction-vote-threshold') {
    label = '재건축 결의 정족수 게이지'
    body = <><div className="cx-anchor-date">{guide.threshold}</div><div className="cx-easement-extra">{guide.defs}</div><div className="cx-easement-extra">{guide.extra}</div><aside className="cx-b38-note is-alert">{guide.caution}</aside></>
  } else {
    label = '청산 절차 순서 시계'
    body = <><div className="cx-handoff-line">{guide.sequence.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div><div className="cx-easement-extra">{guide.order}</div><aside className="cx-b38-note is-alert">{guide.caution}</aside></>
  }
  return <article className="cx-card cx-visual-card cx-visual-card--b38"><SectionBlock label={label} index={5} amended={guide.amended}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function ThirtyNinthSixGuide({ guide }) {
  let label = '39차 개념 전용 검증 보드'
  let body
  if (guide.kind === 'arrival-principle-shield') {
    label = '도달주의 방패'
    body = <><div className="cx-anchor-date">{guide.rule}</div><div className="cx-easement-extra">{guide.shield}</div><div className="cx-easement-extra">{guide.exception}</div><aside className="cx-b39-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'condition-outcome-matrix') {
    label = '기성조건 결과 매트릭스'
    body = <><div className="cx-fence-row">{guide.matrix.map(m=><section className={m.result==='무효'?'is-out':'is-in'} key={m.condition}><strong>{m.condition}</strong><span>{m.result}</span></section>)}</div><div className="cx-easement-extra">{guide.extra}</div><aside className="cx-b39-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'fine-authority-router') {
    label = '과태료 부과권자 라우터'
    body = <><div className="cx-fine-router">{guide.routers.map(r=><section key={r.who}><strong>{r.who}</strong>{r.items.map(x=><span key={x}>{x}</span>)}</section>)}</div><div className="cx-easement-extra is-alert-tone">{guide.notFine}</div><aside className="cx-b39-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'penalty-tier-scale') {
    label = '벌칙 형량 저울'
    body = <><div className="cx-fine-router">{guide.tiers.map(t=><section key={t.level}><strong>{t.level}</strong>{t.items.map(x=><span key={x}>{x}</span>)}</section>)}</div><aside className="cx-b39-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'jurisdiction-location-rule') {
    label = '관할 소재지 원칙'
    body = <><div className="cx-anchor-date">{guide.rule}</div><div className="cx-fence-row">{guide.dualEffect.map(d=><section className="is-in" key={d.who}><strong>{d.who}</strong><span>{d.effect}</span></section>)}</div><aside className="cx-b39-note is-alert">{guide.caution}</aside></>
  } else {
    label = '예치명의자 자격 게이트'
    body = <><div className="cx-fence-row"><section className="is-in"><strong>예치명의자 가능</strong>{guide.eligible.map(x=><span key={x}>{x}</span>)}</section><section className="is-out"><strong>예치명의자 불가</strong>{guide.ineligible.map(x=><span key={x}>{x}</span>)}</section></div><aside className="cx-b39-note is-alert">{guide.caution}</aside></>
  }
  return <article className="cx-card cx-visual-card cx-visual-card--b39"><SectionBlock label={label} index={5} amended={guide.amended}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function FortiethSixGuide({ guide }) {
  let label = '40차 개념 전용 검증 보드'
  let body
  if (guide.kind === 'income-tax-base-split') {
    label = '지방소득세 과세표준 분리'
    body = <><div className="cx-fence-row">{guide.split.map(s=><section className="is-in" key={s.type}><strong>{s.type}</strong><span>{s.calc}</span></section>)}</div><div className="cx-easement-extra">{guide.rule}</div><aside className="cx-b40-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'acquisition-cost-exclusion-line') {
    label = '취득원가 제외선'
    body = <><div className="cx-fence-row"><section className="is-in"><strong>포함</strong><span>{guide.included}</span></section><section className="is-out"><strong>제외</strong><span>{guide.excluded}</span></section></div><aside className="cx-b40-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'farmland-substance-test') {
    label = '농지 실질판정 테스트'
    body = <><div className="cx-anchor-date">{guide.test}</div><div className="cx-uio-list">{guide.included.map(x=><span key={x}>{x}</span>)}</div><div className="cx-easement-extra">{guide.extra}</div><aside className="cx-b40-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'unregistered-transfer-penalty-gate') {
    label = '미등기양도 중과 게이트'
    body = <><div className="cx-anchor-date">{guide.penalty}</div><div className="cx-easement-extra">{guide.exception}</div><aside className="cx-b40-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'overseas-filing-parity') {
    label = '국외자산 신고의무 평행선'
    body = <><div className="cx-easement-extra">{guide.requirement}</div><div className="cx-easement-extra">{guide.rule}</div><aside className="cx-b40-note is-alert">{guide.caution}</aside></>
  } else {
    label = '국외자산 납세의무 울타리'
    body = <><div className="cx-anchor-date">{guide.liability}</div><div className="cx-fence-row"><section className="is-out"><strong>적용 안됨</strong><span>{guide.excluded}</span></section><section className="is-in"><strong>준용됨</strong><span>{guide.included}</span></section></div><aside className="cx-b40-note is-alert">{guide.caution}</aside></>
  }
  return <article className="cx-card cx-visual-card cx-visual-card--b40"><SectionBlock label={label} index={5} amended={guide.amended}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function FortyFirstSixGuide({ guide }) {
  let label = '41차 개념 전용 검증 보드'
  let body
  if (guide.kind === 'complex-concept-lens') {
    label = '복합개념 렌즈'
    body = <><div className="cx-cg-natures">{guide.lenses.map(l=><section key={l.type}><strong>{l.type}</strong>{l.items.map(x=><span key={x}>{x}</span>)}</section>)}</div><div className="cx-easement-extra">{guide.extra}</div><aside className="cx-b41-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'housing-type-threshold-board') {
    label = '주택유형 기준판'
    body = <><div className="cx-fence-row">{guide.types.map(t=><section className="is-in" key={t.name}><strong>{t.name}</strong><span>{t.floor}</span><span>{t.area}</span></section>)}</div><div className="cx-easement-extra">{guide.extra}</div><aside className="cx-b41-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'flow-stock-classifier') {
    label = '유량·저량 분류기'
    body = <><div className="cx-fence-row"><section className="is-in"><strong>유량(flow)</strong>{guide.flow.map(x=><span key={x}>{x}</span>)}</section><section className="is-out"><strong>저량(stock)</strong>{guide.stock.map(x=><span key={x}>{x}</span>)}</section></div><div className="cx-easement-extra">{guide.test}</div><aside className="cx-b41-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'central-place-range-scale') {
    label = '중심지이론 범위 저울'
    body = <><div className="cx-fact-qa">{guide.concepts.map(c=><section key={c.term}><strong>{c.term}</strong><span>{c.desc}</span></section>)}</div><div className="cx-anchor-date">{guide.rule}</div><div className="cx-easement-extra">{guide.extra}</div><aside className="cx-b41-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'market-efficiency-tier-recap') {
    label = '효율적 시장 단계 요약'
    body = <><div className="cx-fence-row">{guide.tiers.map(t=><section className="is-in" key={t.level}><strong>{t.level}</strong><span>{t.scope}</span></section>)}</div><div className="cx-easement-extra">{guide.extra}</div><aside className="cx-b41-note is-alert">{guide.caution}</aside></>
  } else {
    label = '시장개입 직접·간접 분류'
    body = <><div className="cx-fence-row"><section className="is-in"><strong>직접개입</strong>{guide.direct.map(x=><span key={x}>{x}</span>)}</section><section className="is-out"><strong>간접개입</strong>{guide.indirect.map(x=><span key={x}>{x}</span>)}</section></div><div className="cx-uio-list">{guide.causes.map(x=><span key={x}>{x}</span>)}</div><aside className="cx-b41-note is-alert">{guide.caution}</aside></>
  }
  return <article className="cx-card cx-visual-card cx-visual-card--b41"><SectionBlock label={label} index={5} amended={guide.amended}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function FortySecondSixGuide({ guide }) {
  let label = '42차 개념 전용 검증 보드'
  let body
  if (guide.kind === 'ratio-formula-panel') {
    label = '비율분석 공식판'
    body = <><div className="cx-formula-panel">{guide.formulas.map(f=><section key={f.name}><strong>{f.name}</strong><span>{f.formula}</span></section>)}</div><div className="cx-easement-extra">{guide.extra}</div><aside className="cx-b42-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'risk-diversification-dial') {
    label = '위험 분산 다이얼'
    body = <><div className="cx-fence-row">{guide.risks.map(r=><section className={r.effect.includes('불가')?'is-out':'is-in'} key={r.type}><strong>{r.type}</strong><span>{r.effect}</span></section>)}</div><div className="cx-anchor-date">{guide.optimal}</div><aside className="cx-b42-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'reverse-mortgage-eligibility-board') {
    label = '주택연금 자격판'
    body = <><div className="cx-anchor-date">{guide.guarantor}</div><div className="cx-fence-row"><section className="is-in"><strong>가능</strong>{guide.eligible.map(x=><span key={x}>{x}</span>)}</section><section className="is-out"><strong>불가</strong><span>{guide.ineligible}</span></section></div><div className="cx-easement-extra">{guide.extra}</div><aside className="cx-b42-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'reits-type-capital-board') {
    label = 'REITs 유형·자본금판'
    body = <><div className="cx-uio-list">{guide.types.map(x=><span key={x}>{x}</span>)}</div><div className="cx-anchor-date">{guide.capital}</div><div className="cx-easement-extra">{guide.extra}</div><aside className="cx-b42-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'management-tradeoff-scale') {
    label = '관리방식 트레이드오프 저울'
    body = <><div className="cx-easement-extra">{guide.tradeoff.outsourced}</div><div className="cx-easement-extra">{guide.pmScope}</div><div className="cx-easement-extra is-alert-tone">{guide.notAllowed}</div><aside className="cx-b42-note is-alert">{guide.caution}</aside></>
  } else {
    label = '비율임대차 계산 단계'
    body = <><div className="cx-handoff-line">{guide.steps.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div><div className="cx-anchor-date">{guide.example}</div><aside className="cx-b42-note is-alert">{guide.caution}</aside></>
  }
  return <article className="cx-card cx-visual-card cx-visual-card--b42"><SectionBlock label={label} index={5} amended={guide.amended}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function FortyThirdSixGuide({ guide }) {
  let label = '43차 개념 전용 검증 보드'
  let body
  if (guide.kind === 'committee-chair-scope-board') {
    label = '정책심의위원회 위원장·소관판'
    body = <><div className="cx-anchor-date">{guide.chair}</div><div className="cx-uio-list">{guide.scope.map(x=><span key={x}>{x}</span>)}</div><aside className="cx-b43-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'brokerage-subject-scope-gate') {
    label = '중개대상물 범위 게이트'
    body = <><div className="cx-anchor-date">{guide.included}</div><div className="cx-fact-qa">{guide.reregistration.map(r=><section key={r.threshold}><strong>{r.threshold}</strong><span>{r.effect}</span></section>)}</div><aside className="cx-b43-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'education-type-timing-board') {
    label = '교육유형 대상·시점판'
    body = <><div className="cx-cg-natures">{guide.types.map(t=><section key={t.name}><strong>{t.name}</strong><span>{t.target}</span><span>{t.timing}</span>{t.authority?<span>{t.authority}</span>:null}</section>)}</div><aside className="cx-b43-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'seal-registration-rule-board') {
    label = '인장등록 규칙판'
    body = <><div className="cx-fence-row"><section className="is-in"><strong>등록 대상</strong>{guide.who.map(x=><span key={x}>{x}</span>)}</section><section className="is-out"><strong>대상 아님</strong><span>{guide.notWho}</span></section></div><div className="cx-easement-extra">{guide.changeDeadline}</div><div className="cx-easement-extra">{guide.branchRule}</div><aside className="cx-b43-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'one-office-principle-map') {
    label = '1등록 1사무소 원칙 지도'
    body = <><div className="cx-anchor-date">{guide.rule}</div><div className="cx-easement-extra">{guide.branchRule}</div><div className="cx-easement-extra">{guide.extra}</div><aside className="cx-b43-note is-alert">{guide.caution}</aside></>
  } else {
    label = '겸업 허용·금지 목록'
    body = <><div className="cx-fence-row"><section className="is-in"><strong>겸업 가능</strong>{guide.allowed.map(x=><span key={x}>{x}</span>)}</section><section className="is-out"><strong>겸업 불가</strong>{guide.denied.map(x=><span key={x}>{x}</span>)}</section></div><aside className="cx-b43-note is-alert">{guide.caution}</aside></>
  }
  return <article className="cx-card cx-visual-card cx-visual-card--b43"><SectionBlock label={label} index={5} amended={guide.amended}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function FortyFourthSixGuide({ guide }) {
  let label = '44차 개념 전용 검증 보드'
  let body
  if (guide.kind === 'license-revocation-flow-board') {
    label = '자격취소 흐름판'
    body = <><div className="cx-anchor-date">{guide.authority}</div><div className="cx-handoff-line">{guide.procedure.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div><div className="cx-uio-list">{guide.causes.map(x=><span key={x}>{x}</span>)}</div><aside className="cx-b44-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'suspension-vs-revocation-scale') {
    label = '자격정지·취소 저울'
    body = <><div className="cx-fence-row"><section className="is-in"><strong>자격정지</strong><span>{guide.suspension}</span></section><section className="is-out"><strong>자격취소</strong><span>{guide.revocation}</span></section></div><aside className="cx-b44-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'closure-period-succession-gate') {
    label = '폐업기간 승계 게이트'
    body = <><div className="cx-fact-qa">{guide.gate.map(g=><section key={g.period}><strong>{g.period}</strong><span>{g.effect}</span></section>)}</div><div className="cx-easement-extra">{guide.extra}</div><aside className="cx-b44-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'mutual-aid-supervision-chain') {
    label = '공제사업 감독 체인'
    body = <><div className="cx-handoff-line">{guide.chain.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div><aside className="cx-b44-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'fee-obligation-filter') {
    label = '수수료 대상 필터'
    body = <><div className="cx-fence-row"><section className="is-in"><strong>납부 대상</strong>{guide.required.map(x=><span key={x}>{x}</span>)}</section><section className="is-out"><strong>납부 대상 아님</strong>{guide.notRequired.map(x=><span key={x}>{x}</span>)}</section></div><aside className="cx-b44-note is-alert">{guide.caution}</aside></>
  } else {
    label = '서류보존 면제 규칙'
    body = <><div className="cx-easement-extra">{guide.rule}</div><div className="cx-anchor-date">{guide.exemption}</div><aside className="cx-b44-note is-alert">{guide.caution}</aside></>
  }
  return <article className="cx-card cx-visual-card cx-visual-card--b44"><SectionBlock label={label} index={5} amended={guide.amended}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function FortyFifthSixGuide({ guide }) {
  let label = '45차 개념 전용 검증 보드'
  let body
  if (guide.kind === 'externality-policy-rationale') {
    label = '용도지역·지구 정책 근거'
    body = <><div className="cx-easement-extra">{guide.rationale}</div><div className="cx-fence-row">{guide.compare.map(c=><section className="is-in" key={c.item}><strong>{c.item}</strong><span>{c.trait}</span></section>)}</div><div className="cx-uio-list">{guide.boundaryCheck.map(b=><span key={b.name}>{b.name} → {b.tier}</span>)}</div><aside className="cx-b45-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'sale-price-formula-board') {
    label = '분양가상한제 공식판'
    body = <><div className="cx-anchor-date">{guide.formula}</div><div className="cx-easement-extra">{guide.scope}</div><div className="cx-easement-extra">{guide.extra}</div><aside className="cx-b45-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'tax-classification-grid') {
    label = '조세 분류 그리드'
    body = <><div className="cx-tax-grid">{guide.grid.map(g=><section key={g.stage}><strong>{g.stage}</strong><span><b>국세</b>{g.national.join(', ')}</span>{g.local.length?<span><b>지방세</b>{g.local.join(', ')}</span>:null}</section>)}</div><div className="cx-easement-extra">{guide.extra}</div><aside className="cx-b45-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'coefficient-purpose-matcher') {
    label = '계수 용도 매처'
    body = <><div className="cx-fact-qa">{guide.matches.map(m=><section key={m.coef}><strong>{m.coef}</strong><span>{m.use}</span></section>)}</div><div className="cx-easement-extra">{guide.extra}</div><aside className="cx-b45-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'cash-flow-waterfall') {
    label = '운영수지 폭포수'
    body = <><div className="cx-handoff-line">{guide.steps.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div><aside className="cx-b45-note is-alert">{guide.caution}</aside></>
  } else {
    label = '기대수익률 공식판'
    body = <><div className="cx-formula-panel">{guide.formulas.map(f=><section key={f.name}><strong>{f.name}</strong><span>{f.formula}</span></section>)}</div><div className="cx-easement-extra">{guide.rule}</div><aside className="cx-b45-note is-alert">{guide.caution}</aside></>
  }
  return <article className="cx-card cx-visual-card cx-visual-card--b45"><SectionBlock label={label} index={5} amended={guide.amended}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function FortySixthSixGuide({ guide }) {
  let label = '46차 개념 전용 검증 보드'
  let body
  if (guide.kind === 'customary-superficies-requirements') {
    label = '관습법상 법정지상권 요건판'
    body = <><div className="cx-anchor-date">{guide.rule}</div><div className="cx-easement-extra">{guide.succession}</div><div className="cx-easement-extra">{guide.extra}</div><aside className="cx-b46-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'minority-co-owner-remedy-fence') {
    label = '소수지분권자 구제수단 울타리'
    body = <><div className="cx-fence-row"><section className="is-out"><strong>불가</strong><span>{guide.denied}</span></section><section className="is-in"><strong>가능</strong>{guide.allowed.map(x=><span key={x}>{x}</span>)}</section></div><div className="cx-easement-extra">{guide.precedent}</div><aside className="cx-b46-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'seller-knowledge-outcome-fork') {
    label = '매도인 선의·악의 분기'
    body = <><div className="cx-fact-qa">{guide.fork.map(f=><section key={f.state}><strong>{f.state}</strong><span>{f.outcome}</span><span>{f.remedy}</span></section>)}</div><div className="cx-easement-extra">{guide.extra}</div><aside className="cx-b46-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'real-name-act-exception-penalty-board') {
    label = '실명법 특례·제재판'
    body = <><div className="cx-easement-extra">{guide.exception}</div><div className="cx-anchor-date">{guide.penalty.who}</div><div className="cx-uio-list">{guide.penalty.types.map(x=><span key={x}>{x}</span>)}</div><div className="cx-easement-extra">{guide.extension}</div><aside className="cx-b46-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'permit-zone-effective-timeline') {
    label = '허가구역 효력 타임라인'
    body = <><div className="cx-handoff-line">{guide.timeline.map((t,i)=><span key={t.event}><b>{i+1}</b>{t.event}</span>)}</div><div className="cx-easement-extra">{guide.extra}</div><aside className="cx-b46-note is-alert">{guide.caution}</aside></>
  } else {
    label = '허가배제 사례 목록'
    body = <><div className="cx-uio-list">{guide.cases.map(x=><span key={x}>{x}</span>)}</div><aside className="cx-b46-note is-alert">{guide.caution}</aside></>
  }
  return <article className="cx-card cx-visual-card cx-visual-card--b46"><SectionBlock label={label} index={5} amended={guide.amended}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function FortySeventhSixGuide({ guide }) {
  let label = '47차 개념 전용 검증 보드'
  let body
  if (guide.kind === 'grave-right-timeline-fork') {
    label = '분묘기지권 시효취득 시점·지료 갈림길'
    body = <><div className="cx-handoff-line">{guide.timeline.map((t,i)=><span key={t.date}><b>{i+1}</b>{t.date} · {t.event} → {t.result}</span>)}</div><div className="cx-anchor-date">{guide.precedent.date}</div><div className="cx-easement-extra">{guide.precedent.rule}</div><aside className="cx-b47-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'cadastral-ledger-split') {
    label = '지적도·토지대장 확인항목 분리판'
    body = <><div className="cx-fence-row">{guide.ledgers.map(l=><section key={l.name}><strong>{l.name}</strong>{l.items.map(x=><span key={x}>{x}</span>)}</section>)}</div><div className="cx-easement-extra">{guide.exception}</div><aside className="cx-b47-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'common-area-defect-presumption') {
    label = '전유·공용부분 하자 추정도'
    body = <><div className="cx-fact-qa"><section><strong>{guide.exclusive.label}</strong><span>{guide.exclusive.desc}</span></section><section><strong>{guide.common.label}</strong><span>{guide.common.desc}</span></section></div><div className="cx-easement-extra">{guide.presumption}</div><aside className="cx-b47-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'grave-area-limit-dial') {
    label = '묘지 유형별 면적 상한판'
    body = <><div className="cx-uio-list">{guide.limits.map(x=><span key={x.type}><b>{x.type}</b> · {x.area}{x.note?` (${x.note})`:''}</span>)}</div><aside className="cx-b47-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'renewal-notice-registration-gate') {
    label = '갱신요구 기간·등기명령 게이트'
    body = <><div className="cx-anchor-date">{guide.window.from} ~ {guide.window.to}</div><div className="cx-easement-extra">{guide.window.note}</div><div className="cx-easement-extra">{guide.terminate}</div><div className="cx-easement-extra">{guide.registration}</div><aside className="cx-b47-note is-alert">{guide.caution}</aside></>
  } else {
    label = '거래계약서 작성·보존 체크리스트'
    body = <><div className="cx-uio-list">{guide.checklist.map(x=><span key={x.item}><b>{x.item}</b> · {x.rule}</span>)}</div><aside className="cx-b47-note is-alert">{guide.caution}</aside></>
  }
  return <article className="cx-card cx-visual-card cx-visual-card--b47"><SectionBlock label={label} index={5} amended={guide.amended}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function FortyEighthSixGuide({ guide }) {
  let label = '48차 개념 전용 검증 보드'
  let body
  if (guide.kind === 'brokerage-subject-matter-case-filter') {
    label = '중개대상물 판례 해당·비해당 필터'
    body = <><div className="cx-fence-row"><section className="is-in"><strong>해당</strong>{guide.included.map(x=><span key={x.case}>{x.case} — {x.reason}</span>)}</section><section className="is-out"><strong>비해당</strong>{guide.excluded.map(x=><span key={x.case}>{x.case} — {x.reason}</span>)}</section></div><aside className="cx-b48-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'office-posting-checklist') {
    label = '사무소 게시서류 체크판'
    body = <><div className="cx-uio-list">{guide.postings.map(x=><span key={x}>✓ {x}</span>)}</div><div className="cx-easement-extra">{guide.penalty.violation} → {guide.penalty.rule}</div><aside className="cx-b48-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'posting-obligation-include-exclude') {
    label = '게시의무 포함·제외 목록'
    body = <><div className="cx-fence-row"><section className="is-in"><strong>포함</strong>{guide.include.map(x=><span key={x}>{x}</span>)}</section><section className="is-out"><strong>제외</strong>{guide.exclude.map(x=><span key={x}>{x}</span>)}</section></div><aside className="cx-b48-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'branch-registration-form-fields') {
    label = '분사무소 신고서 기재사항판'
    body = <><div className="cx-easement-extra">{guide.notRequired}</div><div className="cx-uio-list">{guide.fields.map(x=><span key={x}>{x}</span>)}</div><div className="cx-easement-extra">{guide.extra}</div><aside className="cx-b48-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'info-network-designation-flow') {
    label = '거래정보망 지정 흐름도'
    body = <><div className="cx-handoff-line">{guide.flow.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div><aside className="cx-b48-note is-alert">{guide.caution}</aside></>
  } else {
    label = '거래질서교란행위 신고 흐름도'
    body = <><div className="cx-anchor-date">{guide.example}</div><div className="cx-handoff-line">{guide.flow.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div><aside className="cx-b48-note is-alert">{guide.caution}</aside></>
  }
  return <article className="cx-card cx-visual-card cx-visual-card--b48"><SectionBlock label={label} index={5} amended={guide.amended}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function FortyNinthSixGuide({ guide }) {
  let label = '49차 개념 전용 검증 보드'
  let body
  if (guide.kind === 'ksic-industry-branch-map') {
    label = 'KSIC 부동산업 분류 나뭇가지도'
    body = <><div className="cx-fence-row">{guide.branches.map(b=><section key={b.name} className={b.isService?'is-in':'is-out'}><strong>{b.name}</strong>{b.subs.map(x=><span key={x}>{x}</span>)}</section>)}</div><div className="cx-easement-extra">제외: {guide.excluded.join(', ')}</div><aside className="cx-b49-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'equilibrium-calc-steps') {
    label = '수요공급 계산 유형 분류판'
    body = <><div className="cx-uio-list">{guide.types.map(x=><span key={x.name}><b>{x.name}</b> · {x.method}</span>)}</div><aside className="cx-b49-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'elasticity-revenue-scale') {
    label = '탄력성·총수입 저울'
    body = <><div className="cx-fact-qa">{guide.extremes.map(x=><section key={x.name}><strong>{x.name}</strong><span>{x.desc}</span></section>)}</div><div className="cx-easement-extra">{guide.revenue.elastic}</div><div className="cx-easement-extra">{guide.revenue.inelastic}</div><aside className="cx-b49-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'regulation-type-sorter') {
    label = '금융규제·비금융규제 분류함'
    body = <><div className="cx-fence-row"><section className="is-in"><strong>금융규제</strong>{guide.financial.map(x=><span key={x}>{x}</span>)}</section><section className="is-out"><strong>비금융규제</strong>{guide.notFinancial.map(x=><span key={x}>{x}</span>)}</section></div><aside className="cx-b49-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'info-value-formula-panel') {
    label = '정보의 가치 공식판'
    body = <><aside className="cx-formula-board">{guide.formula}</aside><div className="cx-easement-extra">{guide.expectedValue}</div><div className="cx-easement-extra">{guide.meaning}</div><aside className="cx-b49-note is-alert">{guide.caution}</aside></>
  } else {
    label = '자산유동화 구조판'
    body = <><div className="cx-uio-list">{guide.structure.map(x=><span key={x.item}><b>{x.item}</b> · {x.rule}</span>)}</div><aside className="cx-b49-note is-alert">{guide.caution}</aside></>
  }
  return <article className="cx-card cx-visual-card cx-visual-card--b49"><SectionBlock label={label} index={5} amended={guide.amended}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function FiftiethSixGuide({ guide }) {
  let label = '50차 개념 전용 검증 보드'
  let body
  if (guide.kind === 'association-report-obligation-flow') {
    label = '협회 보고의무 흐름도'
    body = <><div className="cx-handoff-line">{guide.flows.map(x=><span key={x.from}><b>{x.from}</b> → {x.to} · {x.action}</span>)}</div><div className="cx-easement-extra">{guide.extra}</div><aside className="cx-b50-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'reward-eligibility-filter') {
    label = '신고포상금 지급대상 필터'
    body = <><div className="cx-fence-row"><section className="is-in"><strong>지급대상</strong>{guide.eligible.map(x=><span key={x}>{x}</span>)}</section><section className="is-out"><strong>제외</strong>{guide.excluded.map(x=><span key={x}>{x}</span>)}</section></div><div className="cx-easement-extra">{guide.procedure}</div><aside className="cx-b50-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'network-revocation-grounds-board') {
    label = '거래정보사업자 지정취소 사유판'
    body = <><div className="cx-uio-list">{guide.grounds.map(x=><span key={x}>{x}</span>)}</div><div className="cx-easement-extra">{guide.center}</div><aside className="cx-b50-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'report-target-contract-filter') {
    label = '거래신고 대상계약 필터'
    body = <><div className="cx-fence-row"><section className="is-in"><strong>대상</strong>{guide.included.map(x=><span key={x}>{x}</span>)}</section><section className="is-out"><strong>비대상</strong>{guide.excluded.map(x=><span key={x}>{x}</span>)}</section></div><aside className="cx-b50-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'fund-plan-threshold-gate') {
    label = '자금조달계획서 제출 게이트'
    body = <><div className="cx-uio-list">{guide.gates.map(x=><span key={x.zone}><b>{x.zone}</b> · {x.rule}</span>)}</div><div className="cx-easement-extra">{guide.who}</div><aside className="cx-b50-note is-alert">{guide.caution}</aside></>
  } else {
    label = '이용의무 위반 조치·예외판'
    body = <><div className="cx-uio-list">{guide.remedies.map(x=><span key={x}>✓ {x}</span>)}</div><div className="cx-easement-extra">{guide.notIncluded}</div><div className="cx-fact-qa"><section><strong>예외 허용</strong><span>{guide.exception.allowed}</span></section><section><strong>예외 아님</strong><span>{guide.exception.notAllowed}</span></section></div><aside className="cx-b50-note is-alert">{guide.caution}</aside></>
  }
  return <article className="cx-card cx-visual-card cx-visual-card--b50"><SectionBlock label={label} index={5} amended={guide.amended}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function FiftyFirstSixGuide({ guide }) {
  let label = '51차 개념 전용 검증 보드'
  let body
  if (guide.kind === 'mbs-duration-price-scale') {
    label = 'MBS 가격·duration 저울'
    body = <><div className="cx-easement-extra">{guide.marketEffect}</div><div className="cx-uio-list">{guide.priceRule.map(x=><span key={x.factor}><b>{x.factor}</b> → {x.effect}</span>)}</div><aside className="cx-b51-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'pf-nonrecourse-trust-board') {
    label = 'PF 비소구 구조·신탁 당사자판'
    body = <><div className="cx-easement-extra">담보: {guide.structure.collateral}</div><div className="cx-easement-extra">{guide.structure.recourse}</div><div className="cx-uio-list">{guide.trustParties.map(x=><span key={x}>{x}</span>)}</div><aside className="cx-b51-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'financing-type-sorter') {
    label = '지분·부채금융 분류함'
    body = <><div className="cx-fence-row"><section className="is-in"><strong>지분금융</strong>{guide.equity.map(x=><span key={x}>{x}</span>)}</section><section className="is-out"><strong>부채금융</strong>{guide.debt.map(x=><span key={x}>{x}</span>)}</section></div><aside className="cx-b51-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'wofford-risk-triad') {
    label = '워포드 개발위험 3분류판'
    body = <><div className="cx-fact-qa">{guide.risks.map(x=><section key={x.name}><strong>{x.name}</strong><span>{x.example}</span></section>)}</div><div className="cx-easement-extra">{guide.definition}</div><div className="cx-easement-extra">{guide.extra}</div><aside className="cx-b51-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'redevelopment-type-matrix') {
    label = '정비사업 유형 매트릭스'
    body = <><div className="cx-fact-qa">{guide.types.map(x=><section key={x.name}><strong>{x.name}</strong><span>기반시설: {x.infra}</span><span>{x.area}</span></section>)}</div><aside className="cx-b51-note is-alert">{guide.caution}</aside></>
  } else {
    label = '토지취득방식 비교 저울'
    body = <><div className="cx-fact-qa">{guide.methods.map(x=><section key={x.name}><strong>{x.name}</strong><span>{x.desc}</span><span>{x.trait}</span></section>)}</div><div className="cx-uio-list">{guide.jointVenture.map(x=><span key={x}>{x}</span>)}</div><aside className="cx-b51-note is-alert">{guide.caution}</aside></>
  }
  return <article className="cx-card cx-visual-card cx-visual-card--b51"><SectionBlock label={label} index={5} amended={guide.amended}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function FiftySecondSixGuide({ guide }) {
  let label = '52차 개념 전용 검증 보드'
  let body
  if (guide.kind === 'marketing-4p-sorter') {
    label = '4P 마케팅믹스 판별판'
    body = <><div className="cx-fence-row"><section className="is-in"><strong>4P 해당</strong>{guide.included.map(x=><span key={x.p}><b>{x.p}</b> · {x.example}</span>)}</section><section className="is-out"><strong>4P 아님</strong>{guide.excluded.map(x=><span key={x}>{x}</span>)}</section></div><aside className="cx-b52-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'appraisal-procedure-flow') {
    label = '감정평가 절차 흐름도'
    body = <><div className="cx-handoff-line">{guide.steps.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div><div className="cx-easement-extra">{guide.excluded}</div><aside className="cx-b52-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'regional-individual-principle-board') {
    label = '지역·개별분석 원칙판'
    body = <><div className="cx-easement-extra">{guide.regional}</div><div className="cx-fact-qa">{guide.principles.map(x=><section key={x.name}><strong>{x.name}</strong><span>{x.scope}</span><b>{x.example}</b></section>)}</div><aside className="cx-b52-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'three-approach-reconciliation-panel') {
    label = '3방식·시산가액 조정판'
    body = <><div className="cx-uio-list">{guide.approaches.map(x=><span key={x.name}><b>{x.name}</b> · {x.basis}</span>)}</div><div className="cx-easement-extra">{guide.reconciliation}</div><div className="cx-easement-extra">{guide.example}</div><aside className="cx-b52-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'rent-formula-triad') {
    label = '임대료 3공식판'
    body = <><div className="cx-uio-list">{guide.formulas.map(x=><span key={x.name}><b>{x.name}</b> = {x.formula}</span>)}</div><div className="cx-easement-extra">{guide.extra}</div><aside className="cx-b52-note is-alert">{guide.caution}</aside></>
  } else {
    label = '감가수정·재조달원가판'
    body = <><div className="cx-uio-list">{guide.depreciation.map(x=><span key={x.name}><b>{x.name}</b>{x.subs?` · ${x.subs}`:''}</span>)}</div><div className="cx-easement-extra">{guide.note}</div><div className="cx-easement-extra">{guide.reproductionCost}</div><aside className="cx-b52-note is-alert">{guide.caution}</aside></>
  }
  return <article className="cx-card cx-visual-card cx-visual-card--b52"><SectionBlock label={label} index={5} amended={guide.amended}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function FiftyThirdSixGuide({ guide }) {
  let label = '53차 개념 전용 검증 보드'
  let body
  if (guide.kind === 'right-acquisition-type-tree') {
    label = '권리취득 유형 나뭇가지도'
    body = <><div className="cx-fact-qa">{guide.tree.map(x=><section key={x.branch}><strong>{x.branch}</strong><span>{x.desc}</span></section>)}</div><aside className="cx-b53-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'metro-zone-designator-board') {
    label = '광역계획권 지정권자판'
    body = <><div className="cx-uio-list">{guide.designators.map(x=><span key={x.scope}><b>{x.scope}</b> → {x.who}</span>)}</div><div className="cx-easement-extra">{guide.facilityRule}</div><aside className="cx-b53-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'metro-plan-content-filter') {
    label = '광역도시계획 내용 필터'
    body = <><div className="cx-fence-row"><section className="is-in"><strong>포함</strong>{guide.included.map(x=><span key={x}>{x}</span>)}</section><section className="is-out"><strong>불포함</strong>{guide.excluded.map(x=><span key={x}>{x}</span>)}</section></div><aside className="cx-b53-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'urban-plan-project-scope-board') {
    label = '도시·군계획사업 범위판'
    body = <><div className="cx-uio-list">{guide.threeTypes.map(x=><span key={x}>{x}</span>)}</div><div className="cx-easement-extra">{guide.lhRule}</div><div className="cx-easement-extra">{guide.vestingRule}</div><aside className="cx-b53-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'survey-exemption-dual-list') {
    label = '기초조사·환경성검토 생략 이중목록'
    body = <><div className="cx-easement-extra">환경성 검토 생략: {guide.environmentalReview.threshold} ({guide.environmentalReview.excludedCases})</div><div className="cx-uio-list">{guide.basicSurvey.map(x=><span key={x}>{x}</span>)}</div><div className="cx-easement-extra">{guide.trap}</div><aside className="cx-b53-note is-alert">{guide.caution}</aside></>
  } else {
    label = '주민의견 청취의무 체크판'
    body = <><div className="cx-fence-row"><section className="is-in"><strong>청취 필요</strong>{guide.required.map(x=><span key={x}>{x}</span>)}</section><section className="is-out"><strong>청취 불요</strong><span>{guide.notRequired}</span></section></div><aside className="cx-b53-note is-alert">{guide.caution}</aside></>
  }
  return <article className="cx-card cx-visual-card cx-visual-card--b53"><SectionBlock label={label} index={5} amended={guide.amended}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function FiftyFourthSixGuide({ guide }) {
  let label = '54차 개념 전용 검증 보드'
  let body
  if (guide.kind === 'hearing-procedure-mixed-board') {
    label = '청문 대상·개별조문 종합판'
    body = <><div className="cx-fence-row"><section className="is-in"><strong>청문 필요</strong>{guide.hearing.required.map(x=><span key={x}>{x}</span>)}</section><section className="is-out"><strong>청문 불요</strong><span>{guide.hearing.notRequired}</span></section></div><div className="cx-uio-list">{guide.extra.map(x=><span key={x}>{x}</span>)}</div><aside className="cx-b54-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'committee-structure-board') {
    label = '도시계획위원회 구성·업무판'
    body = <><div className="cx-uio-list">{guide.structure.map(x=><span key={x}>{x}</span>)}</div><div className="cx-easement-extra">시·군·구도시계획위원회 업무: {guide.localCommitteeDuty.join(', ')}</div><aside className="cx-b54-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'terminology-swap-filter') {
    label = '유사 용어 스왑 필터'
    body = <><div className="cx-fact-qa">{guide.pairs.map(x=><section key={x.term}><strong>{x.term}</strong><span>✓ {x.correct}</span><b>✗ {x.wrong}</b></section>)}</div><div className="cx-uio-list">{guide.facts.map(x=><span key={x}>{x}</span>)}</div><aside className="cx-b54-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'residential-apartment-zone-map') {
    label = '아파트 건축가능 지역 지도'
    body = <><div className="cx-fence-row"><section className="is-in"><strong>건축 가능</strong>{guide.allowed.map(x=><span key={x}>{x}</span>)}</section><section className="is-out"><strong>건축 불가</strong>{guide.notAllowed.map(x=><span key={x}>{x}</span>)}</section></div><div className="cx-easement-extra">{guide.extra}</div><aside className="cx-b54-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'settlement-district-building-list') {
    label = '자연취락지구 건축·지원 목록'
    body = <><div className="cx-fence-row"><section className="is-in"><strong>건축 가능</strong>{guide.allowed.map(x=><span key={x}>{x}</span>)}</section><section className="is-out"><strong>건축 불가</strong>{guide.notAllowed.map(x=><span key={x}>{x}</span>)}</section></div><div className="cx-uio-list">{guide.support.map(x=><span key={x}>✓ {x}</span>)}</div><aside className="cx-b54-note is-alert">{guide.caution}</aside></>
  } else {
    label = '용도지구별 건축제한 매트릭스'
    body = <><div className="cx-uio-list">{guide.rules.map(x=><span key={x.district}><b>{x.district}</b> · {x.rule}</span>)}</div><aside className="cx-b54-note is-alert">{guide.caution}</aside></>
  }
  return <article className="cx-card cx-visual-card cx-visual-card--b54"><SectionBlock label={label} index={5} amended={guide.amended}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function FiftyFifthSixGuide({ guide }) {
  let label = '55차 개념 전용 검증 보드'
  let body
  if (guide.kind === 'location-regulation-zone-list') {
    label = '입지규제최소구역 지정대상 목록'
    body = <><div className="cx-uio-list">{guide.targets.map(x=><span key={x}>{x}</span>)}</div><aside className="cx-b55-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'growth-area-zone-filter') {
    label = '성장관리계획구역 대상지역 필터'
    body = <><div className="cx-fence-row"><section className="is-in"><strong>대상</strong>{guide.included.map(x=><span key={x}>{x}</span>)}</section><section className="is-out"><strong>비대상</strong>{guide.excluded.map(x=><span key={x}>{x}</span>)}</section></div><aside className="cx-b55-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'use-district-definition-card') {
    label = '용도지구 정의 카드'
    body = <><div className="cx-uio-list">{guide.definitionParts.map(x=><span key={x}>{x}</span>)}</div><aside className="cx-b55-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'control-zone-designation-board') {
    label = '시가화조정구역 지정판'
    body = <><div className="cx-anchor-date">{guide.designation}</div><div className="cx-easement-extra">{guide.scale.limit}</div><div className="cx-easement-extra">{guide.scale.exempt}</div><aside className="cx-b55-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'coverage-relaxation-calculator') {
    label = '건폐율 완화 계산기'
    body = <><div className="cx-uio-list">{guide.steps.map(x=><span key={x.label}><b>{x.label}</b> · {x.value}</span>)}</div><aside className="cx-b55-note is-alert">{guide.caution}</aside></>
  } else {
    label = '성장관리계획구역 절차·완화판'
    body = <><div className="cx-uio-list">{guide.procedure.map(x=><span key={x}>{x}</span>)}</div><div className="cx-fact-qa">{guide.relaxation.map(x=><section key={x.zone}><strong>{x.zone}</strong><span>{x.limit}</span></section>)}</div><aside className="cx-b55-note is-alert">{guide.caution}</aside></>
  }
  return <article className="cx-card cx-visual-card cx-visual-card--b55"><SectionBlock label={label} index={5} amended={guide.amended}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function FiftySixthSixGuide({ guide }) {
  let label = '56차 개념 전용 검증 보드'
  let body
  if (guide.kind === 'facility-project-authority-board') {
    label = '시행자 직접시행·집행계획판'
    body = <><div className="cx-easement-extra">{guide.direct}</div><div className="cx-uio-list">{guide.schedule.map(x=><span key={x}>{x}</span>)}</div><div className="cx-uio-list">{guide.flexibility.map(x=><span key={x}>{x}</span>)}</div><aside className="cx-b56-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'density-district-detail-board') {
    label = '개발밀도관리구역 세부판'
    body = <><div className="cx-uio-list">{guide.facts.map(x=><span key={x}>{x}</span>)}</div><div className="cx-easement-extra">{guide.core}</div><aside className="cx-b56-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'coverage-relaxation-zone-filter') {
    label = '건폐율 완화 대상지역 필터'
    body = <><div className="cx-fence-row"><section className="is-in"><strong>대상</strong>{guide.included.map(x=><span key={x}>{x}</span>)}</section><section className="is-out"><strong>제외</strong>{guide.excluded.map(x=><span key={x}>{x}</span>)}</section></div><aside className="cx-b56-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'permit-area-threshold-board') {
    label = '토지거래허가 기준면적판'
    body = <><div className="cx-anchor-date">{guide.threshold.zone} · {guide.threshold.land} · {guide.threshold.area}</div><div className="cx-easement-extra">{guide.caveat}</div><aside className="cx-b56-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'facility-classification-tree') {
    label = '기반시설 7대분류 나뭇가지도'
    body = <><div className="cx-uio-list">{guide.categories.map(x=><span key={x}>{x}</span>)}</div><div className="cx-fact-qa">{guide.tricky.map(x=><section key={x.facility}><strong>{x.facility}</strong><span>{x.category}</span></section>)}</div><aside className="cx-b56-note is-alert">{guide.caution}</aside></>
  } else {
    label = '도시지역 외 완화 특례판'
    body = <><div className="cx-uio-list">{guide.relax.map(x=><span key={x.item}><b>{x.item}</b> · {x.ratio}</span>)}</div><div className="cx-fact-qa"><section><strong>허용</strong><span>{guide.apartments.allowedIn}</span></section><section><strong>불허</strong><span>{guide.apartments.notAllowedIn}</span></section></div><aside className="cx-b56-note is-alert">{guide.caution}</aside></>
  }
  return <article className="cx-card cx-visual-card cx-visual-card--b56"><SectionBlock label={label} index={5} amended={guide.amended}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function FiftySeventhSixGuide({ guide }) {
  let label = '57차 개념 전용 검증 보드'
  let body
  if (guide.kind === 'district-unit-plan-definition-card') {
    label = '지구단위계획 정의 카드'
    body = <><div className="cx-uio-list">{guide.definitionParts.map(x=><span key={x}>{x}</span>)}</div><div className="cx-easement-extra">존재하지 않는 용어: {guide.notRealTerms.join(', ')}</div><aside className="cx-b57-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'location-regulation-special-rules-board') {
    label = '입지규제최소구역 특례판'
    body = <><div className="cx-uio-list">{guide.rules.map(x=><span key={x}>{x}</span>)}</div><div className="cx-easement-extra">{guide.notIncluded}</div><aside className="cx-b57-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'growth-plan-content-board') {
    label = '성장관리계획 내용·완화판'
    body = <><div className="cx-easement-extra">{guide.required}</div><div className="cx-easement-extra">{guide.excluded}</div><div className="cx-easement-extra">{guide.incentive}</div><aside className="cx-b57-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'district-unit-zone-eligibility-board') {
    label = '지구단위계획구역 지정대상판'
    body = <><div className="cx-uio-list">{guide.eligible.map(x=><span key={x}>{x}</span>)}</div><div className="cx-easement-extra">{guide.ratio}</div><aside className="cx-b57-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'plan-decision-expiry-timeline') {
    label = '지구단위계획 실효기간 비교판'
    body = <><div className="cx-fact-qa">{guide.compare.map(x=><section key={x.type}><strong>{x.type}</strong><span>{x.period}</span></section>)}</div><aside className="cx-b57-note is-alert">{guide.caution}</aside></>
  } else {
    label = '특별건축구역 의제 필터'
    body = <><div className="cx-fence-row"><section className="is-in"><strong>의제 O</strong>{guide.deemed.map(x=><span key={x}>{x}</span>)}</section><section className="is-out"><strong>의제 X</strong>{guide.notDeemed.map(x=><span key={x}>{x}</span>)}</section></div><aside className="cx-b57-note is-alert">{guide.caution}</aside></>
  }
  return <article className="cx-card cx-visual-card cx-visual-card--b57"><SectionBlock label={label} index={5} amended={guide.amended}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function FiftyEighthSixGuide({ guide }) {
  let label = '58차 개념 전용 검증 보드'
  let body
  if (guide.kind === 'joint-committee-scope-board') {
    label = '공동위원회 심의 범위판'
    body = <><div className="cx-anchor-date">{guide.required}</div><div className="cx-uio-list">{guide.exempt.map(x=><span key={x}>{x}</span>)}</div><aside className="cx-b58-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'permit-criteria-filter') {
    label = '개발행위허가 기준 필터'
    body = <><div className="cx-fence-row"><section className="is-in"><strong>기준 해당</strong>{guide.criteria.map(x=><span key={x}>{x}</span>)}</section><section className="is-out"><strong>기준 아님</strong><span>{guide.notCriteria}</span></section></div><aside className="cx-b58-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'facility-vesting-matrix') {
    label = '공공시설 귀속 매트릭스'
    body = <><div className="cx-fact-qa">{guide.matrix.map(x=><section key={x.who}><strong>{x.who}</strong><span>신규: {x.newFacility}</span><b>기존: {x.oldFacility}</b></section>)}</div><div className="cx-uio-list">{guide.extra.map(x=><span key={x}>{x}</span>)}</div><aside className="cx-b58-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'facility-charge-numbers-board') {
    label = '기반시설연동제 숫자판'
    body = <><div className="cx-uio-list">{guide.numbers.map(x=><span key={x.item}><b>{x.item}</b> · {x.rule}</span>)}</div><aside className="cx-b58-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'scale-exemption-list') {
    label = '개발행위 규모제한 예외 목록'
    body = <><div className="cx-uio-list">{guide.exempt.map(x=><span key={x}>{x}</span>)}</div><div className="cx-easement-extra">제외: {guide.notExempt}</div><aside className="cx-b58-note is-alert">{guide.caution}</aside></>
  } else {
    label = '도시개발구역 해제 타임라인'
    body = <><div className="cx-handoff-line">{guide.timeline.map((x,i)=><span key={x.step}><b>{i+1}</b>{x.step} → {x.next}</span>)}</div><div className="cx-easement-extra">{guide.addableLater}</div><div className="cx-easement-extra">{guide.mustFromStart}</div><aside className="cx-b58-note is-alert">{guide.caution}</aside></>
  }
  return <article className="cx-card cx-visual-card cx-visual-card--b58"><SectionBlock label={label} index={5} amended={guide.amended}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function FiftyNinthSixGuide({ guide }) {
  let label = '59차 개념 전용 검증 보드'
  let body
  if (guide.kind === 'implementer-change-board') {
    label = '시행자 변경사유·지정대상판'
    body = <><div className="cx-uio-list">{guide.reasons.map(x=><span key={x}>{x}</span>)}</div><div className="cx-easement-extra">{guide.notReason}</div><div className="cx-fact-qa"><section><strong>지정 가능</strong><span>{guide.agencies.allowed}</span></section><section><strong>지정 불가</strong><span>{guide.agencies.notAllowed}</span></section></div><aside className="cx-b59-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'implementation-method-flow') {
    label = '시행방식 변경 흐름도'
    body = <><div className="cx-handoff-line">{guide.flow.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div><div className="cx-easement-extra">{guide.extra}</div><aside className="cx-b59-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'expropriation-method-board') {
    label = '수용·사용 방식 요건판'
    body = <><div className="cx-anchor-date">{guide.who}</div><div className="cx-easement-extra">{guide.requirement}</div><div className="cx-easement-extra">{guide.extra}</div><aside className="cx-b59-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'original-land-supply-board') {
    label = '원형지 공급·개발판'
    body = <><div className="cx-uio-list">{guide.facts.map(x=><span key={x.item}><b>{x.item}</b> · {x.value}</span>)}</div><aside className="cx-b59-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'implementation-plan-approval-board') {
    label = '실시계획 작성·인가판'
    body = <><div className="cx-uio-list">{guide.procedure.map(x=><span key={x}>{x}</span>)}</div><div className="cx-easement-extra">{guide.changeThreshold}</div><aside className="cx-b59-note is-alert">{guide.caution}</aside></>
  } else {
    label = '준공검사·체비지판'
    body = <><div className="cx-anchor-date">{guide.reserveLand}</div><div className="cx-fact-qa">{guide.procedure.map(x=><section key={x.who}><strong>{x.who}</strong><span>{x.rule}</span></section>)}</div><aside className="cx-b59-note is-alert">{guide.caution}</aside></>
  }
  return <article className="cx-card cx-visual-card cx-visual-card--b59"><SectionBlock label={label} index={5} amended={guide.amended}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function SixtiethSixGuide({ guide }) {
  let label = '60차 개념 전용 검증 보드'
  let body
  if (guide.kind === 'plan-change-consent-filter') {
    label = '환지방식 개발계획 변경 동의 필터'
    body = <><div className="cx-anchor-date">{guide.consentRequired}</div><div className="cx-uio-list">{guide.minorChanges.map(x=><span key={x}>{x}</span>)}</div><aside className="cx-b60-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'agency-delegation-scope-board') {
    label = '사업 대행 범위판'
    body = <><div className="cx-fence-row"><section className="is-in"><strong>대행 가능</strong>{guide.allowed.map(x=><span key={x}>{x}</span>)}</section><section className="is-out"><strong>대행 불가</strong><span>{guide.notAllowed}</span></section></div><aside className="cx-b60-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'cost-sharing-rules-board') {
    label = '비용 부담 규정판'
    body = <><div className="cx-uio-list">{guide.rules.map(x=><span key={x.item}><b>{x.item}</b> · {x.rule}</span>)}</div><aside className="cx-b60-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'permission-acts-filter') {
    label = '허가대상 행위 필터'
    body = <><div className="cx-fence-row"><section className="is-in"><strong>허가 필요</strong>{guide.required.map(x=><span key={x}>{x}</span>)}</section><section className="is-out"><strong>허가 불요</strong><span>{guide.notRequired}</span></section></div><aside className="cx-b60-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'substitution-bond-board') {
    label = '토지상환채권 요건판'
    body = <><div className="cx-uio-list">{guide.facts.map(x=><span key={x.item}><b>{x.item}</b> · {x.rule}</span>)}</div><aside className="cx-b60-note is-alert">{guide.caution}</aside></>
  } else {
    label = '조합 임원·대의원회판'
    body = <><div className="cx-easement-extra">{guide.disqualify}</div><div className="cx-easement-extra">{guide.representation}</div><div className="cx-anchor-date">{guide.assembly.threshold} · {guide.assembly.ratio}</div><div className="cx-uio-list">{guide.cannotDelegate.map(x=><span key={x}>대행 불가: {x}</span>)}</div><aside className="cx-b60-note is-alert">{guide.caution}</aside></>
  }
  return <article className="cx-card cx-visual-card cx-visual-card--b60"><SectionBlock label={label} index={5} amended={guide.amended}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function SixtyFirstSixGuide({ guide }) {
  let label = '61차 개념 전용 검증 보드'
  let body
  if (guide.kind === 'membership-voting-board') {
    label = '조합원 자격·의결권판'
    body = <><div className="cx-uio-list">{guide.facts.map(x=><span key={x}>{x}</span>)}</div><aside className="cx-b61-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'delegated-agent-scope-filter') {
    label = '사업대행 시행자 필터'
    body = <><div className="cx-fence-row"><section className="is-in"><strong>대행 가능 시행자</strong>{guide.allowed.map(x=><span key={x}>{x}</span>)}</section><section className="is-out"><strong>대행 불가</strong>{guide.notAllowed.map(x=><span key={x}>{x}</span>)}</section></div><aside className="cx-b61-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'replot-type-comparison') {
    label = '평면·입체 환지 비교판'
    body = <><div className="cx-fact-qa">{guide.types.map(x=><section key={x.name}><strong>{x.name}</strong><span>{x.desc}</span></section>)}</div><aside className="cx-b61-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'burden-rate-formula-calculator') {
    label = '토지부담률 계산기'
    body = <><aside className="cx-formula-board">{guide.formula}</aside><div className="cx-uio-list"><span>{guide.example.region}</span><span>{guide.example.vested}</span><span>{guide.example.owner}</span><span>{guide.example.reserve}</span><span>{guide.example.result}</span></div><aside className="cx-b61-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'joint-agreement-clause-filter') {
    label = '공동시행 규약 기재사항 필터'
    body = <><div className="cx-fence-row"><section className="is-in"><strong>환지방식 전용</strong>{guide.replotOnly.map(x=><span key={x}>{x}</span>)}</section><section className="is-out"><strong>공통 일반사항</strong><span>{guide.general}</span></section></div><aside className="cx-b61-note is-alert">{guide.caution}</aside></>
  } else {
    label = '환지처분 절차·효과 타임라인'
    body = <><div className="cx-handoff-line">{guide.timeline.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div><div className="cx-uio-list">{guide.effects.map(x=><span key={x}>{x}</span>)}</div><aside className="cx-b61-note is-alert">{guide.caution}</aside></>
  }
  return <article className="cx-card cx-visual-card cx-visual-card--b61"><SectionBlock label={label} index={5} amended={guide.amended}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function SixtySecondSixGuide({ guide }) {
  let label = '62차 개념 전용 검증 보드'
  let body
  if (guide.kind === 'concurrent-project-implementer-filter') {
    label = '병행시행 특례 시행자 필터'
    body = <><div className="cx-fence-row"><section className="is-in"><strong>지정 가능</strong>{guide.allowed.map(x=><span key={x}>{x}</span>)}</section><section className="is-out"><strong>지정 불가</strong><span>{guide.notAllowed}</span></section></div><aside className="cx-b62-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'minor-change-numbers-board') {
    label = '경미한 변경 숫자판'
    body = <><div className="cx-uio-list">{guide.items.map(x=><span key={x.item}><b>{x.item}</b> · {x.ratio}</span>)}</div><aside className="cx-b62-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'proportion-rate-calculator') {
    label = '비례율 계산기'
    body = <><aside className="cx-formula-board">{guide.formula}</aside><div className="cx-uio-list"><span>{guide.example.cost}</span><span>{guide.example.before}</span><span>{guide.example.after}</span><span>{guide.example.result}</span></div><aside className="cx-b62-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'liquidation-money-rules-board') {
    label = '청산금 규정판'
    body = <><div className="cx-uio-list">{guide.rules.map(x=><span key={x.item}><b>{x.item}</b> · {x.rule}</span>)}</div><aside className="cx-b62-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'consent-counting-rules-board') {
    label = '동의자 수 산정판'
    body = <><div className="cx-uio-list">{guide.rules.map(x=><span key={x}>{x}</span>)}</div><aside className="cx-b62-note is-alert">{guide.caution}</aside></>
  } else {
    label = '환지 예정지 효과판'
    body = <><div className="cx-uio-list">{guide.effects.map(x=><span key={x}>{x}</span>)}</div><aside className="cx-b62-note is-alert">{guide.caution}</aside></>
  }
  return <article className="cx-card cx-visual-card cx-visual-card--b62"><SectionBlock label={label} index={5} amended={guide.amended}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function SixtyThirdSixGuide({ guide }) {
  let label = '63차 개념 전용 검증 보드'
  let body
  if (guide.kind === 'bond-redemption-board') {
    label = '도시개발채권 상환·중도상환판'
    body = <><div className="cx-anchor-date">{guide.period}</div><div className="cx-easement-extra">{guide.earlyRedemption}</div><div className="cx-easement-extra">{guide.costRule}</div><aside className="cx-b63-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'facility-exception-filter') {
    label = '정비기반·공동이용시설 예외 필터'
    body = <><div className="cx-fence-row"><section className="is-in"><strong>정비기반시설</strong>{guide.infra.included.map(x=><span key={x}>{x}</span>)}</section><section className="is-out"><strong>제외</strong><span>{guide.infra.excluded}</span></section></div><div className="cx-fence-row"><section className="is-in"><strong>공동이용시설</strong>{guide.communal.included.map(x=><span key={x}>{x}</span>)}</section><section className="is-out"><strong>제외</strong><span>{guide.communal.excluded}</span></section></div><aside className="cx-b63-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'safety-diagnosis-board') {
    label = '재건축 안전진단판'
    body = <><div className="cx-anchor-date">{guide.timing}</div><div className="cx-easement-extra">{guide.exempt}</div><div className="cx-uio-list">{guide.criteria.map(x=><span key={x}>{x}</span>)}</div><div className="cx-easement-extra">{guide.reportRule}</div><aside className="cx-b63-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'completion-procedure-timeline') {
    label = '준공인가·이전고시 절차판'
    body = <><div className="cx-handoff-line">{guide.procedure.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div><div className="cx-uio-list">{guide.timing.map(x=><span key={x}>{x}</span>)}</div><div className="cx-easement-extra">{guide.note}</div><aside className="cx-b63-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'subscription-notice-board') {
    label = '분양신청·토지등소유자 범위판'
    body = <><div className="cx-uio-list">{guide.timeline.map(x=><span key={x}>{x}</span>)}</div><div className="cx-easement-extra">{guide.noticeCommon}</div><div className="cx-fact-qa"><section><strong>재개발</strong><span>{guide.ownerScope.redevelopment}</span></section><section><strong>재건축</strong><span>{guide.ownerScope.reconstruction}</span></section></div><aside className="cx-b63-note is-alert">{guide.caution}</aside></>
  } else {
    label = '청산금·비용부담 규정판'
    body = <><div className="cx-uio-list">{guide.rules.map(x=><span key={x.item}><b>{x.item}</b> · {x.rule}</span>)}</div><aside className="cx-b63-note is-alert">{guide.caution}</aside></>
  }
  return <article className="cx-card cx-visual-card cx-visual-card--b63"><SectionBlock label={label} index={5} amended={guide.amended}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function SixtyFourthSixGuide({ guide }) {
  let label = '64차 개념 전용 검증 보드'
  let body
  if (guide.kind === 'small-housing-supply-board') {
    label = '국민주택규모 주택 공급·인수판'
    body = <><div className="cx-handoff-line">{guide.priority.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div><div className="cx-uio-list">{guide.process.map(x=><span key={x}>{x}</span>)}</div><div className="cx-easement-extra">{guide.ratio}</div><aside className="cx-b64-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'lh-implementation-regulation-board') {
    label = 'LH 단독시행 규정 기재사항판'
    body = <><div className="cx-fence-row"><section className="is-in"><strong>필수 기재</strong>{guide.required.map(x=><span key={x}>{x}</span>)}</section><section className="is-out"><strong>기재 불요</strong><span>{guide.notRequired}</span></section></div><aside className="cx-b64-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'land-lease-housing-numbers-board') {
    label = '토지임대부 분양주택 숫자판'
    body = <><div className="cx-uio-list">{guide.numbers.map(x=><span key={x.item}><b>{x.item}</b> · {x.value}</span>)}</div><div className="cx-easement-extra">{guide.condition}</div><aside className="cx-b64-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'officer-qualification-board') {
    label = '조합 임원 자격·임기판'
    body = <><div className="cx-uio-list">{guide.facts.map(x=><span key={x}>{x}</span>)}</div><aside className="cx-b64-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'representative-delegation-scope-board') {
    label = '대의원회 대행 범위판'
    body = <><div className="cx-anchor-date">{guide.convene}</div><div className="cx-fence-row"><section className="is-in"><strong>대행 가능</strong>{guide.delegable.map(x=><span key={x}>{x}</span>)}</section><section className="is-out"><strong>대행 불가</strong><span>{guide.notDelegable}</span></section></div><aside className="cx-b64-note is-alert">{guide.caution}</aside></>
  } else {
    label = '추진위원회 통지의무 필터'
    body = <><div className="cx-anchor-date">{guide.required}</div><div className="cx-uio-list">{guide.notRequired.map(x=><span key={x}>{x}</span>)}</div><aside className="cx-b64-note is-alert">{guide.caution}</aside></>
  }
  return <article className="cx-card cx-visual-card cx-visual-card--b64"><SectionBlock label={label} index={5} amended={guide.amended}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function SixtyFifthSixGuide({ guide }) {
  let label = '65차 개념 전용 검증 보드'
  let body
  if (guide.kind === 'resident-assembly-composition-board') {
    label = '주민대표회의 구성·운영판'
    body = <><div className="cx-anchor-date">{guide.formation}</div><div className="cx-easement-extra">{guide.composition}</div><div className="cx-easement-extra">{guide.role}</div><aside className="cx-b65-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'implementation-method-validity-filter') {
    label = '정비사업 시행방법 유효성 필터'
    body = <><div className="cx-fence-row"><section className="is-in"><strong>주거환경개선 가능</strong>{guide.improvement.allowed.map(x=><span key={x}>{x}</span>)}</section><section className="is-out"><strong>불가</strong><span>{guide.improvement.notAllowed}</span></section></div><div className="cx-easement-extra">재개발: {guide.redevelopment}</div><aside className="cx-b65-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'common-utility-cost-board') {
    label = '비용부담·공동구 비용판'
    body = <><div className="cx-uio-list">{guide.burden.map(x=><span key={x}>{x}</span>)}</div><div className="cx-easement-extra">{guide.commonUtility.prepay}</div><div className="cx-easement-extra">{guide.commonUtility.cycle}</div><aside className="cx-b65-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'rental-housing-acquisition-board') {
    label = '임대주택 인수·공급판'
    body = <><div className="cx-anchor-date">{guide.priority}</div><div className="cx-easement-extra">{guide.surplus}</div><div className="cx-easement-extra">{guide.twoUnit}</div><aside className="cx-b65-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'announcement-content-filter') {
    label = '분양공고 기재사항 필터'
    body = <><div className="cx-fence-row"><section className="is-in"><strong>공고 포함</strong>{guide.included.map(x=><span key={x}>{x}</span>)}</section><section className="is-out"><strong>공고 제외</strong><span>{guide.excluded}</span></section></div><aside className="cx-b65-note is-alert">{guide.caution}</aside></>
  } else {
    label = '손실보상 협의대상 필터'
    body = <><div className="cx-fence-row"><section className="is-in"><strong>협의 대상</strong>{guide.included.map(x=><span key={x}>{x}</span>)}</section><section className="is-out"><strong>대상 제외</strong><span>{guide.excluded}</span></section></div><aside className="cx-b65-note is-alert">{guide.caution}</aside></>
  }
  return <article className="cx-card cx-visual-card cx-visual-card--b65"><SectionBlock label={label} index={5} amended={guide.amended}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function SixtySixthSixGuide({ guide }) {
  let label = '66차 개념 전용 검증 보드'
  let body
  if (guide.kind === 'temporary-housing-obligation-filter') {
    label = '임시거주시설 의무 필터'
    body = <><div className="cx-fence-row"><section className="is-in"><strong>적용</strong>{guide.applies.map(x=><span key={x}>{x}</span>)}</section><section className="is-out"><strong>적용 제외</strong><span>{guide.notApplies}</span></section></div><div className="cx-easement-extra">{guide.measures}</div><aside className="cx-b66-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'landscaping-exemption-filter') {
    label = '조경 의무 면제 필터'
    body = <><div className="cx-fence-row"><section className="is-in"><strong>면제</strong>{guide.exempt.map(x=><span key={x}>{x}</span>)}</section><section className="is-out"><strong>면제 아님</strong><span>{guide.notExempt}</span></section></div><aside className="cx-b66-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'building-terminology-board') {
    label = '건축법 용어 정의판'
    body = <><div className="cx-fact-qa">{guide.terms.map(x=><section key={x.term}><strong>{x.term}</strong><span>{x.desc}</span></section>)}</div><div className="cx-easement-extra">{guide.traps}</div><aside className="cx-b66-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'building-act-exclusion-filter') {
    label = '건축법 적용제외 필터'
    body = <><div className="cx-fence-row"><section className="is-out"><strong>적용 제외</strong>{guide.excluded.map(x=><span key={x}>{x}</span>)}</section><section className="is-in"><strong>적용 대상</strong><span>{guide.included}</span></section></div><aside className="cx-b66-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'multi-use-building-criteria-board') {
    label = '다중이용 건축물 기준판'
    body = <><div className="cx-uio-list">{guide.uses.map(x=><span key={x}>{x}</span>)}</div><div className="cx-easement-extra">{guide.scale}</div><div className="cx-easement-extra">제외: {guide.excluded}</div><aside className="cx-b66-note is-alert">{guide.caution}</aside></>
  } else {
    label = '특수구조 건축물 기준판'
    body = <><div className="cx-uio-list">{guide.criteria.map(x=><span key={x}>{x}</span>)}</div><div className="cx-easement-extra">{guide.notExpanded}</div><aside className="cx-b66-note is-alert">{guide.caution}</aside></>
  }
  return <article className="cx-card cx-visual-card cx-visual-card--b66"><SectionBlock label={label} index={5} amended={guide.amended}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function SixtySeventhSixGuide({ guide }) {
  let label = '67차 개념 전용 검증 보드'
  let body
  if (guide.kind === 'structural-safety-submission-board') {
    label = '구조안전 확인서류 제출대상판'
    body = <><div className="cx-uio-list">{guide.required.map(x=><span key={x}>{x}</span>)}</div><div className="cx-easement-extra">{guide.exemption}</div><aside className="cx-b67-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'primary-structural-filter') {
    label = '주요구조부 범위 필터'
    body = <><div className="cx-fence-row"><section className="is-in"><strong>주요구조부</strong>{guide.included.map(x=><span key={x}>{x}</span>)}</section><section className="is-out"><strong>제외</strong>{guide.excluded.map(x=><span key={x}>{x}</span>)}</section></div><aside className="cx-b67-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'evacuation-zone-numbers-board') {
    label = '초고층건축물 피난안전구역판'
    body = <><div className="cx-anchor-date">{guide.classification}</div><div className="cx-easement-extra">{guide.spacing}</div><aside className="cx-b67-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'structure-report-threshold-board') {
    label = '대지조성용 공작물 신고기준판'
    body = <><div className="cx-uio-list">{guide.thresholds.map(x=><span key={x.item}><b>{x.item}</b> · {x.rule}</span>)}</div><aside className="cx-b67-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'floating-relaxation-filter') {
    label = '수면 위 건축물 완화 필터'
    body = <><div className="cx-fence-row"><section className="is-in"><strong>완화 가능</strong>{guide.relaxable.map(x=><span key={x}>{x}</span>)}</section><section className="is-out"><strong>완화 불가</strong><span>{guide.notRelaxable}</span></section></div><aside className="cx-b67-note is-alert">{guide.caution}</aside></>
  } else {
    label = '건축물대장 정비의무 트리거판'
    body = <><div className="cx-uio-list">{guide.triggers.map(x=><span key={x}>{x}</span>)}</div><div className="cx-easement-extra">{guide.excluded}</div><aside className="cx-b67-note is-alert">{guide.caution}</aside></>
  }
  return <article className="cx-card cx-visual-card cx-visual-card--b67"><SectionBlock label={label} index={5} amended={guide.amended}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function SixtyNinthSixGuide({ guide }) {
  let label = '69차 개념 전용 검증 보드'
  let body
  if (guide.kind === 'special-zone-exemption-filter') {
    label = '특별건축구역 적용 배제 필터'
    body = <><div className="cx-fence-row"><section className="is-in"><strong>적용 배제 가능</strong>{guide.exemptable.map(x=><span key={x}>{x}</span>)}</section><section className="is-out"><strong>배제 불가(그대로 적용)</strong>{guide.notExemptable.map(x=><span key={x}>{x}</span>)}</section></div><aside className="cx-b69-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'dispute-committee-party-filter') {
    label = '건축분쟁위원회 대상 필터'
    body = <><div className="cx-fence-row"><section className="is-in"><strong>대상</strong>{guide.inScope.map(x=><span key={x}>{x}</span>)}</section><section className="is-out"><strong>제외</strong><span>{guide.outScope}</span></section></div><div className="cx-handoff-line">{guide.extra}</div><aside className="cx-b69-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'safety-evaluation-process-board') {
    label = '안전영향평가 절차판'
    body = <><div className="cx-uio-list">{guide.steps.map(x=><span key={x.item}><b>{x.item}</b> · {x.rule}</span>)}</div><div className="cx-easement-extra">{guide.excludedReview}</div><aside className="cx-b69-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'public-open-space-rules-board') {
    label = '공개공지 설치·이용판'
    body = <><div className="cx-fence-row"><section className="is-in"><strong>설치 대상지역</strong>{guide.scope.in.map(x=><span key={x}>{x}</span>)}</section><section className="is-out"><strong>대상 아님</strong><span>{guide.scope.out}</span></section></div><div className="cx-uio-list">{guide.rules.map(x=><span key={x}>{x}</span>)}</div><aside className="cx-b69-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'exit-seismic-threshold-board') {
    label = '출구·내진능력 기준판'
    body = <><div className="cx-uio-list">{guide.thresholds.map(x=><span key={x.item}><b>{x.item}</b> · {x.rule}</span>)}</div><aside className="cx-b69-note is-alert">{guide.caution}</aside></>
  } else {
    label = '가로구역 높이제한 고려요소판'
    body = <><div className="cx-uio-list">{guide.factors.map(x=><span key={x}>{x}</span>)}</div><aside className="cx-b69-note is-alert">{guide.caution}</aside></>
  }
  return <article className="cx-card cx-visual-card cx-visual-card--b69"><SectionBlock label={label} index={5} amended={guide.amended}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function SeventiethSixGuide({ guide }) {
  let label = '70차 개념 전용 검증 보드'
  let body
  if (guide.kind === 'housing-bond-issuer-board') {
    label = '주택상환사채 발행권자판'
    body = <><div className="cx-uio-list">{guide.issuers.map(x=><span key={x}>{x}</span>)}</div><div className="cx-easement-extra">{guide.rules.join(' · ')}</div><aside className="cx-b70-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'business-registration-exemption-filter') {
    label = '주택건설사업자 등록 예외 필터'
    body = <><div className="cx-fence-row"><section className="is-in"><strong>등록 의무</strong><span>{guide.mustRegister}</span></section><section className="is-out"><strong>등록 예외</strong>{guide.exempt.map(x=><span key={x}>{x}</span>)}</section></div><aside className="cx-b70-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'resale-restriction-consent-board') {
    label = '전매제한 예외·동의요건판'
    body = <><div className="cx-uio-list">{guide.exceptions.map(x=><span key={x}>{x}</span>)}</div><aside className="cx-b70-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'housing-supply-rules-board') {
    label = '주택공급 세부규정판'
    body = <><div className="cx-uio-list">{guide.rules.map(x=><span key={x.item}><b>{x.item}</b> · {x.rule}</span>)}</div><aside className="cx-b70-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'post-inspection-sale-claim-board') {
    label = '사용검사 후 매도청구판'
    body = <><div className="cx-anchor-date">{guide.areaLimit}</div><div className="cx-easement-extra">{guide.deadline}</div><aside className="cx-b70-note is-alert">{guide.caution}</aside></>
  } else {
    label = '주택상환사채 발행한도판'
    body = <><div className="cx-uio-list">{guide.limits.map(x=><span key={x.item}><b>{x.item}</b> · {x.rule}</span>)}</div><aside className="cx-b70-note is-alert">{guide.caution}</aside></>
  }
  return <article className="cx-card cx-visual-card cx-visual-card--b70"><SectionBlock label={label} index={5} amended={guide.amended}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function SeventyFirstSixGuide({ guide }) {
  let label = '71차 개념 전용 검증 보드'
  let body
  if (guide.kind === 'remodeling-approval-board') {
    label = '리모델링 허가·동의율판'
    body = <><div className="cx-uio-list">{guide.facts.map(x=><span key={x.item}><b>{x.item}</b> · {x.rule}</span>)}</div><aside className="cx-b71-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'supervisor-duty-timeline-board') {
    label = '감리자 의무·제재 타임라인'
    body = <><div className="cx-uio-list">{guide.timeline.map(x=><span key={x.item}><b>{x.item}</b> · {x.rule}</span>)}</div><aside className="cx-b71-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'purchase-price-formula-board') {
    label = '매입금액 산정 공식판'
    body = <><div className="cx-formula-board">{guide.formula}</div><div className="cx-easement-extra">{guide.conditions}</div><div className="cx-uio-list">{guide.notes.map(x=><span key={x}>{x}</span>)}</div><aside className="cx-b71-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'penalty-vs-fine-filter') {
    label = '징역·벌금 vs 과태료 필터'
    body = <><div className="cx-fence-row"><section className="is-in"><strong>징역·벌금</strong><span>{guide.criminal}</span></section><section className="is-out"><strong>과태료</strong>{guide.fineOnly.map(x=><span key={x}>{x}</span>)}</section></div><aside className="cx-b71-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'use-inspection-applicant-board') {
    label = '사용검사권자·예외 신청권자판'
    body = <><div className="cx-easement-extra"><b>{guide.inspector.normal}</b> · {guide.inspector.exception}</div><div className="cx-anchor-date">{guide.normal}</div><div className="cx-fence-row"><section className="is-in"><strong>파산 시 신청 가능</strong>{guide.exceptionOk.map(x=><span key={x}>{x}</span>)}</section><section className="is-out"><strong>제외</strong><span>{guide.exceptionExcluded}</span></section></div><aside className="cx-b71-note is-alert">{guide.caution}</aside></>
  } else {
    label = '입주예정자 사전방문 타임라인'
    body = <><div className="cx-uio-list">{guide.timeline.map(x=><span key={x.item}><b>{x.item}</b> · {x.rule}</span>)}</div><aside className="cx-b71-note is-alert">{guide.caution}</aside></>
  }
  return <article className="cx-card cx-visual-card cx-visual-card--b71"><SectionBlock label={label} index={5} amended={guide.amended}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function SeventySecondSixGuide({ guide }) {
  let label = '72차 개념 전용 검증 보드'
  let body
  if (guide.kind === 'subscription-savings-notice-board') {
    label = '입주자저축 통보의무판'
    body = <><div className="cx-uio-list">{guide.facts.map(x=><span key={x}>{x}</span>)}</div><aside className="cx-b72-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'quality-panel-numbers-board') {
    label = '품질점검단 숫자 정정판'
    body = <><div className="cx-uio-list">{guide.facts.map(x=><span key={x.item}><b>{x.item}</b> · {x.rule}</span>)}</div><aside className="cx-b72-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'farmer-recognition-or-board') {
    label = '농업인 인정 OR조건판'
    body = <><div className="cx-uio-list">{guide.orPairs.map(x=><span key={x.pair}><b>{x.pair}</b> · {x.example}</span>)}</div><aside className="cx-b72-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'farmland-lease-term-board') {
    label = '농지 임대차 기간·권한판'
    body = <><div className="cx-uio-list">{guide.facts.map(x=><span key={x}>{x}</span>)}</div><aside className="cx-b72-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'acquisition-certificate-exemption-filter') {
    label = '농지취득자격증명 면제 필터'
    body = <><div className="cx-fence-row"><section className="is-in"><strong>증명 면제</strong>{guide.exempt.map(x=><span key={x}>{x}</span>)}</section><section className="is-out"><strong>증명 필요</strong><span>{guide.notExempt}</span></section></div><aside className="cx-b72-note is-alert">{guide.caution}</aside></>
  } else {
    label = '비자경 소유 예외 필터'
    body = <><div className="cx-fence-row"><section className="is-in"><strong>자경 없이 소유 가능</strong>{guide.exempt.map(x=><span key={x}>{x}</span>)}</section><section className="is-out"><strong>소유 불가</strong><span>{guide.notExempt}</span></section></div><aside className="cx-b72-note is-alert">{guide.caution}</aside></>
  }
  return <article className="cx-card cx-visual-card cx-visual-card--b72"><SectionBlock label={label} index={5} amended={guide.amended}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function SeventyThirdSixGuide({ guide }) {
  let label = '73차 개념 전용 검증 보드'
  let body
  if (guide.kind === 'promotion-area-exclusion-filter') {
    label = '농업진흥지역 지정 필터'
    body = <><div className="cx-fence-row"><section className="is-out"><strong>지정 불가</strong><span>{guide.excluded}</span></section><section className="is-in"><strong>지정 가능</strong>{guide.included.map(x=><span key={x}>{x}</span>)}</section></div><aside className="cx-b73-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'proxy-cultivator-rules-board') {
    label = '유휴농지 대리경작 규칙판'
    body = <><div className="cx-uio-list">{guide.rules.map(x=><span key={x}>{x}</span>)}</div><aside className="cx-b73-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'farmland-register-numbers-board') {
    label = '농지대장 보존·신청기한판'
    body = <><div className="cx-uio-list">{guide.numbers.map(x=><span key={x.item}><b>{x.item}</b> · {x.rule}</span>)}</div><aside className="cx-b73-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'conversion-exemption-filter') {
    label = '농지전용 해당여부 필터'
    body = <><div className="cx-fence-row"><section className="is-in"><strong>전용 아님</strong>{guide.notConversion.map(x=><span key={x}>{x}</span>)}</section><section className="is-out"><strong>전용/허가 대상</strong><span>{guide.isConversion}</span></section></div><aside className="cx-b73-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'temp-use-report-filter') {
    label = '타용도 일시사용신고 필터'
    body = <><div className="cx-fence-row"><section className="is-in"><strong>신고 대상</strong>{guide.reportable.map(x=><span key={x}>{x}</span>)}</section><section className="is-out"><strong>신고 대상 아님</strong><span>{guide.notReportable}</span></section></div><aside className="cx-b73-note is-alert">{guide.caution}</aside></>
  } else {
    label = '성토 신고 면제 조건판'
    body = <><div className="cx-formula-board">{guide.conditions}</div><aside className="cx-b73-note is-alert">{guide.caution}</aside></>
  }
  return <article className="cx-card cx-visual-card cx-visual-card--b73"><SectionBlock label={label} index={5} amended={guide.amended}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function SixtyEighthSixGuide({ guide }) {
  let label = '68차 개념 전용 검증 보드'
  let body
  if (guide.kind === 'evacuation-passage-width-board') {
    label = '대지 안 통로 유효너비판'
    body = <><div className="cx-anchor-date">{guide.generalWidth}</div><div className="cx-easement-extra"><b>{guide.specialCase.uses}</b> · {guide.specialCase.threshold} → {guide.specialCase.width}</div><div className="cx-handoff-line">{guide.piloti}</div><aside className="cx-b68-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'neighborhood-facility-classification-board') {
    label = '근린생활시설 판정 갈림길'
    body = <><div className="cx-fence-row"><section className="is-in"><strong>{guide.always.name}</strong><span>{guide.always.rule}</span></section><section className="is-out"><strong>{guide.conditional.name}</strong><span>{guide.conditional.rule}</span></section></div><aside className="cx-b68-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'narrow-road-building-line-board') {
    label = '소요너비 미달 도로 건축선판'
    body = <><div className="cx-anchor-date">{guide.generalRule}</div><div className="cx-easement-extra">{guide.specialRule}</div><aside className="cx-b68-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'major-renovation-threshold-board') {
    label = '대수선 판정 기준판'
    body = <><div className="cx-uio-list">{guide.thresholds.map(x=><span key={x.item}><b>{x.item}</b> · {x.rule}</span>)}</div><aside className="cx-b68-note is-alert">{guide.caution}</aside></>
  } else if (guide.kind === 'interior-finish-blank-fill-board') {
    label = '마감재료 빈칸채우기판'
    body = <><div className="cx-fact-qa">{guide.blanks.map(x=><section key={x.label}><strong>{x.label}</strong><span>정답: {x.correct}</span><span>오답: {x.wrong}</span></section>)}</div><aside className="cx-b68-note is-alert">{guide.caution}</aside></>
  } else {
    label = '결합건축 대상지·협정서판'
    body = <><div className="cx-fence-row"><section className="is-in"><strong>대상 지역·구역</strong>{guide.scope.in.map(x=><span key={x}>{x}</span>)}</section><section className="is-out"><strong>제외</strong><span>{guide.scope.out}</span></section></div><div className="cx-uio-list">{guide.agreementItems.required.map(x=><span key={x}>{x}</span>)}</div><div className="cx-easement-extra">기재사항 아님: {guide.agreementItems.notRequired}</div><aside className="cx-b68-note is-alert">{guide.caution}</aside></>
  }
  return <article className="cx-card cx-visual-card cx-visual-card--b68"><SectionBlock label={label} index={5} amended={guide.amended}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function NineteenthSixGuide({ guide }) {
  let label = '개념 전용 실전 판정판'
  let body
  if (guide.kind === 'lease-expense-triage') {
    label = '임차인 지출 3분류 트리아지'
    body = <><div className="cx-expense-triage">{guide.triage.map(x=><section key={x.type}><strong>{x.type}</strong><span>{x.purpose}</span><b>{x.when}</b><small>{x.example}</small></section>)}</div><div className="cx-choice-scale">{guide.choice.map((x,i)=><span key={x}>{x}{i<2?<i>{i===0?'vs':'→'}</i>:null}</span>)}</div><aside className="cx-case-note">{guide.delay}</aside></>
  } else if (guide.kind === 'location-quotient-calculator') {
    label = '입지계수 LQ 계산기'
    body = <><div className="cx-lq-fractions"><section><small>지역 산업비중</small><b>{guide.inputs.localIndustry}</b><i>÷</i><b>{guide.inputs.localTotal}</b></section><section><small>전국 산업비중</small><b>{guide.inputs.nationalIndustry}</b><i>÷</i><b>{guide.inputs.nationalTotal}</b></section></div><div className="cx-lq-steps">{guide.steps.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div><div className="cx-lq-verdicts">{guide.verdicts.map(x=><section key={x.range}><strong>{x.range}</strong><b>{x.result}</b></section>)}</div></>
  } else if (guide.kind === 'foreigner-acquisition-calendar') {
    label = '외국인 취득신고 이중 달력'
    body = <><div className="cx-foreign-clocks">{guide.clocks.map(x=><section key={x.cause}><strong>{x.cause}</strong><b>{x.deadline}</b></section>)}</div><div className="cx-permit-line">{guide.permit.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div><aside className="cx-case-note">{guide.overlap}</aside></>
  } else if (guide.kind === 'registration-rejection-filter') {
    label = '등기신청 각하 필터'
    body = <><div className="cx-rejection-filter">{guide.filters.map(x=><section key={x.request}><strong>{x.request}</strong><b>{x.verdict}</b><span>{x.reason}</span></section>)}</div><div className="cx-filter-process">{guide.process.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div></>
  } else if (guide.kind === 'deemed-acquisition-xray') {
    label = '과점주주·신탁 취득 X-ray'
    body = <><div className="cx-shareholder-xray">{guide.shareholder.map(x=><section key={x.event}><strong>{x.event}</strong><b>{x.result}</b></section>)}</div><div className="cx-trust-xray">{guide.trust.map(x=><section key={x.move}><strong>{x.move}</strong><i>→</i><b>{x.result}</b></section>)}</div></>
  } else {
    label = '공동구 지하 단면도'
    body = <><div className="cx-tunnel-zones">{guide.zones.map(x=><span key={x}>{x}</span>)}</div><div className="cx-utility-tunnel"><strong>공동구</strong>{guide.tunnel.map(x=><section className={x.route.includes('심의')?'is-review':''} key={x.utility}><b>{x.utility}</b><span>{x.route}</span></section>)}</div><div className="cx-maintenance-strip">{guide.maintenance.map(x=><span key={x}>✓ {x}</span>)}</div></>
  }
  return <article className="cx-card cx-visual-card"><SectionBlock label={label} index={5}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function EighteenthSixGuide({ guide }) {
  let label = '개념 전용 실전 도구'
  let body
  if (guide.kind === 'exchange-contract-scales') {
    label = '교환계약 맞교환 저울'
    body = <><div className="cx-exchange-scale">{guide.sides.map((x,i)=><section key={x.party}><strong>{x.party}</strong><span>내주는 것 · {x.gives}</span><b>받는 것 · {x.receives}</b>{i===0?<i>⇄</i>:null}</section>)}</div><div className="cx-trait-tags">{guide.traits.map(x=><span key={x}>{x}</span>)}</div><div className="cx-supplement-box"><span>{guide.supplement.imbalance}</span><b>{guide.supplement.cash}</b><strong>{guide.supplement.rule}</strong></div><div className="cx-risk-chain">{guide.risk.map(x=><span key={x}>{x}</span>)}</div></>
  } else if (guide.kind === 'huff-probability-lab') {
    label = '허프 방문확률 실험실'
    body = <><aside className="cx-formula-board">{guide.formula}</aside><div className="cx-huff-stores">{guide.stores.map(x=><section key={x.name}><strong>{x.name}</strong><span>면적 {x.size}㎡ · 거리 {x.distance}km</span><b>매력점수 {x.score}</b><i style={{width:`${x.probability}%`}}>{x.probability}%</i></section>)}</div><div className="cx-friction-cards">{guide.friction.map(x=><section key={x.good}><strong>{x.good}</strong><b>{x.beta}</b><span>{x.effect}</span></section>)}</div><aside className="cx-case-note">{guide.sales}</aside></>
  } else if (guide.kind === 'lease-report-threshold-gate') {
    label = '임대차신고 6천·30·30 게이트'
    body = <><div className="cx-lease-gates">{guide.gates.map((x,i)=><section key={x.test}><b>{i+1}</b><strong>{x.test}</strong><span>{x.pass}</span></section>)}</div><div className="cx-lease-cases">{guide.cases.map(x=><section className={x.result.includes('아님')?'is-no':'is-yes'} key={x.contract}><strong>{x.contract}</strong><b>{x.result}</b><span>{x.why}</span></section>)}</div><div className="cx-report-routes">{guide.routes.map(x=><span key={x}>✓ {x}</span>)}</div></>
  } else if (guide.kind === 'survey-request-switchboard') {
    label = '지적측량 의뢰·열람 스위치보드'
    body = <><div className="cx-request-board">{guide.request.map(x=><section key={x.situation}><strong>{x.situation}</strong><b>{x.route}</b></section>)}</div><div className="cx-benchmark-desk">{guide.desk.map(x=><section key={x.point}><strong>{x.point}</strong><i>→</i><b>{x.office}</b></section>)}</div><div className="cx-plan-line">{guide.plan.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div></>
  } else if (guide.kind === 'acquisition-clock-dial') {
    label = '취득원인별 취득시기 시계'
    body = <><div className="cx-acquisition-dials">{guide.clocks.map(x=><section key={x.cause}><strong>{x.cause}</strong><b>{x.time}</b><span>{x.cue}</span></section>)}</div><div className="cx-override-line">{guide.override.map((x,i)=><span key={x}>{x}{i<guide.override.length-1?<i>vs</i>:null}</span>)}</div><aside className="cx-case-note">{guide.example}</aside></>
  } else {
    label = '기반시설 유발수요 계기판'
    const max = Math.max(...guide.meter.map(x=>x.coefficient))
    body = <><div className="cx-demand-meter">{guide.meter.map(x=><section key={x.use}><div><i style={{width:`${x.coefficient/max*100}%`}} /></div><strong>{x.use}</strong><b>{x.coefficient}</b></section>)}</div><div className="cx-exclusion-sort">{guide.excluded.map(x=><section className={x.result==='제외'?'is-out':'is-in'} key={x.facility}><strong>{x.facility}</strong><b>{x.result}</b></section>)}</div><aside className="cx-formula-board">{guide.formula}</aside></>
  }
  return <article className="cx-card cx-visual-card"><SectionBlock label={label} index={5}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function SeventeenthSixGuide({ guide }) {
  let label = '개념 전용 학습 보드'
  let body
  if (guide.kind === 'reservation-option-console') {
    label = '예약완결권 옵션 콘솔'
    body = <><div className="cx-option-flow">{guide.switchFlow.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div><div className="cx-option-timers">{guide.timers.map(x=><section key={x.setting}><strong>{x.setting}</strong><b>{x.due}</b><span>{x.note}</span></section>)}</div><aside className="cx-demand-card"><strong>{guide.demand.actor}</strong><span>{guide.demand.action}</span><b>{guide.demand.silence}</b></aside></>
  } else if (guide.kind === 'retail-gravity-balance') {
    label = '소매인력 분기점 저울'
    body = <><div className="cx-gravity-map"><section><strong>{guide.cities[0].name}</strong><b>{guide.cities[0].population}</b></section><div><i style={{width:'66%'}} /><span>분기점</span></div><section><strong>{guide.cities[1].name}</strong><b>{guide.cities[1].population}</b></section></div><aside className="cx-verdict-strip">{guide.formula}</aside><div className="cx-gravity-worked">{guide.worked.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div><div className="cx-gravity-laws">{guide.laws.map(x=><section key={x.name}><strong>{x.name}</strong><b>{x.cue}</b><span>{x.rule}</span></section>)}</div></>
  } else if (guide.kind === 'transaction-sanction-scale') {
    label = '거래신고 제재 저울'
    body = <><div className="cx-sanction-lanes">{guide.lanes.map(x=><section key={x.violation}><small>{x.type}</small><strong>{x.violation}</strong><b>{x.sanction}</b><span>{x.alternative}</span></section>)}</div><div className="cx-sanction-calc"><span>{guide.calculator.land}</span><i>{guide.calculator.rate}</i><b>{guide.calculator.maximum}</b></div><div className="cx-validity-flow">{guide.validity.map((x,i)=><span key={x}>{x}{i<guide.validity.length-1?<i>→</i>:null}</span>)}</div></>
  } else if (guide.kind === 'cadastral-committee-table') {
    label = '중앙지적위원회 회의 테이블'
    body = <><div className="cx-seat-table"><strong>중앙지적위원회</strong><b>{guide.seats.minimum}~{guide.seats.maximum}명</b><span>위원장 · {guide.seats.chair}</span><span>부위원장 · {guide.seats.vice}</span><small>{guide.seats.memberTerm}</small></div><div className="cx-meeting-rules">{guide.meeting.map(x=><section key={x.item}><strong>{x.item}</strong><b>{x.value}</b></section>)}</div><div className="cx-agenda-grid">{guide.agenda.map(x=><section className={x.result.includes('없음')?'is-no':''} key={x.name}><strong>{x.name}</strong><b>{x.result}</b></section>)}</div></>
  } else if (guide.kind === 'acquisition-price-basket') {
    label = '취득가격 포함·제외 장바구니'
    body = <><div className="cx-price-basket">{guide.basket.map(x=><section className={x.result==='제외'?'is-out':'is-in'} key={x.item}><strong>{x.item}</strong><b>{x.result}</b><span>{x.why}</span></section>)}</div><div className="cx-equation-strip">{guide.equation.map(x=><span key={x}>{x}</span>)}</div><aside className="cx-case-note">{guide.example}</aside></>
  } else {
    label = '밀도규제·시설부담 쌍둥이 판'
    body = <><div className="cx-twin-board">{guide.twins.map(x=><section className={`is-${x.color}`} key={x.name}><strong>{x.name}</strong><small>{x.symptom}</small><b>{x.tool}</b><div>{x.process.map((v,i)=><span key={v}>{i+1}. {v}</span>)}</div></section>)}</div><div className="cx-rule-locks">{guide.locks.map(x=><span key={x}>🔒 {x}</span>)}</div></>
  }
  return <article className="cx-card cx-visual-card"><SectionBlock label={label} index={5}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function SixteenthSixGuide({ guide }) {
  let label = '개념 전용 시각 판정판'
  let body
  if (guide.kind === 'repurchase-boomerang-timeline') {
    label = '환매권 부메랑 타임라인'
    body = <><div className="cx-boomerang-line">{guide.stages.map((x,i)=><section key={x.name}><b>{i+1}</b><strong>{x.name}</strong><span>{x.detail}</span></section>)}</div><div className="cx-clock-pair">{guide.clocks.map(x=><section key={x.condition}><small>{x.condition}</small><b>{x.result}</b><span>{x.note}</span></section>)}</div><aside className="cx-case-note">{guide.case}</aside></>
  } else if (guide.kind === 'cobweb-stability-spirals') {
    label = '거미집 안정성 3패턴'
    body = <><div className="cx-cobweb-patterns">{guide.patterns.map(x=><section key={x.type}><strong>{x.type}</strong><small>{x.demand}</small><div>{x.points.map((v,i)=><i key={i} style={{height:`${Math.min(v,116)}px`}} />)}</div><b>{x.cue}</b></section>)}</div><div className="cx-delay-loop">{guide.delay.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div><aside className="cx-case-note">{guide.example}</aside></>
  } else if (guide.kind === 'transaction-form-blueprint') {
    label = '거래신고서 필드 설계도'
    body = <><div className="cx-form-blueprint">{guide.fields.map(x=><section className={`is-${x.tone}`} key={x.label}><strong>{x.label}</strong><span>{x.value}</span></section>)}</div><div className="cx-area-choice">{guide.areaChoice.map(x=><section key={x.building}><strong>{x.building}</strong><i>→</i><b>{x.use}</b></section>)}</div><div className="cx-form-checks">{guide.checks.map(x=><span key={x}>✓ {x}</span>)}</div></>
  } else if (guide.kind === 'survey-necessity-detector') {
    label = '지적측량 필요성 탐지기'
    body = <><div className="cx-survey-detector">{guide.inputs.map(x=><section className={x.verdict.includes('없음')?'is-off':'is-on'} key={x.event}><strong>{x.event}</strong><b>{x.verdict}</b><span>{x.type}</span></section>)}</div><div className="cx-survey-compare">{guide.compare.map(x=><section key={x.type}><strong>{x.type}</strong><span>{x.question}</span></section>)}</div></>
  } else if (guide.kind === 'tax-appeal-route-map') {
    label = '지방세 불복 90일 노선도'
    body = <><div className="cx-tax-routes">{guide.routes.map((x,i)=><section key={i}><strong>{x.start}</strong>{x.path.map(v=><span key={v}>{v}</span>)}</section>)}</div><div className="cx-tax-excluded"><strong>본선 진입 불가</strong>{guide.excluded.map(x=><span key={x}>× {x}</span>)}</div><div className="cx-family-agent"><b>{guide.family.threshold}</b>{guide.family.people.map(x=><span key={x}>{x}</span>)}</div></>
  } else {
    label = '시설사업 시행 컨트롤 패널'
    body = <><div className="cx-facility-scope">{guide.scope.map(x=><section key={x.area}><strong>{x.area}</strong><i>→</i><b>{x.authority}</b></section>)}</div><div className="cx-access-panel">{guide.access.map(x=><section key={x.actor}><strong>{x.actor}</strong><span>{x.action}</span><b>{x.permit}</b></section>)}</div><div className="cx-private-gate"><strong>일반 민간 지정 게이트</strong>{guide.privateGate.map(x=><span key={x}>✓ {x}</span>)}</div></>
  }
  return <article className="cx-card cx-visual-card"><SectionBlock label={label} index={5}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function FifteenthSixGuide({ guide }) {
  let label = '개념 전용 구조도'
  let body
  if (guide.kind === 'earnest-money-exit-gate') {
    label = '해약금 해제 출구 게이트'
    body = <><div className="cx-exit-gates">{guide.gate.map(x=><section key={x.actor}><strong>{x.actor}</strong><span>{x.action}</span><i>→</i><b>{x.effect}</b></section>)}</div><div className="cx-signal-track">{guide.timeline.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div><div className="cx-gate-closed"><strong>출구 폐쇄</strong>{guide.closes.map(x=><span key={x}>🔒 {x}</span>)}</div></>
  } else if (guide.kind === 'official-price-twin-process') {
    label = '표준지·개별지 쌍둥이 절차'
    body = <><div className="cx-price-lanes">{guide.lanes.map(x=><section key={x.name}><header><strong>{x.name}</strong><b>{x.actor}</b></header><div>{x.process.map((v,i)=><span key={v}><i>{i+1}</i>{v}</span>)}</div><footer>{x.use}</footer></section>)}</div><div className="cx-no-individual"><strong>개별지가 생략 가능</strong>{guide.noIndividual.map(x=><span key={x}>{x}</span>)}</div></>
  } else if (guide.kind === 'reward-claim-funnel') {
    label = '포상금 50만원 지급 깔때기'
    body = <><div className="cx-reward-funnel">{guide.funnel.map((x,i)=><section key={x} style={{width:`${100-i*10}%`}}><b>{i+1}</b>{x}</section>)}</div><div className="cx-allocation-cards">{guide.allocation.map(x=><section key={x.situation}><strong>{x.situation}</strong><b>{x.result}</b></section>)}</div><div className="cx-target-tags">{guide.targets.map(x=><span key={x}>{x}</span>)}</div></>
  } else if (guide.kind === 'integrated-register-dashboard') {
    label = '부동산종합공부 정보 대시보드'
    body = <><div className="cx-register-dashboard"><strong>부동산종합공부</strong>{guide.feeds.map(x=><section key={x.source}><b>{x.source}</b><span>{x.data}</span><i>→</i></section>)}</div><div className="cx-service-strip">{guide.services.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div></>
  } else if (guide.kind === 'fair-market-ratio-mixer') {
    label = '재산세 공정시장가액비율 믹서'
    body = <><div className="cx-ratio-mix"><section><strong>일반 비율</strong>{guide.standard.map(x=><span key={x.asset}><b>{x.ratio}%</b>{x.asset}</span>)}</section><section><strong>2026년 1세대 1주택</strong>{guide.oneHome2026.map(x=><span key={x.range}><b>{x.ratio}%</b>{x.range}</span>)}</section></div><div className="cx-tax-example"><strong>{guide.example}</strong></div></>
  } else {
    label = '용도지역별 용적률 스카이라인'
    const top = Math.max(...guide.skyline.map(x=>x.max))
    body = <><div className="cx-far-skyline">{guide.skyline.map(x=><section key={x.zone}><div style={{height:`${Math.max(18,x.max/top*150)}px`}}><b>{x.max}%</b></div><span>{x.zone}</span></section>)}</div><aside className="cx-verdict-strip">{guide.formula}</aside><aside className="cx-exception-note"><b>주의</b>{guide.caution}</aside></>
  }
  return <article className="cx-card cx-visual-card"><SectionBlock label={label} index={5}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function FourteenthSixGuide({ guide }) {
  let label = '개념 전용 판정판'
  let body
  if (guide.kind === 'rescission-signal-console') {
    label = '해제·해지 의사표시 신호판'
    body = <><div className="cx-signal-track">{guide.signal.map((x,i)=><span key={x}><b>{i+1}</b>{x}{i<guide.signal.length-1?<i>→</i>:null}</span>)}</div><div className="cx-rescission-tests">{guide.tests.map(x=><section key={x.question}><strong>{x.question}</strong><b>{x.answer}</b><span>{x.detail}</span></section>)}</div></>
  } else if (guide.kind === 'cost-approach-restoration-lab') {
    label = '원가법 가치 복원 실험실'
    body = <><div className="cx-cost-machine">{guide.machine.map(x=><section key={x.label}><i>{x.sign}</i><strong>{x.label}</strong><span>{x.value}</span></section>)}</div><div className="cx-cost-example"><span>재조달원가 <b>{guide.example.cost}</b></span><span>내용연수 <b>{guide.example.life}</b></span><span>경과 <b>{guide.example.elapsed}</b></span><span>감가 <b>−{guide.example.depreciation}</b></span><strong>= {guide.example.value}</strong></div><aside className="cx-verdict-strip">{guide.formula}</aside></>
  } else if (guide.kind === 'brokerage-fee-routing-calculator') {
    label = '중개보수 요율표 라우터'
    body = <><div className="cx-fee-switches">{guide.switches.map((x,i)=><section key={x.test}><b>{i+1}</b><strong>{x.test}</strong><span className="is-yes">YES · {x.yes}</span><span className="is-no">NO · {x.no}</span></section>)}</div><div className="cx-worked-example"><small>월차임 환산</small><span>{guide.worked.input}</span><i>→</i><span>{guide.worked.first}</span><i>→</i><b>{guide.worked.second}</b><strong>{guide.worked.result}</strong></div></>
  } else if (guide.kind === 'boundary-cross-section-atlas') {
    label = '지상경계 단면도 도감'
    body = <><div className="cx-boundary-atlas">{guide.sections.map(x=><figure key={x.terrain}><div>{x.sketch}</div><figcaption><strong>{x.terrain}</strong><b>{x.marker}</b></figcaption></figure>)}</div><aside className="cx-verdict-strip">{guide.buildingRule}</aside></>
  } else if (guide.kind === 'registration-tax-rights-ledger') {
    label = '등록면허세 권리별 원장'
    body = <><div className="cx-rights-ledger">{guide.rights.map(x=><section key={x.right}><strong>{x.right}</strong><span>{x.base}</span><b>× {x.rate}</b></section>)}</div><div className="cx-tax-example"><strong>{guide.example}</strong><span>{guide.place}</span></div></>
  } else {
    label = '용도지구 세분 가족나무'
    body = <><div className="cx-district-families">{guide.families.map(x=><section key={x.parent}><strong>{x.parent}</strong><div>{x.children.map(v=><span key={v}>{v}</span>)}</div></section>)}</div><div className="cx-fake-bin"><strong>존재하지 않는 가짜 명칭</strong>{guide.fakes.map(x=><span key={x}>× {x}</span>)}</div></>
  }
  return <article className="cx-card cx-visual-card"><SectionBlock label={label} index={5}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function ThirteenthSixGuide({ guide }) {
  let label = '개념 전용 판정 도구'
  let body
  if (guide.kind === 'apparent-agency-three-doors') {
    label = '표현대리 3개 출입문'
    body = <><div className="cx-agency-doors">{guide.doors.map(x=><section key={x.article}><b>{x.article}</b><strong>{x.title}</strong><span>{x.appearance}</span><small>{x.trust}</small><i>{x.example}</i></section>)}</div><aside className="cx-verdict-strip">{guide.claimRule}</aside></>
  } else if (guide.kind === 'repayment-profile-race') {
    label = '상환방식 4개 잔액 프로필'
    body = <><div className="cx-repayment-profiles">{guide.profiles.map(x=><section key={x.name}><strong>{x.name}</strong><b>{x.fixed}</b><div className="cx-mini-bars" aria-label={`${x.name} 회차별 상환액`}>{x.payment.map((v,i)=><span key={i}>{v}</span>)}</div><small>잔액 {x.balance.join(' ')}</small><i>{x.cue}</i></section>)}</div><div className="cx-repayment-ranking">{guide.ranking.map((x,i)=><span key={x}><b>{i+1}</b>{x}{i<guide.ranking.length-1?<i>→</i>:null}</span>)}</div></>
  } else if (guide.kind === 'explanation-duty-checkpoint') {
    label = '확인·설명의무 2개 체크포인트'
    body = <><div className="cx-explanation-checkpoints">{guide.checkpoints.map((x,i)=><section key={x.when}><b>{i+1}</b><strong>{x.when}</strong><span>{x.action}</span><small>{x.to}</small><i>{x.proof}</i></section>)}</div><div className="cx-duty-scope">{guide.scope.map(x=><section key={x.item}><span>{x.item}</span><b>{x.result}</b></section>)}</div></>
  } else if (guide.kind === 'cadastral-notice-two-clocks') {
    label = '지적정리 통지 2개 시계'
    body = <><div className="cx-notice-clocks">{guide.clocks.map(x=><section key={x.condition}><strong>{x.condition}</strong><small>기산점 · {x.start}</small><b>{x.due}</b><span>{x.route}</span></section>)}</div><aside className="cx-verdict-strip">{guide.ownerRule}</aside></>
  } else if (guide.kind === 'acquisition-rate-shelves') {
    label = '취득원인별 표준세율 선반'
    body = <><div className="cx-rate-shelves">{guide.rates.map(x=><section key={x.rate}><b>{x.rate}</b><div>{x.cases.map(v=><span key={v}>{v}</span>)}</div></section>)}</div><aside className="cx-exception-note"><b>지분 초과 경보</b>{guide.exception}</aside></>
  } else {
    label = '광역도시계획 수립·승인 라우터'
    body = <><div className="cx-authority-router">{guide.routes.map(x=><section key={x.area}><small>{x.area}</small><strong>{x.maker}</strong><i>→</i><b>{x.approver}</b></section>)}</div><div className="cx-finish-line">{guide.finish.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div></>
  }
  return <article className="cx-card cx-visual-card"><SectionBlock label={label} index={5}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function TwelfthSixGuide({ guide }) {
  let label = '개념 전용 구조도'
  let body
  if (guide.kind === 'passage-route-map') {
    label = '주위토지통행권 경로도'
    body = <><div className="cx-passage-route">{guide.route.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div><div className="cx-passage-cases">{guide.cases.map(x=><section key={x.situation}><strong>{x.situation}</strong><b>{x.result}</b><span>{x.why}</span></section>)}</div></>
  } else if (guide.kind === 'equilibrium-four-board') {
    label = '동시변화 4방향 결과판'
    body = <><div className="cx-four-board">{guide.quadrants.map(x=><section key={x.demand+x.supply}><strong>{x.demand}</strong><strong>{x.supply}</strong><b>{x.fixed}</b><span>{x.contest}</span></section>)}</div><div className="cx-worked-example"><small>방향 예제</small><span>{guide.example.inputs}</span><i>→</i><strong>{guide.example.answer}</strong><b>{guide.example.reason}</b></div></>
  } else if (guide.kind === 'disqualification-locks') {
    label = '개설등록 결격기간 자물쇠'
    body = <><div className="cx-disqualification-locks">{guide.locks.map(x=><section key={x.event}><span>🔒</span><strong>{x.event}</strong><small>{x.start}부터</small><b>{x.wait}</b></section>)}</div><div className="cx-no-lock">{guide.noLock.map(x=><span key={x}>🔓 {x}</span>)}</div></>
  } else if (guide.kind === 'survey-appeal-stairs') {
    label = '지적측량 적부심사 불복 계단'
    body = <div className="cx-appeal-stairs">{guide.stairs.map((x,i)=><section key={x.day} style={{marginLeft:`${i*5}%`}}><b>{x.day}</b><strong>{x.actor}</strong><span>{x.action}</span></section>)}</div>
  } else if (guide.kind === 'trust-tax-handoff') {
    label = '신탁재산 재산세 의무 전환도'
    body = <><div className="cx-trust-actors">{guide.actors.map(x=><section key={x.role}><strong>{x.role}</strong><b>{x.status}</b><span>{x.duty}</span></section>)}</div><div className="cx-arrow-chain">{guide.trigger.map((x,i)=><span key={x}>{x}{i<guide.trigger.length-1?<i>→</i>:null}</span>)}</div></>
  } else {
    label = '건축협정 동의·인가 체계도'
    body = <><div className="cx-agreement-votes">{guide.votes.map(x=><section key={x.stage}><strong>{x.stage}</strong><b>{x.vote}</b><span>{x.next}</span></section>)}</div><div className="cx-integrated-rules"><strong>구역 통합 적용</strong>{guide.integrated.map(x=><span key={x}>{x}</span>)}<i>{guide.separate}</i></div></>
  }
  return <article className="cx-card cx-visual-card"><SectionBlock label={label} index={5}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function EleventhSixGuide({ guide }) {
  let label = '개념 전용 학습 도구'
  let body
  if (guide.kind === 'unilateral-arrival-gate') {
    label = '단독행위 도달 게이트'
    body = <><div className="cx-arrival-gates">{guide.gates.map(x=><section key={x.type}><strong>{x.type}</strong><b>{x.arrival}</b>{x.examples.map(v=><span key={v}>{v}</span>)}</section>)}</div><aside className="cx-info-note">{guide.distinction}</aside></>
  } else if (guide.kind === 'cap-rate-balance') {
    label = '수익환원율 가치 저울'
    body = <><div className="cx-cap-formula"><span>{guide.formula.income}</span><i>÷</i><span>{guide.formula.rate}</span><b>= {guide.formula.value}</b></div><div className="cx-cap-drivers">{guide.drivers.map(x=><section key={x.factor}><strong>{x.factor}</strong><i>→</i><span>{x.rate}</span><i>→</i><b>{x.value}</b></section>)}</div><div className="cx-method-tags">{guide.methods.map(x=><span key={x}>{x}</span>)}</div></>
  } else if (guide.kind === 'broker-role-badges') {
    label = '고용인 업무권한 배지'
    body = <><div className="cx-role-badges">{guide.roles.map(x=><section key={x.role}><strong>{x.role}</strong><b>{x.license}</b><div className="is-can">{x.can.map(v=><span key={v}>✓ {v}</span>)}</div><div className="is-no">{x.cannot.map(v=><span key={v}>× {v}</span>)}</div></section>)}</div><div className="cx-arrow-chain">{guide.timeline.map((x,i)=><span key={x}>{x}{i<guide.timeline.length-1?<i>→</i>:null}</span>)}</div><aside className="cx-info-note">{guide.cap}</aside></>
  } else if (guide.kind === 'area-rounding-ruler') {
    label = '등록면적 끝수처리 자'
    body = <><div className="cx-area-units">{guide.units.map(x=><section key={x.area}><strong>{x.area}</strong><b>{x.unit}</b><span>{x.digits}</span></section>)}</div><div className="cx-rounding-ruler">{guide.samples.map(x=><section key={x.raw}><small>{x.raw}㎡</small><i>→</i><strong>{x.result}㎡</strong><span>{x.reason}</span></section>)}</div></>
  } else if (guide.kind === 'capital-rate-timeline') {
    label = '보유기간별 양도세율 시간축'
    body = <><div className="cx-rate-tracks">{guide.tracks.map(x=><section key={x.asset}><strong>{x.asset}</strong><div>{x.periods.map(p=><span key={p.until}><small>{p.until}</small><b>{p.rate}</b></span>)}</div></section>)}</div><aside className="cx-special-caution"><b>큰 세액 적용</b><span>{guide.maxRule}</span></aside></>
  } else {
    label = '용도군 허가·신고 승강기'
    body = <><div className="cx-use-elevator"><div>{guide.floors.map(x=><span key={x.no}><b>{x.no}</b>{x.name}</span>)}</div><aside>{guide.directions.map(x=><section key={x.move}><strong>{x.move}</strong><b>{x.action}</b></section>)}</aside></div><aside className="cx-info-note">{guide.approval}</aside></>
  }
  return <article className="cx-card cx-visual-card"><SectionBlock label={label} index={5}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function TenthSixGuide({ guide }) {
  let label = '개념 전용 문제풀이판'
  let body
  if (guide.kind === 'contract-classification-cube') {
    label = '계약 성질 3축 분류 큐브'
    body = <><div className="cx-contract-axes">{guide.axes.map(x=><section key={x.axis}><small>{x.axis}</small><strong>{x.left}</strong><i>↔</i><strong>{x.right}</strong><span>{x.cue}</span></section>)}</div><div className="cx-contract-codes">{guide.contracts.map(x=><section key={x.name}><strong>{x.name}</strong>{x.code.map(c=><span key={c}>{c}</span>)}</section>)}</div></>
  } else if (guide.kind === 'curve-shift-compass') {
    label = '수요·공급 이동 나침반'
    body = <><div className="cx-shift-compass">{guide.compass.map(x=><section key={x.side}><strong>{x.side}</strong><div><b>증가</b>{x.plus.map(i=><span key={i}>{i}</span>)}</div><div><b>감소</b>{x.minus.map(i=><span key={i}>{i}</span>)}</div></section>)}</div><div className="cx-equilibrium-arrows">{guide.rule.map(x=><section key={x.change}><strong>{x.change}</strong><span>P {x.price}</span><span>Q {x.quantity}</span></section>)}</div></>
  } else if (guide.kind === 'cancellation-decision-tree') {
    label = '등록취소 필수·임의 결정트리'
    body = <><div className="cx-cancel-tree">{guide.branches.map((x,i)=><section className={i?'is-may':'is-must'} key={x.type}><strong>{x.type}</strong><b>{x.verb}</b>{x.items.map(v=><span key={v}>{v}</span>)}</section>)}</div><aside className="cx-special-caution"><b>반복위반 함정</b><span>{guide.check}</span></aside></>
  } else if (guide.kind === 'provisional-cancellation-shield') {
    label = '가등기 본등기 직권말소 방패'
    body = <><div className="cx-cancel-shields">{guide.modes.map(x=><section key={x.title}><strong>{x.title}</strong><div className="is-erase"><b>말소</b>{x.erase.map(v=><span key={v}>{v}</span>)}</div><div className="is-keep"><b>유지</b>{x.keep.map(v=><span key={v}>{v}</span>)}</div></section>)}</div><aside className="cx-info-note">{guide.notice}</aside></>
  } else if (guide.kind === 'capital-return-calendar') {
    label = '양도소득 예정신고 달력'
    body = <><div className="cx-return-calendars">{guide.calendars.map(x=><section key={x.asset}><strong>{x.asset}</strong><span>{x.event}</span><b>{x.add}</b><small>{x.example}</small></section>)}</div><div className="cx-extra-rules">{guide.extras.map(x=><span key={x}>✓ {x}</span>)}</div></>
  } else {
    label = '건축신고·가설건축물 스위치'
    body = <><div className="cx-building-switch">{guide.panels.map(x=><section key={x.title}><strong>{x.title}</strong><b>{x.rule}</b>{x.examples.map(v=><span key={v}>{v}</span>)}</section>)}</div><div className="cx-arrow-chain">{guide.timer.map((x,i)=><span key={x}>{x}{i<guide.timer.length-1?<i>→</i>:null}</span>)}</div></>
  }
  return <article className="cx-card cx-visual-card"><SectionBlock label={label} index={5}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function NinthSixGuide({ guide }) {
  let label = '개념 전용 판별 도구'
  let body
  if (guide.kind === 'warranty-remedy-selector') {
    label = '담보책임 권리 선택표'
    body = <><div className="cx-remedy-selector">{guide.cases.map(x=><section key={x.defect}><b>{x.article}</b><strong>{x.defect}</strong><span>{x.fact}</span><div>{x.remedies.map(r=><i key={r}>{r}</i>)}</div></section>)}</div><aside className="cx-info-note">{guide.precedent}</aside></>
  } else if (guide.kind === 'stp-funnel') {
    label = 'STP 전략 퍼널'
    body = <><div className="cx-stp-funnel">{guide.funnel.map((x,i)=><section key={x.code} style={{width:`${100-i*14}%`}}><b>{x.code}</b><strong>{x.name}</strong><span>{x.question}</span><i>{x.output}</i></section>)}</div><div className="cx-marketing-layers">{guide.layers.map(x=><section key={x.title}><strong>{x.title}</strong><b>{x.tool}</b><span>{x.view}</span></section>)}</div></>
  } else if (guide.kind === 'auction-agency-boundary') {
    label = '매수신청대리 업무 경계'
    body = <><div className="cx-auction-allowed"><strong>대리 가능</strong>{guide.allowed.map(x=><span key={x}>✓ {x}</span>)}</div><div className="cx-auction-duties">{guide.duties.map(x=><section key={x.at}><b>{x.at}</b><strong>{x.task}</strong><span>{x.proof}</span></section>)}</div></>
  } else if (guide.kind === 'mortgage-registry-anatomy') {
    label = '저당권 등기 해부도'
    body = <><div className="cx-registry-sheet"><header>을구 · 저당권설정</header>{guide.fields.map(x=><section key={x.label}><b>{x.label}</b><strong>{x.value}</strong><span>{x.note}</span></section>)}</div><div className="cx-joint-count">{guide.joint.map(x=><span className={x===5?'is-list':''} key={x}>{x}<small>{x===5?'공동담보목록 작성':'개별 표시'}</small></span>)}</div><aside className="cx-info-note">{guide.transfer}</aside></>
  } else if (guide.kind === 'capital-special-router') {
    label = '양도소득 특수사례 분기기'
    body = <div className="cx-special-gates">{guide.gates.map((x,i)=><section key={x.input}><b>{i+1}</b><strong>{x.input}</strong><i>→</i><span>{x.output}</span><small>{x.basis}</small></section>)}</div>
  } else {
    label = '건축허가·해체·제한 배전반'
    body = <><div className="cx-building-circuits">{guide.circuits.map(x=><section key={x.title}><strong>{x.title}</strong><b>{x.trigger}</b><span>{x.exception}</span><small>{x.law}</small></section>)}</div><div className="cx-arrow-chain">{guide.procedure.map((x,i)=><span key={x}>{x}{i<guide.procedure.length-1?<i>→</i>:null}</span>)}</div></>
  }
  return <article className="cx-card cx-visual-card"><SectionBlock label={label} index={5}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function EighthSixGuide({ guide }) {
  let label = '개념 전용 시각판'
  let body
  if (guide.kind === 'sale-fruits-timeline') {
    label = '매매 성립·과실·이자 타임라인'
    body = <><div className="cx-sale-timeline">{guide.moments.map((x,i)=><section key={x.at}><b>{x.at}</b><strong>{x.title}</strong><span>{x.detail}</span><small>{x.article}</small>{i<guide.moments.length-1?<i>→</i>:null}</section>)}</div><aside className="cx-special-caution"><b>지급기 예외</b><span>{guide.exception}</span></aside></>
  } else if (guide.kind === 'tax-incidence-scale') {
    label = '조세 전가·귀착 저울'
    body = <><div className="cx-incidence-scales">{guide.cases.map(x=><section key={x.title}><strong>{x.title}</strong><div><span style={{flex:x.demand||.04}}>수요자 {x.demand}%</span><span style={{flex:x.supply||.04}}>공급자 {x.supply}%</span></div><b>{x.result}</b></section>)}</div><div className="cx-effect-chain">{guide.effects.map(x=><span key={x}>{x}</span>)}</div></>
  } else if (guide.kind === 'office-relocation-route') {
    label = '중개사무소 이전 경로도'
    body = <><div className="cx-relocation-routes">{guide.routes.map(x=><section key={x.case}><strong>{x.case}</strong><i>10일 내 →</i><b>{x.to}</b><span>{x.after}</span></section>)}</div><div className="cx-packet-row">{guide.packet.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div></>
  } else if (guide.kind === 'survey-control-tower') {
    label = '지적측량 의뢰·성과 관제도'
    body = <><div className="cx-survey-flow">{guide.request.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div><div className="cx-point-tower">{guide.points.map(x=><section key={x.point}><strong>{x.point}</strong><b>{x.office}</b><small>{x.level}</small></section>)}</div></>
  } else if (guide.kind === 'expense-filter') {
    label = '양도 필요경비 분류·증빙 필터'
    body = <><div className="cx-expense-drawers">{guide.drawers.map(x=><section key={x.name}><strong>{x.name}</strong>{x.items.map(i=><span key={i}>{i}</span>)}</section>)}</div><div className="cx-filter-checks">{guide.checks.map((x,i)=><span key={x}><b>{i+1}</b>{x}<i>✓</i></span>)}</div></>
  } else {
    label = '정비기본계획 세 개의 시계'
    body = <><div className="cx-plan-clocks">{guide.clocks.map(x=><section key={x.number}><b>{x.number}</b><strong>{x.title}</strong><span>{x.note}</span></section>)}</div><div className="cx-authority-strip">{guide.authority.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div><aside className="cx-special-caution"><b>경미한 변경 아님</b><span>{guide.caution}</span></aside></>
  }
  return <article className="cx-card cx-visual-card"><SectionBlock label={label} index={5}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function RuleWorkbenchGuide({ guide }) {
  return <article className="cx-card cx-visual-card"><SectionBlock label={guide.title} index={5}>
    <p className="cx-special-lede">{guide.summary}</p>
    <div className="cx-rule-workbench">{guide.columns.map((column, index) => <section key={column.head} style={{ '--cx-delay': `${index * 90}ms` }}>
      <small>{String(index + 1).padStart(2, '0')}</small><strong>{column.head}</strong>
      <div>{column.items.map(item => <span key={item}>{item}</span>)}</div>
    </section>)}</div>
    <div className="cx-rule-steps">{guide.steps.map((step, index) => <span key={step}><b>{index + 1}</b>{step}{index < guide.steps.length - 1 ? <i>→</i> : null}</span>)}</div>
    <aside className="cx-special-caution"><b>시험 함정</b><span>{guide.caution}</span></aside>
    <GuideSources sources={guide.sources}/>
  </SectionBlock></article>
}

function SeventhSixGuide({ guide }) {
  let label = '개념 전용 학습판'
  let body
  if (guide.kind === 'sub-agency') {
    label = '복대리 권한·책임 지도'
    body = <><div className="cx-subagency-chain"><span>본인</span><i>대리권 수여</i><span>대리인</span><i>복임</i><span>복대리인</span><strong>본인을 직접 대리</strong></div><div className="cx-two-lanes">{guide.types.map(x=><section key={x.type}><strong>{x.type}</strong><span>{x.power}</span><small>{x.liability}</small></section>)}</div><div className="cx-condition-chips">{guide.voluntaryConditions.map(x=><span key={x}>임의대리 복임 가능 · {x}</span>)}</div><aside className="cx-info-note">{guide.endRule}</aside></>
  } else if (guide.kind === 'amortization-ledger') {
    label = '원리금 상환 장부'
    body = <><div className="cx-amort-formulas">{guide.formulas.map(x=><section key={x.name}><strong>{x.name}</strong><span>{x.formula}</span></section>)}</div><div className="cx-amort-table"><div><b>회차</b><b>기초잔액</b><b>이자</b><b>원금</b><b>기말잔액</b></div>{guide.rows.map(x=><div key={x.round}><strong>{x.round}</strong><span>{x.open}</span><span>{x.interest}</span><span>{x.principal}</span><span>{x.close}</span></div>)}</div><aside className="cx-special-caution"><b>계산 기준</b><span>{guide.caution}</span></aside></>
  } else if (guide.kind === 'foreigner-report') {
    label = '외국인 취득 신고 분기표'
    body = <><div className="cx-report-gates">{guide.routes.map(x=><section key={x.cause}><strong>{x.cause}</strong><b>{x.report}</b><span>{x.deadline}</span><small>{x.note}</small></section>)}</div><div className="cx-permit-zones">{guide.permitZones.map(x=><span key={x}>{x}</span>)}</div><aside className="cx-special-caution"><b>허가의 효과</b><span>{guide.permissionEffect}</span></aside></>
  } else if (guide.kind === 'lot-system') {
    label = '지번·축척·바다 토지 작업대'
    body = <><div className="cx-lot-number"><section><small>일반 토지</small><strong>{guide.numbering.land}</strong></section><i>북서 → 남동</i><section><small>임야</small><strong>{guide.numbering.forest}</strong></section></div><div className="cx-scale-board"><section><strong>지적도</strong>{guide.scales.land.map(x=><span key={x}>1/{x}</span>)}</section><section><strong>임야도</strong>{guide.scales.forest.map(x=><span key={x}>1/{x}</span>)}</section></div><div className="cx-arrow-chain">{guide.seaFlow.map((x,i)=><span key={x}>{x}{i<guide.seaFlow.length-1?<i>→</i>:null}</span>)}</div></>
  } else if (guide.kind === 'tax-liability-time') {
    label = '납세의무 성립 달력'
    body = <><div className="cx-tax-calendar">{guide.events.map(x=><section key={x.tax}><small>{x.tax}</small><strong>{x.when}</strong><span>{x.trigger}</span></section>)}</div><div className="cx-two-lanes">{guide.distinctions.map(x=><section key={x.name}><strong>{x.name}</strong><span>{x.meaning}</span><small>{x.example}</small></section>)}</div><aside className="cx-special-caution"><b>양도일 함정</b><span>{guide.caution}</span></aside></>
  } else {
    label = '도시개발구역 지정 계기판'
    body = <><div className="cx-designators">{guide.designators.map(x=><section className={x.can?'is-can':'is-cannot'} key={x.actor}><strong>{x.actor}</strong><b>{x.can?'지정 가능':'제안만 가능'}</b><span>{x.scope}</span></section>)}</div><div className="cx-zone-sizes">{guide.sizes.map(x=><section key={x.zone}><strong>{x.zone}</strong><b>{x.minimum}</b><span>{x.note}</span></section>)}</div><div className="cx-arrow-chain">{guide.process.map((x,i)=><span key={x}>{x}{i<guide.process.length-1?<i>→</i>:null}</span>)}</div></>
  }
  return <article className="cx-card cx-visual-card"><SectionBlock label={label} index={5}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function SixthSixGuide({ guide }) {
  let label = '개념 전용 실전 구조'
  let body
  if (guide.kind === 'risk-allocation') {
    label = '위험부담 귀책 분기회로'
    body = <><div className="cx-risk-gates">{guide.cases.map(x=><section key={x.cause}><strong>{x.cause}</strong><b>{x.article}</b><span>{x.price}</span><small>{x.followup}</small></section>)}</div><div className="cx-arrow-chain">{guide.lightning.map((x,i)=><span key={x}>{x}{i<guide.lightning.length-1?<i>→</i>:null}</span>)}</div><aside className="cx-info-note">{guide.refund}</aside></>
  } else if (guide.kind === 'equilibrium-solver') {
    label = '시장균형 연립 계산기'
    body = <><div className="cx-equations"><section><strong>수요</strong><span>{guide.before.demand}</span></section><b>=</b><section><strong>공급</strong><span>{guide.before.supply}</span></section></div><div className="cx-equilibrium-points"><section><small>이동 전</small><strong>P {guide.before.price}</strong><b>Q {guide.before.quantity}</b></section><i>수요 +20 →</i><section><small>이동 후</small><strong>P {guide.after.price}</strong><b>Q {guide.after.quantity}</b></section></div><div className="cx-solve-steps">{guide.steps.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div></>
  } else if (guide.kind === 'agency-contracts') {
    label = '일반·전속중개계약 비교판'
    body = <><div className="cx-contract-table"><div><b>구분</b><b>일반</b><b>전속</b></div>{guide.rows.map(x=><div key={x.axis}><strong>{x.axis}</strong><span>{x.general}</span><span>{x.exclusive}</span></div>)}</div><div className="cx-period-rule"><span>기간 약정 없음</span><strong>3개월</strong><i>／</i><span>별도 약정 있음</span><strong>약정기간</strong></div><aside className="cx-special-caution"><b>2개월 약정 예제</b><span>{guide.example}</span></aside></>
  } else if (guide.kind === 'application-packets') {
    label = '신청정보·첨부정보 서류함'
    body = <><div className="cx-packet-split"><section><strong>신청정보</strong><small>무엇을 등기할지 특정</small>{guide.application.map(x=><span key={x}>{x}</span>)}</section><section><strong>첨부정보</strong><small>신청의 진실성과 권한 증명</small>{guide.attachments.map(x=><span key={x}>{x}</span>)}</section></div><div className="cx-id-checks">{guide.notRequired.map(x=><span key={x}>신청정보 X · {x}</span>)}</div><aside className="cx-info-note">{guide.deedInfo}</aside></>
  } else if (guide.kind === 'property-tax-sort') {
    label = '재산세 과세대상 분류기'
    body = <><div className="cx-tax-buckets">{guide.buckets.map(x=><section key={x.name}><strong>{x.name}</strong>{x.items.map(i=><span key={i}>{i}</span>)}</section>)}</div><div className="cx-mixed-building"><section style={{flexBasis:`${guide.mixed.nonHousing}%`}}>비주거 {guide.mixed.nonHousing}%</section><section style={{flexBasis:`${guide.mixed.housing}%`}}>주거 {guide.mixed.housing}%</section><strong>{guide.mixed.result}</strong></div><aside className="cx-special-caution"><b>경계 불명확</b><span>{guide.landRule}</span></aside></>
  } else {
    label = '장기미집행 두 시계'
    body = <><div className="cx-expiry-clocks">{guide.clocks.map(x=><section key={x.years}><strong>{x.years}</strong><b>{x.title}</b><span>{x.effect}</span></section>)}</div><div className="cx-arrow-chain">{guide.purchaseFlow.map((x,i)=><span key={x.at}><b>{x.at}</b>{x.action}{i<guide.purchaseFlow.length-1?<i>→</i>:null}</span>)}</div><div className="cx-two-lanes">{guide.nonPurchase.map(x=><section key={x.title}><strong>{x.title}</strong><span>{x.rule}</span><small>{x.note}</small></section>)}</div></>
  }
  return <article className="cx-card cx-visual-card"><SectionBlock label={label} index={5}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function FifthSixGuide({ guide }) {
  let label = '개념 전용 판별판'
  let body
  if (guide.kind === 'mortgage-scope') {
    label = '저당권 효력 경계도'
    body = <><div className="cx-scope-orbit"><section><strong>저당부동산</strong><span>담보 중심</span></section>{guide.scope.map(x=><div className={x.included?'is-in':'is-out'} key={x.item}><b>{x.included?'포함':'제외'}</b><strong>{x.item}</strong><small>{x.reason}</small></div>)}</div><div className="cx-auction-split"><section><small>처분 묶음</small><strong>{guide.auction.bundle}</strong></section><i>≠</i><section><small>우선변제 몫</small><strong>{guide.auction.priority}</strong></section></div><div className="cx-arrow-chain">{guide.rentFlow.map((x,i)=><span key={x}>{x}{i<guide.rentFlow.length-1?<i>→</i>:null}</span>)}</div></>
  } else if (guide.kind === 'ratio-workbench') {
    label = '비율분석 계산 작업대'
    body = <><div className="cx-ratio-board">{guide.metrics.map(x=><section key={x.name}><strong>{x.name}</strong><span>{x.numerator}</span><i>÷</i><span>{x.denominator}</span><b>{x.read}</b></section>)}</div><div className="cx-worked-example"><small>DCR 예제</small><span>{guide.example.input}</span><i>→</i><strong>{guide.example.math}</strong><b>{guide.example.answer}</b></div><div className="cx-danger-formula"><strong>채무불이행률</strong><span>{guide.defaultRate}</span></div></>
  } else if (guide.kind === 'explanation-matrix') {
    label = '확인·설명서 4종 매트릭스'
    body = <><div className="cx-form-legend">{guide.forms.map(x=><span key={x.code}><b>{x.code}</b>{x.name}</span>)}</div><div className="cx-form-matrix"><div><b>확인 항목</b>{guide.forms.map(x=><b key={x.code}>{x.code}</b>)}</div>{guide.items.map(x=><div key={x.item}><strong>{x.item}</strong>{x.present.map((v,i)=><span className={v?'is-yes':'is-no'} key={guide.forms[i].code}>{v?'●':'—'}</span>)}</div>)}</div><aside className="cx-info-note">{guide.boundary}</aside></>
  } else if (guide.kind === 'registration-applicants') {
    label = '공동·단독신청 분기표'
    body = <><div className="cx-applicant-gate"><strong>{guide.principle}</strong><i>원칙</i><span>등기권리자</span><b>＋</b><span>등기의무자</span></div><div className="cx-solo-cases">{guide.solo.map(x=><section key={x.case}><strong>{x.case}</strong><span>{x.applicant}</span><small>{x.why}</small></section>)}</div><div className="cx-counter-row">{guide.jointStill.map(x=><span key={x}>공동신청 유지 · {x}</span>)}</div></>
  } else if (guide.kind === 'tax-relief-clock') {
    label = '양도세 특례 시간표'
    body = <><div className="cx-relief-clocks">{guide.clocks.map(x=><section key={x.name}><strong>{x.name}</strong><b>{x.period}</b><span>{x.condition}</span><small>{x.action}</small></section>)}</div><div className="cx-tax-switches">{guide.switches.map(x=><section key={x.title}><strong>{x.title}</strong><span>{x.rule}</span></section>)}</div><aside className="cx-special-caution"><b>현행 기준</b><span>{guide.currentNote}</span></aside></>
  } else {
    label = '도시·군관리계획 결정권 지도'
    body = <><div className="cx-authority-map">{guide.authorities.map(x=><section key={x.actor}><strong>{x.actor}</strong>{x.matters.map(m=><span key={m}>{m}</span>)}</section>)}</div><div className="cx-effective-day"><span>도시·군관리계획 결정</span><i>→ 지형도면 고시 →</i><strong>{guide.effect}</strong></div><div className="cx-two-lanes">{guide.startedWork.map(x=><section key={x.zone}><strong>{x.zone}</strong><span>{x.rule}</span><small>{x.action}</small></section>)}</div></>
  }
  return <article className="cx-card cx-visual-card"><SectionBlock label={label} index={5}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function FourthSixGuide({ guide }) {
  let label = '개념 전용 실전판'
  let body
  if (guide.kind === 'joint-mortgage') {
    label = '공동저당 배당·확정 지도'
    body = <><div className="cx-joint-bars">{guide.properties.map(x=><section key={x.name}><strong>{x.name}</strong><div><i style={{width:`${x.value}%`}}/><b>{x.value}억</b></div><span>동시배당 부담 {x.share}억</span></section>)}</div><div className="cx-two-lanes">{guide.distribution.map(x=><section key={x.mode}><strong>{x.mode}</strong><span>{x.rule}</span><small>{x.after}</small></section>)}</div><div className="cx-fix-timeline">{guide.fixing.map((x,i)=><span key={x}>{x}{i<guide.fixing.length-1?<i>→</i>:null}</span>)}</div><aside className="cx-special-caution"><b>최고액 한도</b><span>{guide.cap}</span></aside></>
  } else if (guide.kind === 'elasticity-calculation') {
    label = '탄력성 계산 작업대'
    body = <><div className="cx-formula-cards">{guide.formulas.map(x=><section key={x.name}><strong>{x.name}</strong><span>{x.formula}</span><small>{x.read}</small></section>)}</div><div className="cx-sign-sort">{guide.signs.map(x=><section key={x.sign}><b>{x.sign}</b><strong>{x.relation}</strong><span>{x.meaning}</span></section>)}</div><div className="cx-worked-example"><small>계산 예제</small><span>{guide.example.input}</span><i>→</i><strong>{guide.example.math}</strong><b>{guide.example.answer}</b></div><div className="cx-arrow-chain">{guide.totalEffect.map((x,i)=><span key={x}>{x}{i<guide.totalEffect.length-1?<i>＋</i>:null}</span>)}</div></>
  } else if (guide.kind === 'broker-guarantee') {
    label = '손해배상 보증 안전망'
    body = <><div className="cx-guarantee-blocks">{guide.amounts.map(x=><section key={x.type}><strong>{x.type}</strong><b>{x.amount}</b><span>{x.extra}</span></section>)}</div><div className="cx-arrow-chain">{guide.startFlow.map((x,i)=><span key={x}>{x}{i<guide.startFlow.length-1?<i>→</i>:null}</span>)}</div><div className="cx-two-lanes">{guide.maintenance.map(x=><section key={x.event}><strong>{x.event}</strong><span>{x.action}</span><small>{x.deadline}</small></section>)}</div><aside className="cx-info-note">{guide.scope}</aside></>
  } else if (guide.kind === 'provisional-registration') {
    label = '가등기 효력 두 시계'
    body = <><div className="cx-eligibility">{guide.eligibility.map(x=><section className={x.allowed?'is-pass':'is-stop'} key={x.claim}><b>{x.allowed?'O':'X'}</b><strong>{x.claim}</strong><span>{x.note}</span></section>)}</div><div className="cx-two-lanes">{guide.application.map(x=><section key={x.mode}><strong>{x.mode}</strong><span>{x.route}</span><small>{x.paper}</small></section>)}</div><div className="cx-effect-clocks">{guide.effects.map(x=><section key={x.name}><strong>{x.name}</strong><b>{x.when}</b><span>{x.rule}</span></section>)}</div></>
  } else if (guide.kind === 'capital-gain-machine') {
    label = '양도차익 계산기 3대'
    body = <><div className="cx-tax-machines">{guide.machines.map(x=><section key={x.name}><strong>{x.name}</strong><span>{x.formula}</span><small>{x.when}</small></section>)}</div><div className="cx-worked-example"><small>고가주택 예제</small><span>{guide.example.input}</span><i>→</i><strong>{guide.example.math}</strong><b>{guide.example.answer}</b></div><aside className="cx-special-caution"><b>부담부증여</b><span>{guide.debtGift}</span></aside></>
  } else {
    label = '정비사업 동의율 계기판'
    body = <><div className="cx-consent-meters">{guide.thresholds.map(x=><section key={x.type}><strong>{x.type}</strong><div><i style={{width:x.people}}/><b>인원 {x.people}</b></div><div><i style={{width:x.land}}/><b>면적 {x.land}</b></div><small>{x.note}</small></section>)}</div><div className="cx-two-lanes">{guide.routes.map(x=><section key={x.title}><strong>{x.title}</strong><span>{x.condition}</span><small>{x.result}</small></section>)}</div><div className="cx-fix-timeline">{guide.timer.map((x,i)=><span key={x}>{x}{i<guide.timer.length-1?<i>→</i>:null}</span>)}</div></>
  }
  return <article className="cx-card cx-visual-card"><SectionBlock label={label} index={5}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function ThirdSixGuide({ guide }) {
  let label = '개념 전용 구조'
  let body
  if (guide.kind === 'void-effects') {
    label = '무효 이후 3갈래'
    body = <><div className="cx-effect-paths">{guide.paths.map(x=><section key={x.name}><strong>{x.name}</strong><small>{x.condition}</small><span>{x.effect}</span><b>{x.time}</b></section>)}</div><div className="cx-conversion-test">{guide.conversionTest.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div><div className="cx-counter-row">{guide.invalid.map(x=><span key={x}>유효화 X · {x}</span>)}</div><div className="cx-before-after"><span>{guide.sample.before}</span><i>＋ {guide.sample.event} →</i><strong>{guide.sample.after}</strong></div></>
  } else if (guide.kind === 'elasticity-market') {
    label = '공급탄력성 반응 그래프'
    body = <><div className="cx-elastic-curves">{guide.curves.map(x=><section key={x.type}><strong>{x.type}</strong><div><i style={{height:`${x.price}%`}}/><b style={{width:`${x.quantity}%`}}/></div><small>{x.cue}</small></section>)}</div><div className="cx-movement-table">{guide.movement.map(x=><div key={x.cause}><strong>{x.cause}</strong><span>{x.result}</span></div>)}</div><div className="cx-reinvest"><span>{guide.horizons.short}</span><span>{guide.horizons.long}</span></div><aside className="cx-info-note">{guide.tax}</aside></>
  } else if (guide.kind === 'prohibited-conduct') {
    label = '금지행위 위험구역'
    body = <><div className="cx-ban-groups">{guide.groups.map(x=><section key={x.title}><strong>{x.title}</strong>{x.items.map(i=><span key={i}>{i}</span>)}</section>)}</div><div className="cx-ban-compare">{guide.notAlways.map(x=><section key={x.act}><span>{x.act}</span><strong>{x.verdict}</strong></section>)}</div></>
  } else if (guide.kind === 'usufruct-registry') {
    label = '용익권 등기 슬롯'
    body = <><div className="cx-right-slots">{guide.rights.map(x=><section key={x.name}><strong>{x.name}</strong><div>{x.essentials.map(e=><span key={e}>{e}</span>)}</div><b>{x.money}</b></section>)}</div><div className="cx-partial-land"><span>{guide.partialLand.whole}</span><i>→ 일부 설정 →</i><span>{guide.partialLand.part}<b>{guide.partialLand.attachment}</b></span></div><div className="cx-servitude"><section><b>요역지</b>{guide.servantDominant.dominant}</section><i>편익 ←</i><section><b>승역지</b>{guide.servantDominant.servant}<small>{guide.servantDominant.record}</small></section></div></>
  } else if (guide.kind === 'acquisition-clock') {
    label = '취득시기 4개 시계'
    body = <><div className="cx-acq-clocks">{guide.clocks.map(x=><section key={x.type}><span>◷</span><strong>{x.type}</strong><b>{x.primary}</b><small>{x.override}</small></section>)}</div><aside className="cx-info-note">{guide.substance}</aside><div className="cx-arrow-chain">{guide.exampleLine.map((x,i)=><span key={x}>{x}{i<guide.exampleLine.length-1?<i>→</i>:null}</span>)}</div></>
  } else {
    label = '두 구역 처방 비교'
    body = <><div className="cx-district-table"><div><b>구분</b><b>개발밀도관리구역</b><b>기반시설부담구역</b></div>{guide.comparison.map(x=><div key={x.axis}><strong>{x.axis}</strong><span>{x.density}</span><span>{x.charge}</span></div>)}</div><div className="cx-density-layout"><section><small>용적률 강화 모형</small><div><i style={{height:`${guide.densityGauge.normal}%`}}>기준 100</i><i style={{height:`${guide.densityGauge.reduced}%`}}>강화 50</i></div><p>{guide.densityGauge.note}</p></section><section><small>철거 후 신축 비용부과</small><div className="cx-building-bars"><i style={{height:`${guide.demolition.existing/10}%`}}>기존 {guide.demolition.existing}</i><i style={{height:`${guide.demolition.newBuild/10}%`}}>신축 {guide.demolition.newBuild}</i></div><b>부과 {guide.demolition.charged}㎡</b><p>{guide.demolition.note}</p></section></div><div className="cx-arrow-chain">{guide.chargeFlow.map((x,i)=><span key={x}>{x}{i<guide.chargeFlow.length-1?<i>→</i>:null}</span>)}</div><aside className="cx-special-caution"><b>자동 해제</b><span>{guide.caution}</span></aside></>
  }
  return <article className="cx-card cx-visual-card"><SectionBlock label={label} index={5}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function NextSixGuide({ guide }) {
  let label = '개념 전용 지도'
  let body
  if (guide.kind === 'agency-scope') {
    label = '대리권 범위 동심원'
    body = <><div className="cx-agency-rings">{guide.rings.map(x=><section key={x.zone}><small>{x.zone}</small><strong>{x.status}</strong><div>{x.examples.map(e=><span key={e}>{e}</span>)}</div></section>)}</div><div className="cx-default-rules">{guide.defaults.map(x=><div key={x.rule}><strong>{x.rule}</strong><span>{x.answer}</span></div>)}</div><div className="cx-scenario-line"><span>{guide.scenario.grant}</span><i>→</i><span>{guide.scenario.receive}</span><i>≠</i><span>{guide.scenario.cancel}</span><b>{guide.scenario.verdict}</b></div></>
  } else if (guide.kind === 'investment-metrics') {
    label = '투자지표 3개 계기판'
    body = <><div className="cx-metric-cards">{guide.metrics.map(x=><section className={`cx-metric--${x.color}`} key={x.name}><small>{x.unit}</small><strong>{x.name}</strong><span>{x.formula}</span><b>채택 {x.accept}</b></section>)}</div><div className="cx-equivalence">{guide.equivalence.map((x,i)=><span key={x}>{x}{i<guide.equivalence.length-1?<i>⇔</i>:null}</span>)}</div><div className="cx-conflict-grid">{guide.conflicts.map(x=><section key={x.situation}><strong>{x.situation}</strong><span>{x.choice}</span></section>)}</div><div className="cx-reinvest"><span>{guide.reinvestment.npv}</span><span>{guide.reinvestment.irr}</span></div><aside className="cx-metric-sample"><b>예제</b><span>초기투자 {guide.sample.outlay} · 유입현가 {guide.sample.inflowPv} · NPV {guide.sample.npv} · PI {guide.sample.pi}</span><strong>{guide.sample.decision}</strong></aside></>
  } else if (guide.kind === 'broker-roles') {
    label = '중개업 종사자 역할표'
    body = <><div className="cx-role-cards">{guide.roles.map(x=><section key={x.name}><strong>{x.name}</strong><b>{x.license}</b><span>{x.registration}</span><small>{x.work}</small></section>)}</div><aside className="cx-info-note">{guide.corporation}</aside><div className="cx-boundary-row">{guide.boundary.map(x=><span key={x}>{x}</span>)}</div></>
  } else if (guide.kind === 'special-registration') {
    label = '특수 등기신청 4서랍'
    body = <><div className="cx-proxy-map"><span><b>{guide.proxy.creditor}</b>{guide.proxy.action}</span><i>→</i><span><b>{guide.proxy.debtor}</b>{guide.proxy.notice}</span><small>{guide.proxy.attachment}</small></div><div className="cx-special-reg-grid"><section><h4>계약서 검인</h4>{guide.inspections.map(x=><div key={x.cause}><b>{x.needed?'O':'X'}</b><span>{x.cause}</span></div>)}</section><section><h4>말소 승낙</h4>{guide.consent.map(x=><div key={x.right}><b>{x.needed?'필요':'불필요'}</b><span>{x.right}<small>{x.why}</small></span></div>)}</section></div><div className="cx-promptly"><b>지체 없이</b>{guide.promptly.map(x=><span key={x}>{x}</span>)}</div></>
  } else if (guide.kind === 'registration-tax') {
    label = '등록면허세 납부 관문'
    body = <><div className="cx-tax-question">{guide.gate.map((x,i)=><section key={x.question}><span>{i+1}</span><strong>{x.question}</strong><b>{x.answer}</b></section>)}</div><div className="cx-arrow-chain">{guide.timeline.map((x,i)=><span key={x}>{x}{i<guide.timeline.length-1?<i>→</i>:null}</span>)}</div><aside className="cx-info-note">{guide.fixedTax}</aside></>
  } else {
    label = '사업계획승인 숫자 타임라인'
    body = <><div className="cx-project-numbers">{guide.milestones.map(x=><section key={x.number}><strong>{x.number}</strong><b>{x.event}</b><span>{x.base}</span></section>)}</div><div className="cx-arrow-chain">{guide.projectFlow.map((x,i)=><span key={x}>{x}{i<guide.projectFlow.length-1?<i>→</i>:null}</span>)}</div><div className="cx-extension"><section><small>연장사유</small><strong>{guide.extension.cause}</strong><b>{guide.extension.period}</b></section><section><small>연장 불가</small><strong>{guide.extension.denied}</strong></section></div><div className="cx-boundary-row">{guide.lightChanges.map(x=><span key={x}>변경승인 예외 가능 · {x}</span>)}</div></>
  }
  return <article className="cx-card cx-visual-card"><SectionBlock label={label} index={5}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function SixSubjectGuide({ guide }) {
  let body = null
  let label = '핵심 구조화'
  if (guide.kind === 'public-order-act') {
    label = '제103조 판별 회로'
    body = <><div className="cx-six-grid">{guide.gates.map((x,i)=><section key={x.question}><span>{i+1}</span><strong>{x.question}</strong><b>{x.result}</b><small>{x.example}</small></section>)}</div><div className="cx-arrow-chain">{guide.doubleSale.map((x,i)=><span key={x}>{x}{i<guide.doubleSale.length-1?<i>→</i>:null}</span>)}</div><div className="cx-chip-row">{guide.effects.map(x=><span key={x}>{x}</span>)}</div><aside className="cx-special-caution"><b>적극 가담</b><span>{guide.caution}</span></aside></>
  } else if (guide.kind === 'policy-status') {
    label = '정책수단 현행판'
    body = <><div className="cx-status-head"><b>{guide.checkedAt}</b><span>법령 개정 때 다시 확인</span></div><div className="cx-policy-active">{guide.active.map(x=><section key={x.name}><strong>{x.name}</strong><span>{x.mechanism}</span><small>{x.source}</small></section>)}</div><div className="cx-status-split"><section><b>폐지</b>{guide.abolished.map(x=><span key={x}>× {x}</span>)}</section><section><b>현행 법정제도 아님</b>{guide.unpublished.map(x=><span key={x}>{x}</span>)}</section></div><div className="cx-actor-compare">{guide.priceActors.map(x=><section key={x.price}><small>{x.price}</small><strong>{x.actor}</strong><span>{x.cycle}</span></section>)}</div></>
  } else if (guide.kind === 'broker-pause') {
    label = '휴업 기간·서류 타임라인'
    body = <><div className="cx-time-thresholds">{guide.thresholds.map(x=><section className={`cx-time--${x.tone}`} key={x.duration}><strong>{x.duration}</strong><span>{x.report}</span></section>)}</div><div className="cx-chip-row">{guide.exceptions.map(x=><span key={x}>{x}</span>)}</div><div className="cx-doc-flow">{guide.documents.map((x,i)=><section key={x.event}><span>{i+1}</span><strong>{x.event}</strong><b>{x.movement}</b><small>{x.note}</small></section>)}</div></>
  } else if (guide.kind === 'land-movement') {
    label = '토지이동 작업대'
    body = <><div className="cx-operation-grid">{guide.operations.map((x,i)=><section key={x.name}><span>{i+1}</span><strong>{x.name}</strong><small>{x.trigger}</small><b>{x.result}</b></section>)}</div><div className="cx-gate-list"><h4>합병 가능성 검사</h4>{guide.mergerGates.map(x=><div className={x.pass?'is-pass':'is-stop'} key={x.label}><b>{x.pass?'O':'X'}</b><span>{x.label}</span></div>)}</div><aside className="cx-info-note">{guide.correction}</aside></>
  } else if (guide.kind === 'tax-gates') {
    label = '취득세 비과세 관문'
    body = <><div className="cx-tax-doors">{guide.exemptions.map(x=><section key={x.case}><strong>{x.case}</strong><span>{x.gate}</span><b>{x.result}</b></section>)}</div><div className="cx-counter-row">{guide.counterexamples.map(x=><span key={x}>과세: {x}</span>)}</div><div className="cx-arrow-chain">{guide.timeline.map((x,i)=><span key={x.at}><b>{x.at}</b>{x.action}{i<guide.timeline.length-1?<i>→</i>:null}</span>)}</div></>
  } else {
    label = '지역주택조합 수치 지도'
    body = <><div className="cx-land-stages">{guide.landStages.map(x=><section key={x.stage}><strong>{x.stage}</strong><div><i style={{width:`${x.use}%`}}/><b>사용권원 {x.use}%</b></div>{x.ownership?<span>소유권 {x.ownership}% 이상</span>:null}<small>{x.note}</small></section>)}</div><div className="cx-member-box"><section><small>조합원 문턱</small><strong>{guide.members.floor}</strong><b>{guide.members.minimum}</b></section><i>→</i><p>{guide.members.refill}</p></div><div className="cx-rule-list">{guide.rules.map(x=><div key={x.item}><strong>{x.item}</strong><span>{x.rule}</span></div>)}</div></>
  }
  return <article className="cx-card cx-visual-card"><SectionBlock label={label} index={5}><p className="cx-special-lede">{guide.summary}</p>{body}<GuideSources sources={guide.sources}/></SectionBlock></article>
}

function RegistrationProcedureGuide({ guide }) {
  return <article className="cx-card cx-visual-card"><SectionBlock label="등기절차 4관문" index={5}>
    <p className="cx-special-lede">{guide.summary}</p>
    <div className="cx-id-grid">{guide.identifiers.map(item => <section key={item.subject}><small>{item.subject}</small><strong>{item.issuer}</strong><span>{item.note}</span></section>)}</div>
    <section className="cx-public-gate"><div><small>공시의 문</small><strong>{guide.access.who}</strong><span>{guide.access.actions.join(' · ')}</span></div><p>{guide.access.rule}</p></section>
    <div className="cx-reg-procedure">{guide.flow.map((item, i) => <div key={item.step}><span>{i + 1}</span><strong>{item.step}</strong><small>{item.detail}</small>{i < guide.flow.length - 1 ? <i>→</i> : null}</div>)}</div>
    <div className="cx-procedure-bottom"><aside><b>{guide.objection.rule}</b><span>{guide.objection.route}</span><p>{guide.objection.caution}</p></aside><section>{guide.electronic.map(item => <div className={item.allowed ? 'is-yes' : 'is-no'} key={item.subject}><b>{item.allowed ? 'O' : 'X'}</b><span><strong>{item.subject}</strong><small>{item.note}</small></span></div>)}</section></div>
    <GuideSources sources={guide.sources} />
  </SectionBlock></article>
}

function HousingDefinitionsGuide({ guide }) {
  return <article className="cx-card cx-visual-card"><SectionBlock label="주택법 공간 분류도" index={5}>
    <p className="cx-special-lede">{guide.summary}</p>
    <figure className="cx-site-separators"><figcaption>하나의 주택단지를 가르는 경계</figcaption><div className="cx-site-separators__plots"><span>주택단지 A</span><i /><span>주택단지 B</span></div>{guide.separators.map(item => <div key={item.name}><strong>{item.name}</strong><span>{item.width}</span></div>)}</figure>
    <div className="cx-housing-gauge">{guide.nationalHousing.map(item => <section key={item.area}><strong>{item.area}</strong><span>{item.place}</span><i /></section>)}</div>
    <div className="cx-facility-sort">{guide.facilities.map(item => <section key={item.type}><small>{item.cue}</small><strong>{item.type}</strong><div>{item.examples.map(x => <span key={x}>{x}</span>)}</div></section>)}</div>
    <div className="cx-quasi-strip"><b>준주택 4종</b>{guide.quasi.map((x, i) => <span key={x}><i>{i + 1}</i>{x}</span>)}</div>
    <aside className="cx-special-caution"><b>명칭 함정</b><span>{guide.caution}</span></aside><GuideSources sources={guide.sources} />
  </SectionBlock></article>
}

function RentTheoriesGuide({ guide }) {
  return <article className="cx-card cx-visual-card"><SectionBlock label="지대이론 원인 지도" index={5}>
    <p className="cx-special-lede">{guide.summary}</p>
    <div className="cx-rent-theories">{guide.theories.map(item => <section className={`cx-rent--${item.tone}`} key={item.name}><small>{item.scholar}</small><strong>{item.name}</strong><p>{item.cause}</p><b>{item.key}</b></section>)}</div>
    <div className="cx-rent-layout"><figure className="cx-grade-chart"><figcaption>리카도: 생산성 격차가 지대로</figcaption>{guide.grades.map(item => <div key={item.land}><span>{item.land}</span><i style={{'--rent':`${item.rent}%`}} /><strong>{item.rent}</strong><small>산출 {item.output} − 비용 {item.cost}</small></div>)}</figure><figure className="cx-distance-rent"><figcaption>튀넨: 시장에서 멀어질수록</figcaption><div className="cx-distance-rent__curve" />{guide.distance.map(item => <span key={item}>{item}</span>)}</figure></div>
    <div className="cx-quasi-time"><span>{guide.timeSwitch.short}</span><i>→</i><span>{guide.timeSwitch.long}</span></div>
    <aside className="cx-special-caution"><b>인과방향 함정</b><span>{guide.caution}</span></aside><GuideSources sources={guide.sources} />
  </SectionBlock></article>
}

function UrbanModelsGuide({ guide }) {
  return <article className="cx-card cx-visual-card"><SectionBlock label="도시구조 3모형" index={5}>
    <p className="cx-special-lede">{guide.summary}</p>
    <div className="cx-urban-models">{guide.models.map(item => <section key={item.name}><div className={`cx-city cx-city--${item.type}`}>{item.type === 'nuclei' ? <><i/><i/><i/><i/></> : null}</div><small>{item.scholar}</small><strong>{item.name}</strong><b>{item.cue}</b><p>{item.explanation}</p></section>)}</div>
    <div className="cx-urban-table"><div><b>판별 질문</b><b>동심원</b><b>선형</b><b>다핵심</b></div>{guide.comparison.map(row => <div key={row.question}><strong>{row.question}</strong><span>{row.rings}</span><span>{row.sectors}</span><span>{row.nuclei}</span></div>)}</div>
    <aside className="cx-christaller"><b>분석 단위가 다른 크리스탈러</b><span>{guide.christaller}</span></aside><GuideSources sources={guide.sources} />
  </SectionBlock></article>
}

function GuideSources({ sources }) {
  return (
    <div className="cx-sources">
      <span className="cx-sources__title">원문 근거 · 직접 확인</span>
      {sources.map((source) => (
        <a key={source.label} href={source.href} target="_blank" rel="noreferrer"><strong>{source.label}</strong><span>{source.note}</span><i aria-hidden>↗</i></a>
      ))}
    </div>
  )
}

function RegistrationEffectsGuide({ guide }) {
  return (
    <article className="cx-card cx-visual-card"><SectionBlock label="등기 효력 4관문" index={5}>
      <p className="cx-special-lede">{guide.summary}</p>
      <div className="cx-reg-gates">{guide.gates.map((gate, i) => <div key={gate.title} style={{ '--cx-delay': `${i * 70}ms` }}><span aria-hidden>{gate.icon}</span><small>{gate.cue}</small><strong>{gate.title}</strong><p>{gate.body}</p></div>)}</div>
      <div className="cx-reg-layout">
        <figure className="cx-reg-timeline"><figcaption>같은 날 신청이 겹치면</figcaption>{guide.timeline.map((event, i) => <div key={event.at}><time>{event.at}</time><span>{event.label}</span><strong>{event.rank}</strong>{i < guide.timeline.length - 1 ? <i aria-hidden /> : null}</div>)}</figure>
        <section className="cx-effect-stack"><h4>서로 다른 ‘등기의 효력’</h4>{guide.effects.map(effect => <div key={effect.name}><strong>{effect.name}</strong><span>{effect.rule}</span><small>{effect.sourceType}</small></div>)}</section>
      </div>
      <div className="cx-delete-flow"><h4>말소 전 제3자 점검</h4><div>{guide.deletion.map((step, i) => <span key={step}><b>{i + 1}</b>{step}{i < guide.deletion.length - 1 ? <i aria-hidden>→</i> : null}</span>)}</div></div>
      <aside className="cx-special-caution"><b>용어 분리</b><span>{guide.caution}</span></aside>
      <GuideSources sources={guide.sources} />
    </SectionBlock></article>
  )
}

function ReturnRiskGuide({ guide }) {
  return (
    <article className="cx-card cx-visual-card"><SectionBlock label="수익률 문턱 그래프" index={5}>
      <p className="cx-special-lede">{guide.summary}</p>
      <div className="cx-return-formula">{guide.formula.map((item, i) => <div key={item.term} className={`cx-return-formula__${item.tone}`}><small>{item.value}</small><strong>{item.term}</strong>{i < guide.formula.length - 1 ? <i aria-hidden>{i === 0 ? '+' : '='}</i> : null}</div>)}</div>
      <div className="cx-hurdle-cases">{guide.cases.map(item => <figure key={item.verdict} className={`cx-hurdle cx-hurdle--${item.tone}`}><figcaption><strong>{item.verdict}</strong><span>{item.reason}</span></figcaption><div className="cx-hurdle__plot" aria-label={`기대수익률 ${item.expected}%, 요구수익률 ${item.required}%`}><span className="cx-hurdle__required" style={{ '--value': `${item.required * 8}%` }}><b>요구 {item.required}%</b></span><span className="cx-hurdle__expected" style={{ '--value': `${item.expected * 8}%` }}><b>기대 {item.expected}%</b></span></div></figure>)}</div>
      <div className="cx-risk-grid">{guide.riskTypes.map(item => <div key={item.name}><strong>{item.name}</strong><small>{item.signal}</small><p>{item.example}</p></div>)}</div>
      <div className="cx-diversify"><section><b>분산 가능</b><span>{guide.diversification.reducible}</span></section><section><b>분산 불가</b><span>{guide.diversification.irreducible}</span></section></div>
      <aside className="cx-shift-note"><b>요구수익률을 올리는 신호</b>{guide.shifts.map(item => <span key={item}>↑ {item}</span>)}</aside>
      <GuideSources sources={guide.sources} />
    </SectionBlock></article>
  )
}

function ShamRelationGuide({ guide }) {
  return (
    <article className="cx-card cx-visual-card"><SectionBlock label="통정허위표시 관계도" index={5}>
      <p className="cx-special-lede">{guide.summary}</p>
      <div className="cx-sham-diagram">{guide.parties.map((party, i) => <div className={`cx-sham-party cx-sham-party--${i + 1}`} key={party.role}><span>{party.role}</span><strong>{party.label}</strong><small>{party.note}</small></div>)}{guide.relations.map((relation, i) => <div className={`cx-sham-link cx-sham-link--${i + 1}`} key={relation.title}><b>{relation.title}</b><strong>{relation.result}</strong><small>{relation.detail}</small></div>)}</div>
      <div className="cx-sham-layout"><section className="cx-sham-test"><h4>3단계 판별</h4>{guide.test.map(([number, question, answer]) => <div key={number}><span>{number}</span><p><strong>{question}</strong><small>{answer}</small></p></div>)}</section><section className="cx-sham-case"><h4>강제집행 회피 사례</h4><p>{guide.scenario}</p></section></div>
      <aside className="cx-burden-note"><span aria-hidden>⚖</span><div><b>선의와 증명책임</b><p>{guide.burden}</p></div></aside>
      <aside className="cx-special-caution"><b>제3자 범위</b><span>{guide.caution}</span></aside>
      <GuideSources sources={guide.sources} />
    </SectionBlock></article>
  )
}

function AppraisalSystemGuide({ guide }) {
  return (
    <article className="cx-card cx-visual-card"><SectionBlock label="감정평가 개념 체계도" index={5}>
      <p className="cx-special-lede">{guide.summary}</p>
      <section className="cx-value-standard"><div><small>원칙적 기준가치</small><strong>{guide.valueStandard.default}</strong><p>{guide.valueStandard.definition}</p></div><i aria-hidden>→</i><div><small>예외가 가능한 경우</small>{guide.valueStandard.exceptions.map(item => <span key={item}>{item}</span>)}<b>{guide.valueStandard.safeguard}</b></div></section>
      <div className="cx-appraisal-layout">
        <figure className="cx-region-rings"><figcaption>자료를 찾는 공간의 범위</figcaption><div>{guide.regions.slice().reverse().map(item => <span className={`cx-region-ring cx-region-ring--${item.size}`} key={item.name}><strong>{item.name}</strong><small>{item.cue}</small></span>)}</div></figure>
        <section className="cx-appraisal-time"><h4>{guide.timing.label}</h4><strong>{guide.timing.rule}</strong><span>예외</span><p>{guide.timing.exception}</p><div>{guide.units.map(item => <article key={item.type}><b>{item.type}</b><small>{item.when}</small></article>)}</div></section>
      </div>
      <div className="cx-method-strip">{guide.methods.map(item => <div key={item.name}><strong>{item.name}</strong><span>{item.equation}</span><small>{item.trap}</small></div>)}</div>
      <GuideSources sources={guide.sources} />
    </SectionBlock></article>
  )
}

function OwnershipChainGuide({ guide }) {
  const renderFlow = (flow) => <div className="cx-owner-flow">{flow.map((item, i) => <div key={`${item.party}-${item.role}`}><span>{item.party}</span><strong>{item.role}</strong><small>{item.state}</small>{i < flow.length - 1 ? <i aria-hidden>→</i> : null}</div>)}</div>
  return (
    <article className="cx-card cx-visual-card"><SectionBlock label="소유권 등기 명의 흐름" index={5}>
      <p className="cx-special-lede">{guide.summary}</p>
      <section className="cx-owner-case"><h4>미등기 신축건물을 매수한 경우</h4>{renderFlow(guide.buildingFlow)}<aside><b>X 바로가기</b><span>{guide.wrongShortcut}</span></aside></section>
      <section className="cx-owner-case cx-owner-case--succession"><h4>등기의무자가 사망한 경우</h4>{renderFlow(guide.successionFlow)}<p>{guide.successionNote}</p></section>
      <div className="cx-applicant-table"><div><b>상황</b><b>신청인</b><b>방식</b></div>{guide.applicantRules.map(item => <div key={item.case}><strong>{item.case}</strong><span>{item.applicant}</span><em>{item.method}</em></div>)}</div>
      <aside className="cx-expropriation"><span aria-hidden>⚑</span><div><b>수용은 권리 흐름을 끊는다</b><p>{guide.expropriation}</p></div></aside>
      <GuideSources sources={guide.sources} />
    </SectionBlock></article>
  )
}

function CancellationTimerGuide({ guide }) {
  return (
    <article className="cx-card cx-visual-card"><SectionBlock label="취소권 이중 타이머" index={5}>
      <p className="cx-special-lede">{guide.summary}</p>
      <div className="cx-cancel-clocks">{guide.clocks.map(clock => <section className={`cx-cancel-clock cx-cancel-clock--${clock.tone}`} key={clock.duration}><div><span /><b>{clock.duration}</b></div><article><small>출발점</small><strong>{clock.starts}</strong><p>{clock.meaning}</p></article></section>)}</div>
      <figure className="cx-cancel-timeline"><figcaption>두 기간은 이렇게 함께 계산한다</figcaption><div><span><b>행위</b>{guide.sample.act}</span><i /><span><b>3년 출발</b>{guide.sample.ratifiable}</span><i /><span><b>3년 만료</b>{guide.sample.threeYearEnd}</span><i /><span className="cx-cancel-timeline__late"><b>10년 만료</b>{guide.sample.tenYearEnd}</span></div><strong>{guide.sample.result}</strong></figure>
      <div className="cx-ratification"><h4>말하지 않아도 추인으로 보는 행동</h4>{guide.statutoryRatification.map(item => <div className={item.included ? '' : 'cx-ratification__no'} key={item.act}><span>{item.included ? 'O' : 'X'}</span><strong>{item.act}</strong><small>{item.actor}</small></div>)}</div>
      <div className="cx-cancel-effect"><section><b>취소의 효과</b><span>{guide.restitution.rule}</span></section><section><b>제한능력자 특칙</b><span>{guide.restitution.limited}</span></section></div>
      <aside className="cx-special-caution"><b>기산점 함정</b><span>{guide.caution}</span></aside>
      <GuideSources sources={guide.sources} />
    </SectionBlock></article>
  )
}

function LandVocabularyGuide({ guide }) {
  return (
    <article className="cx-card cx-visual-card"><SectionBlock label="토지용어 판별 지도" index={5}>
      <p className="cx-special-lede">{guide.summary}</p>
      <div className="cx-land-transition"><h4>이행지 vs 후보지</h4>{guide.transitions.map(item => <div key={`${item.from}-${item.to}`}><span>{item.from}</span><i aria-hidden>→</i><span>{item.to}</span><small>{item.scope}</small><strong>{item.answer}</strong></div>)}</div>
      <figure className="cx-shore"><figcaption>육지에서 물속까지 단면으로 구분</figcaption><div>{guide.shore.map(item => <section className={`cx-shore__level-${item.level}`} key={item.name}><strong>{item.name}</strong><span>{item.state}</span><small>{item.owner}</small></section>)}</div></figure>
      <div className="cx-land-units">{guide.units.map(item => <div key={item.name}><span aria-hidden>{item.icon}</span><strong>{item.name}</strong><small>{item.axis}</small><p>{item.definition}</p></div>)}</div>
      <aside className="cx-quick-quiz"><b>문제에서 먼저 묻기</b>{guide.quiz.map((item, i) => <span key={item}>{i + 1}. {item}</span>)}</aside>
      <GuideSources sources={guide.sources} />
    </SectionBlock></article>
  )
}

function LandCausalityGuide({ guide }) {
  return (
    <article className="cx-card cx-visual-card"><SectionBlock label="토지특성 인과지도" index={5}>
      <p className="cx-special-lede">{guide.summary}</p>
      <div className="cx-trait-map">{guide.traits.map((trait, i) => <section className={`cx-trait cx-trait--${trait.color}`} style={{'--cx-delay':`${i * 65}ms`}} key={trait.name}><header><span>{trait.name}</span><small>{trait.cue}</small></header><i aria-hidden>↓</i><div>{trait.effects.map(effect => <b key={effect}>{effect}</b>)}</div></section>)}</div>
      <div className="cx-supply-split"><section><small>{guide.supply.physical.label}</small><strong>{guide.supply.physical.value}</strong><p>{guide.supply.physical.result}</p></section><i aria-hidden>≠</i><section><small>{guide.supply.economic.label}</small><strong>{guide.supply.economic.value}</strong><p>{guide.supply.economic.result}</p></section></div>
      <div className="cx-cause-table"><div><b>출제 현상</b><b>연결할 특성</b></div>{guide.distinction.map(item => <div key={item.phenomenon}><strong>{item.phenomenon}</strong><span>{item.causes.join(' + ')}</span></div>)}</div>
      <aside className="cx-special-caution"><b>범위 함정</b><span>{guide.caution}</span></aside>
      <GuideSources sources={guide.sources} />
    </SectionBlock></article>
  )
}

function BrokerRegistrationGuide({ guide }) {
  return (
    <article className="cx-card cx-visual-card"><SectionBlock label="개설등록 절차 지도" index={5}>
      <p className="cx-special-lede">{guide.summary}</p>
      <div className="cx-applicant-gate">{guide.applicants.map(item => <div className={item.allowed ? 'cx-applicant--yes' : 'cx-applicant--no'} key={item.name}><span>{item.allowed ? 'O' : 'X'}</span><strong>{item.name}</strong><small>{item.note}</small></div>)}</div>
      <div className="cx-registration-process">{guide.process.map((item, i) => <div key={item.step}><span>{i + 1}</span><strong>{item.step}</strong><small>{item.detail}</small>{i < guide.process.length - 1 ? <i aria-hidden>→</i> : null}</div>)}</div>
      <div className="cx-registration-bottom"><section><h4>사무소 사용권 확보 방법</h4><div>{guide.officeUse.map(item => <span key={item}>{item}</span>)}</div><p>{guide.officeRule}</p></section><section className="cx-notify-direction"><h4>통보 방향</h4><div><strong>{guide.arrows.from}</strong><i aria-hidden>→</i><strong>{guide.arrows.to}</strong></div><small>{guide.arrows.deadline}</small></section></div>
      <aside className="cx-registration-cancel"><b>필요적 등록취소</b><span>{guide.cancellation}</span></aside>
      <GuideSources sources={guide.sources} />
    </SectionBlock></article>
  )
}

function BrokerageFeeGuide({ guide }) {
  return (
    <article className="cx-card cx-visual-card"><SectionBlock label="중개보수 판단 회로" index={5}>
      <p className="cx-special-lede">{guide.summary}</p>
      <div className="cx-fee-routing">{guide.routing.map(item => <section key={item.object}><strong>{item.object}</strong><span>{item.rule}</span><small>{item.jurisdiction}</small></section>)}</div>
      <div className="cx-fee-layout"><section className="cx-fee-decision"><h4>계산 전 4문항</h4>{guide.decision.map(([number, question, answer]) => <div key={number}><span>{number}</span><p><strong>{question}</strong><small>{answer}</small></p></div>)}</section><figure className="cx-fee-case"><figcaption>관할 조례 사례</figcaption><p>{guide.caseStudy.situation}</p><i aria-hidden>↓</i><strong>{guide.caseStudy.answer}</strong><small>{guide.caseStudy.reason}</small></figure></div>
      <div className="cx-overcharge"><h4>초과보수는 반환하면 끝?</h4>{guide.overcharge.map((item, i) => <div className={`cx-overcharge--${item.tone}`} key={item.stage}><span>{item.stage}</span><strong>{item.result}</strong>{i < guide.overcharge.length - 1 ? <i aria-hidden>→</i> : null}</div>)}</div>
      <aside className="cx-fee-nuance"><b>적용범위 구분</b><span>{guide.nuance}</span></aside>
      <GuideSources sources={guide.sources} />
    </SectionBlock></article>
  )
}

function RegistryVisualGuide({ guide }) {
  if (guide.variant === 'land-category') {
    return (
      <article className="cx-card cx-visual-card"><SectionBlock label="지목 판별 지도" index={5}>
        <p className="cx-registry-lede">{guide.summary}</p>
        <div className="cx-land-grid">{guide.categories.map((item, i) => <div key={item.name} style={{ '--cx-delay': `${i * 60}ms` }}><span>{item.icon}</span><strong>{item.name}</strong><p>{item.rule}</p><small>{item.examples.join(' · ')}</small></div>)}</div>
        <div className="cx-junk-contrast"><h4>잡종지, 이름만 보고 고르면 틀린다</h4><div><section><b>잡종지 O</b>{guide.contrast.yes.map(x=><span key={x}>{x}</span>)}</section><section><b>잡종지 X</b>{guide.contrast.no.map(x=><span key={x}>{x}</span>)}</section></div></div>
        <GuideSources sources={guide.sources} />
      </SectionBlock></article>
    )
  }
  if (guide.variant === 'books') {
    return (
      <article className="cx-card cx-visual-card"><SectionBlock label="지적공부 정보 지도" index={5}>
        <p className="cx-registry-lede">{guide.summary}</p>
        <div className="cx-books">{guide.books.map((item, i)=><div key={item.book} className={`cx-book cx-book--${item.accent}`} style={{'--cx-delay':`${i*60}ms`}}><span aria-hidden /><div><strong>{item.book}</strong><small>{item.role}</small><p>{item.items}</p></div></div>)}</div>
        <aside className="cx-coordinate-note"><span aria-hidden>⌖</span><p>{guide.coordinateNote}</p></aside>
        <GuideSources sources={guide.sources} />
      </SectionBlock></article>
    )
  }
  return (
    <article className="cx-card cx-visual-card"><SectionBlock label="축척변경 절차도" index={5}>
      <div className="cx-scale-head"><p>{guide.summary}</p><strong>{guide.consent}</strong></div>
      <div className="cx-scale-steps">{guide.steps.map((step,i)=><div key={step}><span>{i+1}</span><strong>{step}</strong>{i<guide.steps.length-1?<i aria-hidden>→</i>:null}</div>)}</div>
      <div className="cx-settlement">{guide.settlement.map(item=><div key={item.change}><span>{item.change}</span><strong>{item.money}</strong><small>{item.direction}</small></div>)}</div>
      <aside className="cx-scale-trap"><b>승인권자 함정</b><span>{guide.trap}</span></aside>
      <GuideSources sources={guide.sources} />
    </SectionBlock></article>
  )
}

function ReportProcessGuide({ guide }) {
  return (
    <article className="cx-card cx-visual-card cx-report-guide">
      <SectionBlock label="한눈에 구조화" index={5}>
        <div className="cx-report-hero"><p>{guide.summary}</p><strong><span aria-hidden>⏱</span>{guide.deadline}</strong></div>

        <div className="cx-actor-grid" aria-label="거래 유형별 신고의무자">
          {guide.actors.map((item, index) => (
            <div key={item.situation} className="cx-actor-card" style={{ '--cx-delay': `${index * 85}ms` }}>
              <span aria-hidden>{item.icon}</span><small>{item.situation}</small><strong>{item.actor}</strong><p>{item.detail}</p>
            </div>
          ))}
        </div>

        <div className="cx-process-line" aria-label="거래신고 절차">
          {guide.flow.map((step, index) => (
            <div key={step}><span>{index + 1}</span><strong>{step}</strong>{index < guide.flow.length - 1 ? <i aria-hidden>→</i> : null}</div>
          ))}
        </div>

        <div className="cx-followups">
          <h4>신고 후 바뀌었다면?</h4>
          {guide.followups.map((item) => (
            <div key={item.issue}><span>{item.issue}</span><strong>{item.action}</strong><p>{item.example}</p></div>
          ))}
        </div>

        <aside className="cx-digital-note"><span aria-hidden>⌁</span><div><strong>전자계약은 절차를 연결한다</strong><p>{guide.digital}</p></div></aside>

        <div className="cx-sources">
          <span className="cx-sources__title">원문 근거 · 직접 확인</span>
          {guide.sources.map((source) => (
            <a key={source.label} href={source.href} target="_blank" rel="noreferrer"><strong>{source.label}</strong><span>{source.note}</span><i aria-hidden>↗</i></a>
          ))}
        </div>
      </SectionBlock>
    </article>
  )
}

function LegalThresholdGuide({ guide }) {
  return (
    <article className="cx-card cx-visual-card cx-legal-guide">
      <SectionBlock label="한눈에 구조화" index={5}>
        <p className="cx-legal-guide__lede">{guide.summary}</p>

        <div className="cx-thresholds" aria-label="공유물 행위별 동의 기준">
          {guide.thresholds.map((item, index) => (
            <div key={item.action} className={`cx-threshold cx-threshold--${item.tone}`} style={{ '--cx-delay': `${index * 90}ms` }}>
              <span className="cx-threshold__mark">{item.mark}</span>
              <div><small>{item.action}</small><strong>{item.vote}</strong></div>
              <ul>{item.examples.map((example) => <li key={example}>{example}</li>)}</ul>
            </div>
          ))}
        </div>

        <div className="cx-legal-grid">
          <div className="cx-compare-box">
            <h4>공유와 합유, 여기서 갈린다</h4>
            <div className="cx-compare-table" role="table" aria-label="공유와 합유 비교">
              <div className="cx-compare-table__head" role="row"><span>구분</span><strong>공유</strong><strong>합유</strong></div>
              {guide.comparison.map((row) => (
                <div key={row.label} className="cx-compare-table__row" role="row">
                  <span>{row.label}</span><b>{row.shared}</b><b>{row.joint}</b>
                </div>
              ))}
            </div>
          </div>

          <figure className="cx-case-flow">
            <figcaption>과반수 임대 사례</figcaption>
            <div><span>{guide.scenario.given}</span><i aria-hidden>↓</i><span>{guide.scenario.action}</span><i aria-hidden>↓</i><strong>{guide.scenario.result}</strong></div>
          </figure>
        </div>

        <aside className="cx-precedent-note"><span aria-hidden>⚖</span><div><strong>판례 업데이트</strong><p>{guide.precedent}</p></div></aside>

        <div className="cx-sources">
          <span className="cx-sources__title">원문 근거 · 직접 확인</span>
          {guide.sources.map((source) => (
            <a key={source.label} href={source.href} target="_blank" rel="noreferrer">
              <strong>{source.label}</strong><span>{source.note}</span><i aria-hidden>↗</i>
            </a>
          ))}
        </div>
      </SectionBlock>
    </article>
  )
}

function ConceptStudyMap({ guide }) {
  const firstYear = guide.years[0]
  const lastYear = guide.years[guide.years.length - 1]
  return (
    <article className="cx-card cx-visual-card cx-study-map-card">
      <SectionBlock label="한눈에 학습맵" index={5}>
        {guide.breadcrumb.length > 0 ? (
          <div className="cx-map-path" aria-label="개념 위치">
            {guide.breadcrumb.map((item, index) => (
              <span key={`${item}-${index}`}>{item}{index < guide.breadcrumb.length - 1 ? <i aria-hidden>›</i> : null}</span>
            ))}
          </div>
        ) : null}

        <p className="cx-map-summary"><span aria-hidden>💡</span>{guide.summary}</p>

        {guide.rules.length > 0 ? (
          <div className={`cx-rule-grid${guide.rules.length === 1 ? ' cx-rule-grid--single' : ''}`}>
            {guide.rules.map((rule, index) => (
              <article key={`${rule.label}-${index}`} className="cx-rule" style={{ '--cx-delay': `${index * 70}ms` }}>
                <div className="cx-rule__top"><span>{String(rule.number).padStart(2, '0')}</span><strong>{rule.label}</strong></div>
                <p>{rule.body}</p>
              </article>
            ))}
          </div>
        ) : null}

        <div className="cx-map-bottom">
          {guide.example ? (
            <figure className="cx-example-flow">
              <figcaption>사례로 적용</figcaption>
              <div className="cx-example-flow__steps" aria-hidden>
                <span>상황</span><i>→</i><span>규칙 대입</span><i>→</i><span>결론</span>
              </div>
              <p>{guide.example}</p>
            </figure>
          ) : null}

          <aside className="cx-memory-card">
            <span className="cx-memory-card__pin" aria-hidden>!</span>
            <div><strong>시험 직전 한 문장</strong><p>{guide.memory}</p></div>
          </aside>
        </div>

        {guide.years.length > 0 ? (
          <div className="cx-history">
            <div className="cx-history__head">
              <span><strong>{guide.questionCount}</strong>회 연결 출제</span>
              <small>{firstYear === lastYear ? `${firstYear}년` : `${firstYear}–${lastYear}년`} 기출 기준</small>
            </div>
            <div className="cx-history__track" aria-label={`관련 기출 연도 ${guide.years.join(', ')}`}>
              <div className="cx-history__line" aria-hidden />
              {guide.years.map((year, index) => (
                <span key={year} className="cx-history__year" style={{ '--cx-delay': `${index * 55}ms` }}><i aria-hidden />{year}</span>
              ))}
            </div>
          </div>
        ) : null}
      </SectionBlock>
    </article>
  )
}

export { ConceptVisualGuide }
