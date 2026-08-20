import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** 구글·네이버 검색·브라우저 탭용 투명 배경 책·새싹 파비콘 */
export default async function Icon() {
  const iconData = await readFile(
    join(process.cwd(), "public/brand/bomgichul-search-icon.png"),
    "base64"
  );
  const iconSrc = `data:image/png;base64,${iconData}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          background: "transparent",
        }}
      >
        <img src={iconSrc} alt="" width={64} height={64} />
      </div>
    ),
    { ...size }
  );
}
