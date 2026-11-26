import Image from "next/image";
import type { OriginalExamImage } from "@/lib/exam-track/original-paper";

export function OriginalExamChoiceImage({ image, alt }: { image: OriginalExamImage; alt: string }) {
  return (
    <Image
      src={image.src}
      alt={alt}
      width={image.width}
      height={image.height}
      unoptimized
      className="block h-auto min-w-0 max-w-full mix-blend-multiply dark:invert dark:mix-blend-screen"
      style={{ width: "min(100%, " + image.width / 4.8 + "px)" }}
    />
  );
}

export function OriginalExamChoiceHeader({ image, compact = false }: { image: OriginalExamImage; compact?: boolean }) {
  return (
    <div className={compact ? "mt-4 pl-[49px] pr-[13px] sm:pl-[53px] sm:pr-[17px]" : "pl-[53px] pr-[17px]"}>
      <OriginalExamChoiceImage image={image} alt={image.alt?.replace(/\s+/g, " ") || "선택지 열 제목"} />
    </div>
  );
}
