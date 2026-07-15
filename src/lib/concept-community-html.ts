/** 모두의 개념 HTML 본문 살균 (허용: b/strong/br/p/div/span/img) */

function normalizeHexColor(value: string): string | null {
  const raw = value.trim().toLowerCase();
  if (/^#[0-9a-f]{6}$/.test(raw)) return raw;
  if (/^#[0-9a-f]{3}$/.test(raw)) {
    const [, r, g, b] = raw;
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  const rgb = raw.match(
    /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/
  );
  if (rgb) {
    const channels = rgb.slice(1, 4).map((n) => Math.min(255, Number(n)));
    if (channels.some((n) => Number.isNaN(n))) return null;
    return `#${channels.map((n) => n.toString(16).padStart(2, "0")).join("")}`;
  }
  return null;
}

function isAllowedImageSrc(src: string): boolean {
  if (!src) return false;
  try {
    const url = new URL(src, "https://example.invalid");
    if (url.protocol !== "https:" && url.protocol !== "http:") return false;
    return (
      url.pathname.includes("/storage/v1/object/public/concept-community/") ||
      (url.hostname.includes("supabase") && url.pathname.includes("concept-community"))
    );
  } catch {
    return false;
  }
}

function sanitizeStyle(style: string): string {
  const parts: string[] = [];
  for (const decl of style.split(";")) {
    const [rawProp, ...rest] = decl.split(":");
    if (!rawProp || rest.length === 0) continue;
    const prop = rawProp.trim().toLowerCase();
    const value = rest.join(":").trim();
    if (!value) continue;

    if (prop === "font-weight") {
      if (value === "700" || value === "bold" || value === "600") {
        parts.push("font-weight:700");
      }
      continue;
    }

    if (prop === "font-size") {
      const match = value.match(/^(\d{1,2}(?:\.\d+)?)(px|rem)$/i);
      if (match) {
        const n = Number(match[1]);
        if (match[2].toLowerCase() === "px" && n >= 12 && n <= 28) {
          parts.push(`font-size:${n}px`);
        }
        if (match[2].toLowerCase() === "rem" && n >= 0.75 && n <= 1.75) {
          parts.push(`font-size:${n}rem`);
        }
      }
      continue;
    }

    if (prop === "color") {
      const color = normalizeHexColor(value);
      if (color) parts.push(`color:${color}`);
    }
  }
  return parts.join(";");
}

function sanitizeWithDom(input: string): string {
  const template = document.createElement("template");
  template.innerHTML = input;
  const allowed = new Set(["B", "STRONG", "BR", "P", "DIV", "SPAN", "IMG"]);

  const walk = (node: Node) => {
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === Node.TEXT_NODE) continue;
      if (child.nodeType !== Node.ELEMENT_NODE) {
        child.parentNode?.removeChild(child);
        continue;
      }

      const el = child as HTMLElement;
      if (!allowed.has(el.tagName)) {
        const parent = el.parentNode;
        while (el.firstChild) parent?.insertBefore(el.firstChild, el);
        parent?.removeChild(el);
        continue;
      }

      for (const attr of Array.from(el.attributes)) {
        const name = attr.name.toLowerCase();
        if (el.tagName === "IMG") {
          if (name === "src" && isAllowedImageSrc(attr.value)) continue;
          if (name === "alt") continue;
          el.removeAttribute(attr.name);
          continue;
        }
        if (name === "style") {
          const cleaned = sanitizeStyle(attr.value);
          if (cleaned) el.setAttribute("style", cleaned);
          else el.removeAttribute("style");
          continue;
        }
        el.removeAttribute(attr.name);
      }

      if (el.tagName === "IMG") {
        const src = el.getAttribute("src") ?? "";
        if (!isAllowedImageSrc(src)) {
          el.remove();
          continue;
        }
        el.setAttribute("loading", "lazy");
      }

      walk(el);
    }
  };

  walk(template.content);
  return template.innerHTML.trim();
}

/** DOM 없는 환경(SSR)용 보수적 strip — 표시는 client sanitize와 동일 결과를 목표 */
function sanitizeWithoutDom(input: string): string {
  return input
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<\/?(?!\/?(?:b|strong|br|p|div|span|img)\b)[^>]*>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/\sstyle\s*=\s*("([^"]*)"|'([^']*)')/gi, (_m, _q, d1, d2) => {
      const cleaned = sanitizeStyle(d1 ?? d2 ?? "");
      return cleaned ? ` style="${cleaned}"` : "";
    })
    .replace(/\ssrc\s*=\s*("([^"]*)"|'([^']*)')/gi, (m, _q, d1, d2) => {
      const src = d1 ?? d2 ?? "";
      return isAllowedImageSrc(src) ? m : "";
    })
    .trim();
}

export function sanitizeConceptCommunityHtml(input: string): string {
  if (!input) return "";
  if (typeof window === "undefined" || typeof document === "undefined") {
    return sanitizeWithoutDom(input);
  }
  return sanitizeWithDom(input);
}

export function communityHtmlToPlainText(html: string): string {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  }
  const div = document.createElement("div");
  div.innerHTML = html;
  return (div.textContent ?? "").replace(/\s+/g, " ").trim();
}

export const COMMUNITY_FONT_SIZES = [
  { label: "작게", value: "14px" },
  { label: "보통", value: "16px" },
  { label: "크게", value: "20px" },
] as const;
