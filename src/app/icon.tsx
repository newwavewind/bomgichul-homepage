import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** 구글·네이버 검색·브라우저 탭용 흰수염고래 파비콘 */
export default async function Icon() {
  const whaleData = await readFile(
    join(process.cwd(), "public/brand/whale-favicon-master.png"),
    "base64"
  );
  const whaleSrc = `data:image/png;base64,${whaleData}`;

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
          borderRadius: 14,
          background: "#061427",
        }}
      >
        <img src={whaleSrc} alt="" width={64} height={64} />
      </div>
    ),
    { ...size }
  );
}
