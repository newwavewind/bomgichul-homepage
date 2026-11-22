export function questionShortcutTarget(event: KeyboardEvent): HTMLElement | null {
  const { key, target } = event;
  if (
    !/^[1-9]$/.test(key) && key !== "Enter" && key !== "ArrowLeft" && key !== "ArrowRight"
  ) return null;
  if (
    event.defaultPrevented || event.isComposing || event.repeat ||
    event.altKey || event.ctrlKey || event.metaKey || event.shiftKey ||
    !(target instanceof HTMLElement)
  ) return null;

  if (
    target.isContentEditable ||
    target.closest('input, textarea, select, [role="textbox"], [role="combobox"], [role="listbox"], [role="slider"]') ||
    document.querySelector('dialog[open], [aria-modal="true"]')
  ) return null;
  return target;
}

export function hasNativeEnterAction(target: HTMLElement) {
  return Boolean(target.closest('a[href], button, summary, [role="button"], [role="link"]'));
}
