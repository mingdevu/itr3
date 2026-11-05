// 포트폴리오에 들어가는 모든 문구·수치·링크를 이 파일 한 곳에 모은다.
// 사실을 고칠 때 컴포넌트를 열지 않고 여기만 고치면 되게 하기 위해서다.
// "TODO(확인 필요)"로 시작하는 문자열은 화면에서 점선 배지로 따로 표시된다.

export const TODO_PREFIX = "TODO(확인 필요)";
export const isTodo = (text: string) => text.startsWith(TODO_PREFIX);

export const profile = {
  name: "박민영",
  role: "AI 엔지니어 지원자",
  email: "pastar20250101@gmail.com",
  github: "https://github.com/mingdevu",
  tilNotion: "https://app.notion.com/p/oreumi/387ebaa8982b802f961ce7091a1fa125?source=copy_link",
};

export const hero = {
  eyebrow: "AI ENGINEER · 이스트캠프 AI휴먼 7기",
  // 어절(띄어쓰기 단위)로 나눠 순서대로 등장시킨다. 줄은 배열 단위로 바뀐다.
  headline: ["LLM 에이전트부터 음성 모델까지,", "숫자로 검증합니다."],
  intro:
    "도구 호출 에이전트와 MCP 서버를 만들고, TTS 모델을 파인튜닝하고, 평가셋을 설계해 개선 전후를 직접 잽니다. 기준에 못 미친 결과도 숨기지 않고 기록합니다.",
  stats: [
    {
      label: "MESTORY 판정 일치 (judge_match)",
      from: 0.86,
      to: 0.903,
      decimals: 3,
      prefix: "0.860 → ",
      suffix: "",
      note: "50문항 × 3회 평균",
    },
    {
      label: "K-Menu TTS LoRA 하이퍼파라미터 탐색",
      from: 0,
      to: 6,
      decimals: 0,
      prefix: "",
      suffix: "회",
      note: "학습률·rank·epoch 비교",
    },
    {
      label: "과정 프로젝트 대상",
      from: 0,
      to: 2,
      decimals: 0,
      prefix: "",
      suffix: "회",
      note: "이스트캠프 AI휴먼 7기",
    },
  ],
};

export type Metric = { value: string; label: string; note?: string };
export type Gate = { name: string; rule: string; measured: string; pass: "pass" | "fail" | "pending" };
export type ProjectLink = { label: string; href: string; note?: string };

export type Project = {
  id: string;
  name: string;
  tagline: string;
  meta: string;
  headlineMetric: Metric;
  stack: string[];
  image?: { src: string; alt: string; width: number; height: number; unoptimized?: boolean };
  imageTodo?: string;
  problem: string;
  approach: string[];
  architecture?: { from: string; to: string; label?: string }[];
  results: Metric[];
  gates?: { verdict: string; summary: string; items: Gate[] };
  honesty?: string[];
  role: string[];
  links: ProjectLink[];
};

