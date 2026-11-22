export const APPEARANCE_STORAGE_KEY = "bomgichul:appearance";
export const FONT_SIZES = [85, 100, 115, 130, 145] as const;
export const DEFAULT_FONT_SIZE = 100;

export type FontSize = (typeof FONT_SIZES)[number];
export type Theme = "light" | "dark";

export const appearanceInitScript = `
try {
  const saved = JSON.parse(localStorage.getItem(${JSON.stringify(APPEARANCE_STORAGE_KEY)}) || "{}");
  const root = document.documentElement;
  if (saved.theme === "dark") {
    root.dataset.theme = "dark";
    root.classList.add("dark");
  }
  if (${JSON.stringify(FONT_SIZES)}.includes(saved.fontSize)) {
    root.dataset.fontSize = String(saved.fontSize);
  }
} catch {}
`;
