import { splitLawCites } from "@/lib/law-link";
import { plainStudyText } from "@/lib/study-text";

/**
 * 해설 본문. 법령·판례 인용은 국가법령정보센터로 링크한다(앱 CitedText 와 동일).
 */
export function CitedText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const plain = plainStudyText(text);
  const parts = splitLawCites(plain);
  if (!parts.length) {
    return className ? <span className={className}>{plain}</span> : <>{plain}</>;
  }
  return (
    <span className={className}>
      {parts.map((part, i) =>
        part.href ? (
          <a
            key={i}
            href={part.href}
            target="_blank"
            rel="noopener noreferrer"
            className="law-cite"
          >
            {part.text}
          </a>
        ) : (
          <span key={i}>{part.text}</span>
        )
      )}
    </span>
  );
}
