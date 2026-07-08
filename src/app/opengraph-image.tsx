import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

export const alt = "봄기출 | 공인중개사 기출문제 해설";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logoData = await readFile(join(process.cwd(), "public/brand/logo.png"), "base64");
  const logoSrc = `data:image/jpeg;base64,${logoData}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          background: "#f8fafc",
        }}
      >
        <img src={logoSrc} alt="" width={140} height={140} style={{ borderRadius: 32 }} />
        <div style={{ fontSize: 72, fontWeight: 600, color: "#0f172a" }}>{SITE_NAME}</div>
        <div style={{ fontSize: 34, color: "#0f766e" }}>{SITE_TAGLINE}</div>
      </div>
    ),
    { ...size }
  );
}
