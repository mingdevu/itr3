import { ImageResponse } from "next/og";

// 링크를 공유할 때 미리보기로 뜨는 OG 이미지(1200×630)를 빌드 때 생성한다.
// OG 렌더러 기본 폰트에는 한글 글리프가 없어서, 글자가 깨지지 않도록 영문만 쓴다.
// Edge runtime을 쓰는 이유: Next 14.2의 Node용 OG 생성기는 Windows에서 파일 경로 변환(fileURLToPath)에 실패해 빌드가 깨진다.
// Edge용 빌드는 그 경로를 타지 않아 Windows·Vercel 모두에서 동작한다.
export const runtime = "edge";
export const alt = "AI Engineer Portfolio — LLM Agents, MCP, STT/TTS, Evaluation";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "#ffffff",
          backgroundImage:
            "radial-gradient(circle at 12% 18%, rgba(249,168,212,0.75), transparent 42%), radial-gradient(circle at 88% 12%, rgba(96,165,250,0.6), transparent 40%), radial-gradient(circle at 60% 100%, rgba(167,139,250,0.6), transparent 45%)",
          color: "#15131a",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 4, color: "#e11d48", fontWeight: 700 }}>
          AI ENGINEER PORTFOLIO
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 800, lineHeight: 1.05 }}>From LLM agents to voice models,</div>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 800, lineHeight: 1.05, color: "#e11d48" }}>verified with numbers.</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#4b4353" }}>
          <span>LangChain · MCP · STT/TTS · Langfuse eval</span>
          <span>itr3.vercel.app</span>
        </div>
      </div>
    ),
    size
  );
}
