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
    "측정 없이 결정하지 않습니다. 후보 모델은 서비스와 같은 조건으로 시험하고, 프롬프트는 한 번에 하나씩 바꿔 다시 재고, 기준에 못 미친 결과도 숨기지 않고 기록합니다.",
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
    meta: "이스트캠프 2차 프로젝트 · 3인 팀 · 대상 수상 · 2026.09–10",
    headlineMetric: { value: "0.927 → 0.987", label: "모르는 것을 모른다고 답하는 정직성", note: "같은 50문항 × 3회 평균" },
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
      "모델 선정: 보안 정책상 데이터 미저장(ZDR)을 켜야 해 쓸 수 있는 모델이 줄자, 후보 9개를 서비스와 같은 조건으로 시험해 통과한 3개 중 하나를 선택",
      "프롬프트 개선: 규칙을 한 번에 하나만 바꾸고 같은 50문항을 3회씩 측정, 오히려 나빠진 변경 2건은 되돌림",
      "모델 라우팅: 출력 형식을 자주 어겨 꺼 두었던 경량 모델을 형식 강제 설정 후 질문 유형별로 다시 측정, 품질 차이가 없던 원인·심각도 질문에만 배정",
      "STT 파인튜닝: 설비 번호·에러코드가 담긴 문장으로 학습 데이터를 만들어 Whisper-small을 학습하고, 사람이 녹음한 42문장으로 평가",
      "서비스 구조: LangChain 도구 호출 에이전트가 FastMCP 서버의 조회 도구 5개로 정지 로그·에러코드·정비이력을 모으고, Pydantic 검증 실패 시 빈 리포트 대신 503",
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
      { value: "−79% · 20.5s → 14.3s", label: "원인·심각도 질문 비용 · 응답 시간", note: "경량 모델 라우팅, 품질은 기존 모델과 차이 없음" },
      { value: "14.3% → 98.6%", label: "STT 설비 코드 정확도", note: "사람 녹음 42문장 · CER 34.2% → 2.1%" },
      { value: "1.000", label: "출력 계약 준수율", note: "텍스트 50문항 × 6회 · 멀티모달 50건 × 2회" },
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
      "응답 속도가 기준에 못 미쳐 출시 판정을 '보류(HOLD)'로 그대로 기록",
      "판정 일치는 개선 전후 범위가 겹쳐(전 최고 0.89, 후 최저 0.88) '좋아진 경향'까지만 주장",
      "실패한 경량 모델도 원인(능력 vs 출력 형식)을 나눠 다시 시험해 재사용",
    ],
    role: ["모델 선정 · 평가", "질문 유형별 모델 라우팅", "STT 파인튜닝"],
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
    meta: "이스트캠프 1차 프로젝트 · 4인 팀 · 대상 수상 · 개발 14일",
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
  intro: "머신러닝·딥러닝부터 멀티모달, STT·TTS, 프롬프트 엔지니어링, RAG까지. 배운 기술마다 실제로 쓴 프로젝트를 근거로 붙였습니다.",
  timeline: [
    {
      when: "2026.06–07",
      title: "Python · 머신러닝 · 딥러닝",
      detail: "기초부터 다시 다지며 논문 13편을 요약하고, 각 기법이 어떤 한계를 해결하려고 나왔는지 정리",
      evidence: "노션 TIL · 논문 요약",
    },
    {
      when: "2026.08",
      title: "멀티모달 · TTS",
      detail: "메뉴판 사진 → 텍스트 → 영어 음성으로 이어지는 서비스, Qwen3-TTS LoRA 파인튜닝과 하이퍼파라미터 실험",
      evidence: "K-Menu Voice Guide · 대상",
    },
    {
      when: "2026.09–10",
      title: "프롬프트 엔지니어링 · 평가",
      detail: "규칙을 한 번에 하나만 바꾸고 같은 50문항을 3회씩 측정, Langfuse로 트레이스·비용·지연 관측",
      evidence: "MESTORY · 대상",
    },
    {
      when: "2026.09–10",
      title: "LLM 에이전트 · MCP · 모델 라우팅",
      detail: "도구 호출 에이전트와 MCP 서버로 데이터를 조회하고, 질문 유형별로 모델을 나눠 비용 −79%",
      evidence: "MESTORY",
    },
    {
      when: "2026.09–10",
      title: "STT 파인튜닝",
      detail: "설비 용어 문장으로 학습 데이터를 만들어 Whisper-small 학습, 설비 코드 정확도 14% → 98.6%",
      evidence: "MESTORY",
    },
    {
      when: "진행 중",
      title: "RAG · 하이브리드 검색",
      detail: "단어 빈도, BM25, 글자 단위 BM25, 임베딩 검색을 단계별로 비교하며 하이브리드 검색 RAG를 만들고, OpenDART 공시를 SQLite에 적재하며 실행 이력으로 재현성을 확보",
      evidence: "3차 프로젝트 (진행 중)",
    },
  ],
  awards: [
    { title: "음성 멀티모달 만들기", prize: "대상", project: "수상 프로젝트 · K-Menu Voice Guide (1차)" },
    { title: "거대 언어 모델을 활용한 PERSO AI 답변 기능 구현하기", prize: "대상", project: "수상 프로젝트 · MESTORY (2차)" },
  ],
};