export const projects: Project[] = [
  {
    id: "mestory",
    name: "MESTORY",
    tagline: "설비 다운타임 원인 분석 리포트 자동 생성",
    meta: "이스트캠프 2차 프로젝트 · 3인 팀 · 2026.09–10 (커밋 기준)",
    headlineMetric: { value: "0.860 → 0.903", label: "판정 일치 judge_match", note: "50문항 × 3회 평균" },
    stack: ["LangChain Agent", "FastMCP", "FastAPI", "Next.js", "Postgres", "Langfuse", "Whisper", "MMS-TTS", "Railway"],
    image: {
      src: "/images/mestory-ai-root-cause.png",
      alt: "MESTORY AI 원인 분석 화면. 자연어 질문에 원인 후보, 근거, 조치 방향을 답한다.",
      width: 1906,
      height: 944,
    },
    problem:
      "설비가 멈출 때마다 MES 담당자는 정지 로그를 수작업으로 뒤져 원인 설명 자료를 만들어야 했습니다. 정지 로그·에러코드 사전·정비이력을 근거로 원인·심각도·근거·권장 조치를 담은 리포트를 자동으로 만들고, 최종 판단은 사람이 내리도록 돕습니다.",
    approach: [
      "LangChain create_tool_calling_agent + AgentExecutor가 MCP 도구 5개를 필요한 만큼 호출해 사실을 모은 뒤 리포트를 생성",
      "FastMCP 서버: 벡터 검색 없이 정확한 키로만 조회, /mcp(Streamable HTTP)로 외부 MCP 클라이언트에도 공개하고 서비스 토큰으로 접근 제어",
      "Pydantic 스키마 검증 + 최대 3단계 재시도, 모두 실패하면 빈 리포트로 감추지 않고 HTTP 503",
      "질문 유형별 모델 라우팅(OpenRouter), Langfuse로 트레이스·비용·지연 관측과 프롬프트 버전 관리",
      "Whisper-small STT, MMS-TTS kor를 도메인 문장(설비ID·에러코드)에 맞게 파인튜닝해 Hugging Face에 공개",
    ],
    architecture: [
      { from: "Next.js 14", to: "FastAPI", label: "HTTPS + JWT" },
      { from: "FastAPI", to: "LangChain Agent", label: "리포트 생성" },
      { from: "LangChain Agent", to: "OpenRouter LLM", label: "도구 호출" },
      { from: "LangChain Agent", to: "MCP 도구 ×5", label: "정확한 키 조회" },
      { from: "MCP 도구 ×5", to: "Postgres", label: "정지 로그·에러코드·정비이력" },
      { from: "FastAPI", to: "Langfuse", label: "트레이스" },
    ],
    results: [
      { value: "0.860 → 0.903", label: "판정 일치 judge_match", note: "50문항 × 3회 평균 · 3회 중 2회는 0.9 미만" },
      { value: "0.927 → 0.987", label: "정직성 judge_honesty", note: "치명 문항 회당 3.7건 → 1.0건" },
      { value: "1.000", label: "출력 계약 준수율", note: "텍스트 50문항 × 6회 · 멀티모달 50건 × 2회" },
      { value: "14.3% → 98.6%", label: "STT 설비 코드 정확도", note: "사람 녹음 42문장 · CER 34.2% → 2.1%" },
      { value: "18.5% → 16.3%", label: "TTS 재인식 CER", note: "평가 15문장 × 3회" },
    ],
    gates: {
      verdict: "HOLD",
      summary: "출시 게이트를 하나라도 넘지 못하면 배포 판정을 보류합니다. 결과는 그대로 기록했습니다.",
      items: [
        { name: "계약 준수율", rule: "≥ 0.95", measured: "1.000", pass: "pass" },
        { name: "텍스트 최악 1건 지연", rule: "≤ 24s", measured: "34.0s", pass: "fail" },
        { name: "이미지 포함 p95 지연", rule: "≤ 28s", measured: "40.0~41.9s", pass: "fail" },
        { name: "요청당 비용", rule: "기준 미정", measured: "텍스트 평균 $0.00354", pass: "pending" },
      ],
    },
    honesty: [
      "판정 일치는 개선 전후 범위가 겹쳐(전 최고 0.89, 후 최저 0.88) '좋아진 경향'까지만 주장",
      "TTS는 교체 전 모델(CER 3.4%)보다 나빠진 것을 알고 적용했고, 기준 미달을 Spec에 그대로 남김",
      "프롬프트 인젝션 방어 시도가 실패한 기록도 평가 리포트에 남김",
    ],
    role: [
      "MCP · 데이터 리드 (README 팀 표)",
      "평가셋(evals/)과 평가 리포트(EVAL_REPORT.md) 작성 주도: 커밋 기준 각각 140/169, 111/133",
      "MCP 서버(mcp_server/) 커밋 24/34 · 음성 서비스(voice/) 커밋 17/22",
      "TODO(확인 필요) STT·TTS 파인튜닝 중 본인이 맡은 범위",
    ],
    links: [
      { label: "서비스", href: "https://mestory-app.up.railway.app" },
      { label: "GitHub", href: "https://github.com/mingdevu/mestory" },
      { label: "평가 리포트", href: "https://github.com/mingdevu/mestory/blob/main/EVAL_REPORT.md" },
      { label: "HF · STT 모델", href: "https://huggingface.co/minggyeong/whisper-small-ko-mestory-ct2" },
      { label: "HF · TTS 모델", href: "https://huggingface.co/minggyeong/mms-tts-kor-mestory-onnx" },
    ],
  },
  {
    id: "kmenu",
    name: "K-Menu Voice Guide",
    tagline: "메뉴판 사진 한 장 → 영어 설명과 음성 안내",
    meta: "이스트캠프 1차 프로젝트 · 4인 팀 · 개발 14일",
    headlineMetric: { value: "0% → 91.67%", label: "OCR 음식명 매칭 재현율", note: "실제 메뉴판 사진, 매칭 대상 36장" },
    stack: ["Qwen3-TTS", "LoRA (PEFT)", "PaddleOCR", "OpenCV", "RapidFuzz", "FastAPI", "React", "Flutter", "HF Spaces"],
    image: {
      src: "/images/kmenu-demo-detail.gif",
      alt: "K-Menu 음식 상세 화면 데모. 설명, 먹는 법, 재료, 알레르기, 발음, 맵기가 한 화면에 나오고 음성으로 읽어 준다.",
      width: 640,
      height: 315,
      unoptimized: true,
    },
    problem:
      "번역 앱은 '곱창전골 → Beef intestine hot pot'처럼 글자만 옮겨서, 영어권 관광객은 그 음식이 어떤 맛인지, 얼마나 매운지, 어떻게 먹는지 알 수 없습니다. 메뉴판 사진 한 장으로 음식을 찾아 영어 텍스트와 음성으로 설명합니다.",
    approach: [
      "OpenCV 전처리 → 파인튜닝 PaddleOCR → RapidFuzz 유사도 매칭으로 등록 음식 50개와 대조",
      "설명은 팀이 미리 작성해 DB에 넣은 문장만 조회. 알레르기 정보에 환각이 생기면 안전 문제라 런타임 LLM을 쓰지 않음",
      "Qwen3-TTS-1.7B + LoRA 파인튜닝. 맵기 4 이상이면 주의 톤(CAUTION)으로 자동 전환",
      "실시간 생성(33초)이 목표 응답 시간을 넘어 사전 생성 캐시로 전환",
      "FastAPI를 T4 GPU Space 한 곳에 두고 React 웹·Flutter 앱이 같은 API를 사용",
    ],
    results: [
      { value: "0% → 91.67%", label: "OCR 매칭 재현율", note: "기본 인식기는 한글을 한자·영문으로 읽음" },
      { value: "6회", label: "TTS LoRA 하이퍼파라미터 탐색", note: "공식 기본 학습률(2e-5)이 가장 나빴음 · Val Loss 10.273 vs 8.913" },
      { value: "104.3% · 106.9%", label: "상용 TTS(Perso.ai) 대비 UTMOS", note: "스타일당 1문장(n=1)이라 우위를 단정하지 않음" },
      { value: "33s → 1.8ms", label: "음성 응답", note: "실시간 생성 → 사전 생성 캐시" },
    ],
    honesty: [
      "OCR 파인튜닝 뒤 가격 숫자 인식이 77.78% → 5.56%로 무너진 것을 측정하고, 한글이 없는 조각은 기본 인식기를 쓰는 하이브리드로 복구",
    ],
    role: ["TTS 파인튜닝 · 하이퍼파라미터 실험 · UX/UI (README 팀 표)"],
    links: [
      { label: "웹", href: "https://hju5022-k-menu-react.static.hf.space", note: "API용 GPU Space가 일시정지 상태면 분석·음성이 동작하지 않을 수 있습니다" },
      { label: "GitHub", href: "https://github.com/mingdevu/proj1-c" },
      { label: "HF · TTS LoRA", href: "https://huggingface.co/k-bite-team/k-menu-qwen3-tts-lora" },
    ],
  },
  {
    id: "gapjinnal",
    name: "값진날",
    tagline: "친구 5명이 추억에 '마음값'을 매기는 사진 아카이브",
    meta: "개인 프로젝트 · 1인 · 2026.07",
    headlineMetric: { value: "1인", label: "기획부터 배포까지", note: "AI 도구와 스타터 템플릿을 활용해 빠르게 완성" },
    stack: ["Next.js 16", "React 19", "Neon Postgres", "Vercel Blob", "Vercel"],
    imageTodo: "TODO(확인 필요) 값진날 화면 캡처 이미지",
    problem:
      "친구 다섯 명이 함께한 추억 사진을 한곳에 모으고, 각자 그 순간에 '마음값'을 매겨 보는 우리끼리의 공간이 필요했습니다.",
    approach: [
      "Next.js 16 App Router의 Route Handler 4개(memories · profiles · ratings · restaurants)로 API 구성",
      "Neon Postgres에 SQL을 직접 작성. 복합 기본키로 한 사람이 추억 하나에 한 번만 평가·투표하도록 보장",
      "Vercel Blob에 사진 업로드, 서버에서 이미지 형식과 용량(최대 10MB)을 검증",
      "AI 도구와 스타터 템플릿을 활용해 기획부터 배포까지 혼자 빠르게 진행",
    ],
    results: [
      { value: "6가지", label: "기능", note: "추억 업로드 · 마음값 평가 · 댓글 · 프로필 사진 · 맛집 추천 · 맛집 투표" },
      { value: "Vercel", label: "배포", note: "new-chat-rho-jade.vercel.app" },
    ],
    role: ["기획 · 구현 · 배포 1인 진행"],
    links: [
      { label: "서비스", href: "https://new-chat-rho-jade.vercel.app" },
      { label: "GitHub", href: "https://github.com/mingdevu/gapjinnal" },
    ],
  },
];

