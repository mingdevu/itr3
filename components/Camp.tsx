"use client";

import { motion, useInView, useReducedMotion, useScroll } from "motion/react";
import { useMemo, useRef, type CSSProperties } from "react";
import { camp, profile, til } from "../data/content";
import TodoText from "./TodoText";
import Reveal from "./motion/Reveal";

const EMPTY_WEEKS = 18;
const DAY_MS = 24 * 60 * 60 * 1000;
const WEEKDAY_LABELS = ["월", "화", "수", "목", "금"];

type HeatCell = { key: string; isWritten: boolean; label: string };

const toIso = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

// TIL 작성 날짜 목록으로 주(열) × 평일(행 5개) 격자를 만든다.
// 주말 작성 기록이 0건이라 주말 줄은 빼서, 의미 없는 빈칸 없이 촘촘하게 보이게 했다.
// 날짜가 비어 있으면 빈 격자만 그린다. 가짜 기록으로 채우지 않기 위해서다.
function buildHeatmap(dates: string[]): HeatCell[][] {
  const written = new Set(dates);
  if (dates.length === 0) {
    return Array.from({ length: EMPTY_WEEKS }, (_, week) =>
      WEEKDAY_LABELS.map((_, day) => ({ key: `empty-${week}-${day}`, isWritten: false, label: "" }))
    );
  }
  const sorted = [...dates].sort();
  const first = new Date(`${sorted[0]}T00:00:00`);
  const last = new Date(`${sorted[sorted.length - 1]}T00:00:00`);
  const daysSinceMonday = (first.getDay() + 6) % 7;
  const weeks: HeatCell[][] = [];
  for (let monday = new Date(first.getTime() - daysSinceMonday * DAY_MS); monday <= last; monday = new Date(monday.getTime() + 7 * DAY_MS)) {
    weeks.push(
      WEEKDAY_LABELS.map((_, day) => {
        const iso = toIso(new Date(monday.getTime() + day * DAY_MS));
        return { key: iso, isWritten: written.has(iso), label: iso };
      })
    );
  }
  return weeks;
}

function TilHeatmap() {
  const gridRef = useRef<HTMLDivElement>(null);
  const isVisible = useInView(gridRef, { once: true, margin: "0px 0px -15% 0px" });
  const weeks = useMemo(() => buildHeatmap(til.dates), []);
  const hasData = til.dates.length > 0;

  return (
    <div className="heatmapCard glass">
      <div className="heatmapHead">
        <span className="mono">TIL 작성 기록 · 평일</span>
        {!hasData && <TodoText text="TODO(확인 필요) 작성 날짜 데이터를 넣으면 채워집니다" />}
      </div>
      <div className="heatmapBody">
        <div className="heatDays mono" aria-hidden>
          {WEEKDAY_LABELS.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
        {/* 열 개수를 CSS 변수로 넘겨, 주 수와 상관없이 카드 폭을 꽉 채우게 한다 */}
        <div
          ref={gridRef}
          className={`heatmap ${isVisible ? "isVisible" : ""}`}
          style={{ "--weeks": weeks.length } as CSSProperties}
          role="img"
          aria-label={hasData ? `TIL 작성 기록 히트맵, 평일 기준 ${til.dates.length}일 작성` : "TIL 작성 기록 히트맵, 데이터 준비 중"}
        >
          {weeks.flatMap((week, weekIndex) =>
            week.map((cell) => (
              <span
                key={cell.key}
                className={`heatCell ${cell.isWritten ? "isWritten" : ""}`}
                style={{ animationDelay: `${weekIndex * 30}ms` }}
                title={cell.label || undefined}
              />
            ))
          )}
        </div>
      </div>
      <div className="heatLegend mono" aria-hidden>
        <span>없음</span>
        <span className="heatCell" />
        <span className="heatCell isWritten" />
        <span>작성</span>
      </div>
    </div>
  );
}

function Timeline() {
  const listRef = useRef<HTMLOListElement>(null);
  const prefersReducedMotion = useReducedMotion();
  // 타임라인 목록이 화면을 지나가는 정도(0→1)를 세로선의 scaleY로 쓴다. transform만 바뀐다.
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 80%", "end 55%"] });

  return (
    <div className="timelineWrap">
      <span className="timelineTrack" aria-hidden />
      <motion.span
        className="timelineFill"
        style={{ scaleY: prefersReducedMotion ? 1 : scrollYProgress }}
        aria-hidden
      />
      <ol ref={listRef} className="timeline">
        {camp.timeline.map((item, index) => (
          <Reveal as="li" key={item.title} delay={index * 0.04} className="timelineItem">
            <span className="timelineDot" aria-hidden />
            <p className="timelineWhen mono">
              <TodoText text={item.when} />
            </p>
            <h4>{item.title}</h4>
            <p className="timelineDetail">
              <TodoText text={item.detail} />
            </p>
            {item.evidence && <span className="evidence mono">근거 · {item.evidence}</span>}
          </Reveal>
        ))}
      </ol>
    </div>
  );
}

export default function Camp() {
  return (
    <section id="camp" className="section">
      <Reveal className="sectionHead">
        <p className="eyebrow mono">02 · EST Camp</p>
        <h2>{camp.title}</h2>
        <p className="sectionIntro">
          {camp.intro}
        </p>
      </Reveal>

      <div className="campGrid">
        <Timeline />

        <div className="campSide">
          <Reveal className="awardBlock">
            <p className="eyebrow mono">Awards</p>
            <ul className="awardList">
              {camp.awards.map((award) => (
                <li key={award.title} className="awardCard glass">
                  <span className="awardPrize display">{award.prize}</span>
                  <strong>{award.title}</strong>
                  <small>
                    <TodoText text={award.project} />
                  </small>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="tilBlock" delay={0.1}>
            <p className="eyebrow mono">Daily TIL</p>
            <h3 className="tilMessage">{til.message}</h3>
            <p className="tilSub">{til.sub}</p>
            <ul className="tilStats">
              {til.stats.map((stat) => (
                <li key={stat.label}>
                  <span className="mono">{stat.label}</span>
                  <strong>
                    <TodoText text={stat.value} />
                  </strong>
                </li>
              ))}
            </ul>
            <TilHeatmap />
            <a className="button secondary tilLink" href={profile.tilNotion} target="_blank" rel="noreferrer">
              노션에서 TIL 보기 <span aria-hidden>↗</span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
