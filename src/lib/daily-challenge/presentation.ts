type PresentationItem = {
  text?: string;
  image?: string;
};

function normalizedText(value: unknown) {
  return typeof value === "string"
    ? value.replace(/\s+/g, " ").trim()
    : "";
}

/**
 * Some public-service datasets keep the real ㄱ~ㄹ prompt in `stem` and copy
 * the numbered answer choices into both `items` and `comboChoices`. Those
 * `items` are answers, not another prompt box, so rendering them as <보기>
 * duplicates the choices above the interactive answer buttons.
 */
export function itemsRepeatComboChoices(
  items: PresentationItem[] | undefined,
  comboChoices: unknown,
) {
  if (!Array.isArray(items) || !Array.isArray(comboChoices)) return false;
  if (items.some((item) => item.image)) return false;

  const itemTexts = items
    .map((item) => normalizedText(item.text))
    .filter(Boolean);
  const comboTexts = comboChoices
    .map((choice) =>
      normalizedText(
        typeof choice === "string"
          ? choice
          : choice && typeof choice === "object"
            ? (choice as Record<string, unknown>).text
            : "",
      ),
    )
    .filter(Boolean);

  return (
    itemTexts.length >= 2 &&
    itemTexts.length === comboTexts.length &&
    itemTexts.every((text, index) => text === comboTexts[index])
  );
}
