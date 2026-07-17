import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** 구글·네이버 검색·브라우저 탭용 파비콘 */
export default function Icon() {
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
          borderRadius: 8,
          color: "#ffffff",
          fontSize: 18,
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
