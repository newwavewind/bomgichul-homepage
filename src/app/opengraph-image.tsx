import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { SITE_NAME } from "@/lib/constants";

export const alt = "봄기출 | 기출 학습의 모든것";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** 카카오·슬랙·메신저 링크 미리보기용 흰수염고래 대표 화면 */
export default async function Image() {
  const backgroundData = await readFile(
    join(process.cwd(), "public/brand/whale-og-background.png"),
    "base64"
  );
  const backgroundSrc = `data:image/png;base64,${backgroundData}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: "#061427",
          color: "#ffffff",
        }}
      >
        <img
          src={backgroundSrc}
          alt=""
          width={1200}
          height={630}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage:
              "linear-gradient(90deg, rgba(1,8,20,1) 0%, rgba(1,8,20,0.98) 38%, rgba(1,8,20,0.76) 56%, rgba(1,8,20,0.05) 80%)",
          }}
        />

        <div
          style={{
            position: "relative",
            width: 670,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingLeft: 96,
            paddingBottom: 12,
          }}
        >

          <div
            style={{
              display: "flex",
              color: "#ffffff",
              fontSize: 98,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: "-0.055em",
            }}
          >
            {SITE_NAME}
          </div>

          <div
            style={{
              width: 510,
              height: 2,
              marginTop: 32,
              marginBottom: 31,
              background: "rgba(255,255,255,0.58)",
            }}
          />

          <div
            style={{
              display: "flex",
              color: "#ffffff",
              fontSize: 54,
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: "-0.04em",
            }}
          >
            기출 학습의 모든것
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 98,
            bottom: 40,
            display: "flex",
            color: "#ffffff",
            fontSize: 24,
            fontWeight: 800,
            letterSpacing: "0.025em",
          }}
        >
          www.bomgichul.com
        </div>
      </div>
    ),
    { ...size }
  );
}
