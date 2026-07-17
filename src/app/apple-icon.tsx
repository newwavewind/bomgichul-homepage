import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** 홈화면·검색용 Apple 터치 아이콘 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#007aff",
          borderRadius: 40,
          color: "#ffffff",
          fontSize: 96,
          fontWeight: 800,
          letterSpacing: "-0.06em",
        }}
      >
        봄
      </div>
    ),
    { ...size }
  );
}
