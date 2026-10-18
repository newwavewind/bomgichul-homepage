type DailyExplanationChoice = {
  key: string;
  label: string;
};

export type DailyExplanationParts = {
  common: string;
  byChoice: Record<string, string>;
};

/**
 * Daily explanations are assembled as a common summary followed by paragraphs
 * prefixed with the visible choice label (for example, `① ...`). Keep the
 * summary separate and attach each labelled section to its choice card.
 */
export function splitDailyExplanation(
  explanation: string,
  choices: DailyExplanationChoice[],
): DailyExplanationParts {
  const text = explanation.replace(/\r\n?/g, "\n").trim();
  if (!text) return { common: "", byChoice: {} };

  const paragraphs = text
    .split(/\n\s*\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const labelledParagraphs = paragraphs.flatMap((paragraph, index) => {
    const choice = choices.find(({ label }) =>
      paragraph.startsWith(`${label.trim()} `),
    );
    return choice ? [{ index, choice }] : [];
  });

  // One isolated marker can be ordinary prose. Only switch to the per-choice
  // layout when the explanation clearly contains multiple labelled sections.
  if (labelledParagraphs.length < 2) {
    return { common: text, byChoice: {} };
  }

  const firstChoiceIndex = labelledParagraphs[0]!.index;
  const common = paragraphs.slice(0, firstChoiceIndex).join("\n\n");
  const byChoice: Record<string, string> = {};
  let currentChoice: DailyExplanationChoice | null = null;

  for (let index = firstChoiceIndex; index < paragraphs.length; index += 1) {
    const paragraph = paragraphs[index]!;
    const labelled = labelledParagraphs.find((entry) => entry.index === index);
    if (labelled) {
      currentChoice = labelled.choice;
      const body = paragraph.slice(currentChoice.label.trim().length).trim();
      if (body) byChoice[currentChoice.key] = body;
      continue;
    }

    if (!currentChoice) continue;
    byChoice[currentChoice.key] = [byChoice[currentChoice.key], paragraph]
      .filter(Boolean)
      .join("\n\n");
  }

  return { common, byChoice };
}
