const PROVIDER_LABELS = {
  chatgpt: "GPT",
  gemini: "Gemini",
  claude: "Claude",
} as const;

export type AiProviderId = keyof typeof PROVIDER_LABELS;

/** GPT·Gemini·Claude 대표색 점 3개 — 삼각형 배치 */
export function AiProviderTriangleDots({
  dotSize = 5,
  className = "",
}: {
  dotSize?: number;
  className?: string;
}) {
  const width = dotSize * 2 + 4;
  const height = dotSize * 2 + 2;

  return (
    <span
      aria-hidden
      className={`inline-grid shrink-0 grid-cols-2 ${className}`}
      style={{ width, height, columnGap: 2, rowGap: 2 }}
    >
      <span
        className="col-span-2 justify-self-center ai-provider-dot ai-provider-dot--chatgpt"
        style={{ width: dotSize, height: dotSize }}
      />
      <span
        className="justify-self-start ai-provider-dot ai-provider-dot--gemini"
        style={{ width: dotSize, height: dotSize }}
      />
      <span
        className="justify-self-end ai-provider-dot ai-provider-dot--claude"
        style={{ width: dotSize, height: dotSize }}
      />
    </span>
  );
}

export function AiProviderTag({
  provider,
  className = "",
}: {
  provider: AiProviderId;
  className?: string;
}) {
  const label = PROVIDER_LABELS[provider] ?? provider;

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span
        aria-hidden
        className={`ai-provider-dot ai-provider-dot--${provider}`}
        style={{ width: 10, height: 10 }}
      />
      <span className="text-inherit">{label}</span>
    </span>
  );
}