export const til = {
  message: "과정 내내 꾸준히 TIL을 썼습니다.",
  sub: "배운 내용은 TIL로 정리하고, 논문 13편을 요약하며 각 기법이 어떤 한계를 해결하려고 나왔는지 기록했습니다. 이 습관이 프로젝트의 평가 리포트로 이어졌습니다.",
  // 출처: 노션 TIL 페이지의 '오늘의 학습' 표 (2026-11-05 확인).
  // 260917 항목은 날짜 칸이 비어 있어 제목으로 날짜를 정했다(본인 확인 후 포함).
  stats: [
    { label: "TIL 총 개수", value: "49편" },
    { label: "작성 기간", value: "2026.06.23 – 10.28" },
    { label: "최장 연속 작성 (평일)", value: "13일" },
  ],
  // 히트맵에 표시할 작성 날짜("YYYY-MM-DD").
  dates: [
    "2026-06-23", "2026-06-24", "2026-06-25", "2026-06-26", "2026-06-29", "2026-06-30",
    "2026-07-01", "2026-07-02", "2026-07-03", "2026-07-06", "2026-07-07", "2026-07-08", "2026-07-09",
    "2026-07-13", "2026-07-14", "2026-07-15", "2026-07-16", "2026-07-20", "2026-07-21", "2026-07-22",
    "2026-07-23", "2026-07-24", "2026-07-28", "2026-07-29", "2026-07-30",
    "2026-08-03", "2026-08-04", "2026-08-05", "2026-08-06", "2026-08-11",
    "2026-09-02", "2026-09-03", "2026-09-04", "2026-09-07", "2026-09-08", "2026-09-09", "2026-09-10",
    "2026-09-11", "2026-09-14", "2026-09-15", "2026-09-16", "2026-09-17",
    "2026-10-13", "2026-10-14", "2026-10-20", "2026-10-21", "2026-10-22", "2026-10-27", "2026-10-28",
  ] as string[],
};

export const skills = [
  "Python", "C", "SQL", "LangChain", "FastMCP", "FastAPI", "OpenRouter", "Langfuse",
  "Whisper", "MMS-TTS", "Qwen3-TTS", "LoRA · PEFT", "PaddleOCR", "OpenCV",
  "Postgres", "Next.js", "React", "TypeScript", "Docker", "Railway", "Hugging Face", "Vercel",
];

export const about = {
  title: "관찰하고, 진단하고, 처방한 뒤, 확인합니다.",
  intro: [
    "학원에서 1년간 초·중등 수학을 가르쳤습니다. 하위권 학생 대부분은 지금 푸는 문제가 아니라 앞 단계 개념에서 멈춰 있었고, 기본 개념 정립 → 교과서 반복 풀이 → 기출 유형 학습의 3단계로 과정을 설계해 상위권 수준까지 끌어올렸습니다.",
    "그때 익힌 방식을 AI 서비스에 그대로 씁니다. 모델의 성능은 감이 아니라 측정으로 판단하고, 문제가 생기면 원인을 나눠 확인합니다.",
  ],
  facts: [
    { label: "경력", items: ["초·중등 수학 강사 1년 (학원)"] },
    { label: "학력", items: ["부산대학교 IT응용공학과 졸업"] },
    { label: "자격", items: ["정보처리기사", "SQLD", "ADsP"] },
    { label: "어학", items: ["G-TELP 92", "TOEIC 840", "영어 회화 가능"] },
    { label: "언어", items: ["Python", "C", "SQL"] },
    { label: "기록", items: ["TIL 49편", "논문 요약 13편"] },
  ],
};

// 마지막 연락 섹션. 자기소개서의 마무리 문장을 바탕으로 했다. 요약 숫자는 근거를 확인한 값만 쓴다.
export const contact = {
  title: "데모가 아니라, 믿고 쓰는 AI 서비스를 만들겠습니다.",
  body: "잘 돌아가는 것처럼 보이는 기능보다 실제 사용자가 믿고 쓸 수 있는 결과를 만드는 일에 관심이 있습니다. 채용이나 협업 제안은 메일로 연락 주세요.",
  highlights: [
    { value: "대상 2회", label: "이스트캠프 프로젝트" },
    { value: "98.6%", label: "STT 설비 코드 정확도" },
    { value: "0.987", label: "답변 정직성 점수" },
  ],
};

export const navItems = [
  { id: "projects", label: "프로젝트" },
  { id: "camp", label: "이스트캠프" },
  { id: "about", label: "소개" },
  { id: "contact", label: "연락" },
];
