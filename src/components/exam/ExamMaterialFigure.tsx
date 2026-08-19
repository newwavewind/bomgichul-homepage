import Image from "next/image";
import type { ExamTrackMaterial } from "@/lib/exam-track/types";

/**
 * 문항에 딸린 자료 그림 — 사료·지도·안내문·도표.
 *
 * 한국사는 「밑줄 그은 (가) 시대」처럼 자료를 봐야만 풀리는 문항이 대부분이고,
 * 영어 생활영어에도 안내문 그림이 붙는다. 그림이 빠지면 문항이 성립하지
 * 않는다.
 *
 * 예전에는 한국사 전용 화면 안에만 있었다. 그 화면을 걷어내면서 그림도 함께
 * 사라지는 일이 있었으므로, 이제는 문항 화면이 공통으로 그린다.
 */
export function ExamMaterialFigure({
  material,
  questionNo,
}: {
  material?: ExamTrackMaterial;
  questionNo: number;
}) {
  if (!material?.image) return null;
  return (
    <figure className="mb-6 overflow-hidden rounded-[var(--radius-cards)] border border-mist bg-snow">
      <Image
        src={material.image}
        alt={`${questionNo}번 문항 자료`}
        width={material.width ?? 1200}
        height={material.height ?? 900}
        className="h-auto w-full"
        sizes="(max-width: 900px) 100vw, 860px"
        // 첫 두 문항은 화면에 바로 보이므로 먼저 받아 둔다
        priority={questionNo <= 2}
      />
    </figure>
  );
}
