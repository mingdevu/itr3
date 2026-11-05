import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import localFont from "next/font/local";
import MotionProvider from "../components/motion/MotionProvider";
import "./globals.css";

// 한글: Pretendard(가변 폰트, public/fonts에 직접 둔 파일).
// 파일이 2MB로 커서 preload하지 않고, 로딩 전에는 시스템 폰트로 먼저 보여 준다(display: swap).
const pretendard = localFont({
  src: "../public/fonts/PretendardVariable.woff2",
  weight: "45 920",
  display: "swap",
  preload: false,
  variable: "--font-pretendard",
});

// 숫자·영문 강조용 산세리프와 라벨용 모노 폰트. next/font/google은 빌드 때 받아서 같은 도메인으로 서빙한다.
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-display" });
const jetBrainsMono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-mono" });

const description =
  "LLM 에이전트·MCP 서버·STT/TTS 파인튜닝·평가 설계를 실제 배포 서비스로 만든 AI 엔지니어 지원자 박민영의 포트폴리오";

export const metadata: Metadata = {
  metadataBase: new URL("https://itr3.vercel.app"),
  title: "박민영 | AI 엔지니어 포트폴리오",
  description,
  openGraph: {
    type: "website",
    url: "/",
    siteName: "박민영 포트폴리오",
    title: "박민영 | AI 엔지니어 포트폴리오",
    description,
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "박민영 | AI 엔지니어 포트폴리오",
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${pretendard.variable} ${spaceGrotesk.variable} ${jetBrainsMono.variable}`}>
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