// 이스트캠프 섹션. 단계별로 무엇을 배웠고 어느 프로젝트에서 썼는지 근거를 붙인다.
export const camp = {
  title: "이스트캠프 AI휴먼 7기",
  period: "TODO(확인 필요) 과정 기간",
  timeline: [
    {
      when: "TODO(확인 필요) 시기",
      title: "프롬프트 엔지니어링",
      detail: "MESTORY에서 판단 기준(SKILL.md)을 프롬프트로 운영하고 개선 전후를 평가",
      evidence: "MESTORY",
    },
    {
      when: "2026.08",
      title: "멀티모달 · OCR · TTS",
      detail: "이미지 → 텍스트 → 음성으로 이어지는 파이프라인, Qwen3-TTS LoRA 파인튜닝",
      evidence: "K-Menu Voice Guide",
    },
    {
      when: "TODO(확인 필요) 시기",
      title: "RAG",
      detail: "TODO(확인 필요) RAG를 실습한 프로젝트나 과제",
      evidence: "",
    },
    {
      when: "2026.09–10",
      title: "LLM 에이전트 · MCP",
      detail: "LangChain 도구 호출 에이전트와 FastMCP 서버로 구조화된 데이터를 정확한 키로 조회",
      evidence: "MESTORY",
    },
    {
      when: "2026.09–10",
      title: "STT · TTS 파인튜닝",
      detail: "Whisper-small, MMS-TTS kor를 도메인 문장에 맞게 파인튜닝해 배포",
      evidence: "MESTORY",
    },
    {
      when: "2026.09–10",
      title: "평가 · 관측 (Langfuse)",
      detail: "평가셋 설계, LLM judge 지표, 출시 게이트, 트레이스·비용·지연 관측",
      evidence: "MESTORY",
    },
  ],
  awards: [
    { title: "음성 멀티모달 만들기", prize: "대상", project: "TODO(확인 필요) 수상 프로젝트" },
    { title: "거대 언어 모델을 활용한 PERSO AI 답변 기능 구현하기", prize: "대상", project: "TODO(확인 필요) 수상 프로젝트" },
  ],
};

