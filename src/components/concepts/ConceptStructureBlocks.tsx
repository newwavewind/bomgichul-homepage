import type {
  ConceptCompareCard,
  ConceptDeepDiveItem,
  ConceptSpectrum,
  ConceptTypologyTable,
} from "@/lib/exam-track/types";

export interface StructuredConcept {
  compareCard?: ConceptCompareCard;
  deepDive?: ConceptDeepDiveItem[];
  processFlow?: string[];
  typologyTable?: ConceptTypologyTable;
  spectrum?: ConceptSpectrum;
}

export function hasConceptStructure(concept: StructuredConcept) {
  return Boolean(
    concept.compareCard || concept.deepDive?.length || concept.processFlow?.length ||
      concept.typologyTable?.rows?.length || concept.spectrum?.points?.length,
  );
}

function clean(text: unknown) {
  return String(text ?? "").replace(/\*\*/g, "");
}

export function ConceptStructureBlocks({ concept }: { concept: StructuredConcept }) {
  const table = concept.typologyTable;
  const points = concept.spectrum?.points?.map((point, index, all) =>
    typeof point === "string"
      ? { label: point, desc: "", position: all.length === 1 ? 50 : (index / (all.length - 1)) * 100 }
      : { ...point, position: point.position ?? (all.length === 1 ? 50 : (index / (all.length - 1)) * 100) },
  );
  return <div className="space-y-6">
    {concept.compareCard ? <div>
      {concept.compareCard.title ? <h3 className="mb-3 font-display text-body font-semibold text-ink">{concept.compareCard.title}</h3> : null}
      <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-stretch">
        {[concept.compareCard.left, concept.compareCard.right].map((side) => <div key={side.title} className="rounded-2xl border border-mist bg-paper p-4">
          <strong className="font-display text-body text-ink">{side.title}</strong>
          <p className="mt-2 whitespace-pre-line font-system text-body-sm leading-6 text-smoke">{clean(side.body)}</p>
        </div>).reduce<React.ReactNode[]>((all, panel, index) => index ? [...all, <span key={`vs-${index}`} className="hidden self-center font-display text-[11px] font-bold text-fog sm:block">VS</span>, panel] : [panel], [])}
      </div>
    </div> : null}
    {concept.processFlow?.length ? <div className="flex flex-wrap items-center gap-2">
      {concept.processFlow.map((step, index) => <span key={`${step}-${index}`} className="contents">
        <span className="rounded-xl border border-mist bg-surface px-3 py-2 font-display text-body-sm text-ink">{clean(step)}</span>
        {index < concept.processFlow!.length - 1 ? <span className="text-fog" aria-hidden>→</span> : null}
      </span>)}
    </div> : null}
    {table?.rows?.length ? <div className="overflow-x-auto rounded-2xl border border-mist">
      <table className="w-full min-w-[520px] border-collapse text-left font-display text-body-sm">
        {table.title ? <caption className="bg-surface px-4 py-3 text-left font-semibold text-ink">{table.title}</caption> : null}
        {(table.columns ?? table.headers)?.length ? <thead className="bg-paper text-fog"><tr>{(table.columns ?? table.headers)!.map((column) => <th key={column} className="border-b border-mist px-4 py-3">{column}</th>)}</tr></thead> : null}
        <tbody>{table.rows.map((row, index) => <tr key={`${row.label}-${index}`} className="border-b border-mist last:border-0">
          <th className="px-4 py-3 font-semibold text-ink">{row.label}</th>
          {row.cells.flat().map((cell, cellIndex) => <td key={cellIndex} className="px-4 py-3 leading-6 text-smoke">{clean(cell)}</td>)}
        </tr>)}</tbody>
      </table>
    </div> : null}
    {concept.spectrum && points?.length ? <div className="rounded-2xl border border-mist bg-paper p-5">
      {concept.spectrum.title ? <h3 className="font-display text-body font-semibold text-ink">{concept.spectrum.title}</h3> : null}
      <div className="relative mt-9 h-12 border-t-2 border-ios-blue/30">
        {points.map((point, index) => <div key={`${point.label}-${index}`} className="absolute top-[-5px] -translate-x-1/2" style={{ left: `${point.position}%` }}><span className="block h-2 w-2 rounded-full bg-ios-blue"/><span className="mt-2 block max-w-32 text-center font-display text-[11px] text-smoke">{point.label}</span></div>)}
      </div>
      <div className="flex justify-between font-display text-[11px] text-fog"><span>{concept.spectrum.leftLabel}</span><span>{concept.spectrum.rightLabel}</span></div>
    </div> : null}
    {concept.deepDive?.length ? <div className="space-y-2">
      <p className="font-display text-[12px] font-semibold text-fog">더 알아보기</p>
      {concept.deepDive.map((item, index) => <details key={`${item.title}-${index}`} className="rounded-2xl border border-mist bg-paper px-4 py-3">
        <summary className="cursor-pointer font-display text-body-sm font-semibold text-ink">{item.title}</summary>
        <p className="mt-3 whitespace-pre-line font-system text-body-sm leading-6 text-smoke">{clean(item.body)}</p>
      </details>)}
    </div> : null}
  </div>;
}
