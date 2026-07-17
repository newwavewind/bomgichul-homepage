import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** 홈 화면용 흰수염고래 Apple 터치 아이콘 */
export default async function AppleIcon() {
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
          borderRadius: 40,
          background: "#061427",
        }}
      >
        <img src={whaleSrc} alt="" width={180} height={180} />
      </div>
    ),
    { ...size }
  );
}