export const til = {
  message: "과정 내내 매일 TIL을 썼습니다.",
  sub: "배운 것을 그날 정리하는 습관이 프로젝트의 평가 리포트와 문서로 이어졌습니다.",
  // 숫자는 본인에게 확인받기 전까지 비워 둔다. 절대 임의로 채우지 않는다.
  stats: [
    { label: "TIL 총 개수", value: "TODO(확인 필요)" },
    { label: "작성 기간", value: "TODO(확인 필요)" },
    { label: "최장 연속 작성", value: "TODO(확인 필요)" },
  ],
  // 히트맵에 표시할 작성 날짜("YYYY-MM-DD"). 채우면 히트맵이 자동으로 그려진다.
  dates: [] as string[],
};

export const skills = [
  "Python", "C", "SQL", "LangChain", "FastMCP", "FastAPI", "OpenRouter", "Langfuse",
  "Whisper", "MMS-TTS", "Qwen3-TTS", "LoRA · PEFT", "PaddleOCR", "OpenCV",
  "Postgres", "Next.js", "React", "TypeScript", "Docker", "Railway", "Hugging Face", "Vercel",
];

export const about = {
  intro:
    "부산대학교에서 IT응용공학을 전공했고, 이스트캠프 AI휴먼 7기에서 LLM 에이전트·MCP·음성 모델·평가를 실제 배포되는 서비스로 만들었습니다. 만든 것을 숫자로 재고, 그 숫자를 정직하게 보고하는 엔지니어가 되고자 합니다.",
  facts: [
    { label: "학력", items: ["부산대학교 IT응용공학과 졸업"] },
    { label: "자격", items: ["정보처리기사", "SQLD", "ADsP"] },
    { label: "어학", items: ["G-TELP 92", "TOEIC 840", "영어 회화 가능"] },
    { label: "언어", items: ["Python", "C", "SQL"] },
  ],
};

export const navItems = [
  { id: "projects", label: "프로젝트" },
  { id: "camp", label: "이스트캠프" },
  { id: "about", label: "소개" },
  { id: "contact", label: "연락" },
];
