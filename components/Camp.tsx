"use client";

import { motion, useInView, useReducedMotion, useScroll } from "motion/react";
import { useMemo, useRef } from "react";
import { camp, profile, til } from "../data/content";
import TodoText from "./TodoText";
import Reveal from "./motion/Reveal";

const EMPTY_WEEKS = 26;
const DAY_MS = 24 * 60 * 60 * 1000;

// TIL 작성 날짜 목록으로 GitHub 잔디 같은 주(열) × 요일(행) 격자를 만든다.
// 날짜가 비어 있으면 빈 격자만 그린다. 가짜 기록으로 채우지 않기 위해서다.
function buildHeatmap(dates: string[]) {
  const written = new Set(dates);
  if (dates.length === 0) {
    return Array.from({ length: EMPTY_WEEKS }, (_, week) =>
      Array.from({ length: 7 }, (_, day) => ({ key: `empty-${week}-${day}`, isWritten: false, label: "" }))
    );
  }
  const sorted = [...dates].sort();
  const first = new Date(`${sorted[0]}T00:00:00`);
  const last = new Date(`${sorted[sorted.length - 1]}T00:00:00`);
  const start = new Date(first.getTime() - first.getDay() * DAY_MS); // 그 주의 일요일부터
  const weeks: { key: string; isWritten: boolean; label: string }[][] = [];
  for (let cursor = start; cursor <= last; ) {
    const week = [];
    for (let day = 0; day < 7; day++) {
      const iso = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(cursor.getDate()).padStart(2, "0")}`;
      week.push({ key: iso, isWritten: written.has(iso), label: iso });
      cursor = new Date(cursor.getTime() + DAY_MS);
    }
    weeks.push(week);
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
        <span className="mono">TIL 작성 기록</span>
        {!hasData && <TodoText text="TODO(확인 필요) 작성 날짜 데이터를 넣으면 채워집니다" />}
      </div>
      <div className="heatmapScroll">
        <div
          ref={gridRef}
          className={`heatmap ${isVisible ? "isVisible" : ""}`}
          role="img"
          aria-label={hasData ? `TIL 작성 기록 히트맵, ${til.dates.length}일 작성` : "TIL 작성 기록 히트맵, 데이터 준비 중"}
        >
          {weeks.map((week, weekIndex) => (
            <div className="heatCol" key={week[0].key}>
              {week.map((cell) => (
                <span
                  key={cell.key}
                  className={`heatCell ${cell.isWritten ? "isWritten" : ""}`}
                  style={{ animationDelay: `${weekIndex * 28}ms` }}
                  title={cell.label || undefined}
                />
              ))}
            </div>
          ))}
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
          과정 기간: <TodoText text={camp.period} />. 배운 기술마다 실제로 쓴 프로젝트를 근거로 붙였습니다.
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
