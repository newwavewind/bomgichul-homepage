import { useEffect, useRef } from "react";

export function HistoryNotebookPreview() {
  const frame = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = frame.current;
    if (!iframe) return;
    let cleanup = () => {};

    function fitPreview() {
      cleanup();
      const doc = iframe?.contentDocument;
      const notebook = doc?.getElementById("root");
      if (!iframe || !doc || !notebook) return;

      const site = document.documentElement;
      const syncTheme = () => doc.documentElement.classList.toggle("dark", site.dataset.theme === "dark");
      const themeObserver = new MutationObserver(syncTheme);
      syncTheme();
      themeObserver.observe(site, { attributes: true, attributeFilter: ["data-theme"] });

      const fitHeight = () => {
        iframe.style.height = `${Math.ceil(notebook.getBoundingClientRect().height)}px`;
      };
      const resizeObserver = new ResizeObserver(fitHeight);
      resizeObserver.observe(notebook);
      fitHeight();

      const closeOnEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape") iframe.closest("dialog")?.close();
      };
      doc.addEventListener("keydown", closeOnEscape);

      cleanup = () => {
        resizeObserver.disconnect();
        themeObserver.disconnect();
        doc.removeEventListener("keydown", closeOnEscape);
      };
    }

    iframe.addEventListener("load", fitPreview);
    fitPreview();
    return () => {
      iframe.removeEventListener("load", fitPreview);
      cleanup();
    };
  }, []);

  return (
    <figure className="mt-5">
      <figcaption className="mb-3 font-display text-body-sm font-medium text-smoke">예시</figcaption>
      <iframe
        ref={frame}
        src="/app-previews/history-notebook/index.html"
        title="한능검 앱 필기노트 예시"
        className="block h-0 w-full border-0"
      />
    </figure>
  );
}
