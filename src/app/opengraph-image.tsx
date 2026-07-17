import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/constants";

export const alt = "봄기출 | 기출 학습의 모든것";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** 카카오·슬랙·메신저 링크 미리보기용 대표 화면 */
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(145deg, #f5f8ff 0%, #eef4ff 42%, #e8f1ff 100%)",
          color: "#0f172a",
        }}
      >
        {/* soft atmosphere */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -80,
            width: 520,
            height: 520,
            borderRadius: "50%",
            background: "rgba(0, 122, 255, 0.12)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -160,
            left: -100,
            width: 460,
            height: 460,
            borderRadius: "50%",
            background: "rgba(0, 122, 255, 0.08)",
          }}
        />

        {/* top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: 10,
            background: "#007aff",
          }}
        />

        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingLeft: 88,
            paddingRight: 88,
            paddingBottom: 8,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 36,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 52,
                height: 52,
                borderRadius: 16,
                background: "#007aff",
                color: "#ffffff",
                fontSize: 26,
                fontWeight: 800,
                letterSpacing: "-0.04em",
              }}
            >
              봄
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: 22,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  color: "#007aff",
                }}
              >
                BOMGICHUL
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 18,
                  fontWeight: 600,
                  color: "#64748b",
                  letterSpacing: "-0.02em",
                }}
              >
                수험생 커뮤니티
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 92,
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: "-0.06em",
              color: "#0f172a",
            }}
          >
            {SITE_NAME}
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 52,
              fontWeight: 750,
              lineHeight: 1.15,
              letterSpacing: "-0.045em",
              color: "#007aff",
            }}
          >
            기출 학습의 모든것
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              marginTop: 40,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 18px",
                borderRadius: 999,
                background: "rgba(0, 122, 255, 0.1)",
                border: "1px solid rgba(0, 122, 255, 0.28)",
                color: "#007aff",
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: "-0.02em",
              }}
            >
              기출 all-in-one
            </div>
            <div
              style={{
                display: "flex",
                color: "#64748b",
                fontSize: 22,
                fontWeight: 550,
                letterSpacing: "-0.025em",
              }}
            >
              기출 · 개념 · AI · 커뮤니티
            </div>
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 48,
              color: "#94a3b8",
              fontSize: 20,
              fontWeight: 600,
              letterSpacing: "0.02em",
            }}
          >
            www.bomgichul.com
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
