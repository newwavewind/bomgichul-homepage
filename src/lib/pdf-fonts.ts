import path from "node:path";
import { Font } from "@react-pdf/renderer";

export const PDF_FONT_FAMILY = "NotoSansKR";

let fontsRegistered = false;

/** PDF 요청이 외부 네트워크 상태에 좌우되지 않도록 배포 자산의 글꼴을 사용한다. */
export function ensurePdfFontsRegistered() {
  if (fontsRegistered) return;

  Font.register({
    family: PDF_FONT_FAMILY,
    fonts: [
      {
        src: path.join(process.cwd(), "public/fonts/NotoSansKR-Regular.ttf"),
        fontWeight: "normal",
      },
      {
        src: path.join(process.cwd(), "public/fonts/NotoSansKR-Bold.ttf"),
        fontWeight: "bold",
      },
    ],
  });
  fontsRegistered = true;
}
