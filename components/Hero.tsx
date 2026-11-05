"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import type { PointerEvent } from "react";
import { hero, profile } from "../data/content";
import CountUp from "./motion/CountUp";
import { useFinePointer } from "./motion/useFinePointer";

const SPOTLIGHT_SIZE = 560;

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const isFinePointer = useFinePointer();
  const spotlightEnabled = isFinePointer && !prefersReducedMotion;

  // 마우스를 따라오는 빛: 원 하나를 transform(x, y)으로만 옮긴다.
  // 배경 그라데이션을 매 프레임 다시 그리는 방식보다 GPU 합성만으로 끝나서 가볍다.
  const spotX = useSpring(useMotionValue(-SPOTLIGHT_SIZE), { stiffness: 120, damping: 24 });
  const spotY = useSpring(useMotionValue(-SPOTLIGHT_SIZE), { stiffness: 120, damping: 24 });

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (!spotlightEnabled) return;
    const rect = event.currentTarget.getBoundingClientRect();
    spotX.set(event.clientX - rect.left - SPOTLIGHT_SIZE / 2);
    spotY.set(event.clientY - rect.top - SPOTLIGHT_SIZE / 2);
  };

  // 헤드라인을 어절(띄어쓰기) 단위로 나눠 순서대로 등장시킨다.
  // 글자 단위로 쪼개면 한국어 keep-all 줄바꿈이 깨지고 스크린리더가 한 글자씩 읽기 때문이다.
  let wordIndex = 0;
  const fullHeadline = hero.headline.join(" ");

  return (
    <section id="top" className="hero" onPointerMove={handlePointerMove}>
      <div className="heroAurora" aria-hidden>
        <span className="aurora auroraPink" />
        <span className="aurora auroraPurple" />
        <span className="aurora auroraBlue" />
      </div>
      {spotlightEnabled && <motion.span className="spotlight" style={{ x: spotX, y: spotY }} aria-hidden />}

      <div className="heroInner">
        <motion.p
          className="eyebrow mono"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="liveDot" aria-hidden />
          {hero.eyebrow}
        </motion.p>

        <h1 className="heroTitle" aria-label={fullHeadline}>
          {hero.headline.map((line, lineIndex) => (
            <span className={`heroLine ${lineIndex === hero.headline.length - 1 ? "accentLine" : ""}`} key={line} aria-hidden>
              {line.split(" ").map((word, index, words) => {
                const delay = 0.15 + wordIndex++ * 0.08;
                return (
                  <span key={`${word}-${index}`}>
                    <span className="wordMask">
                      <motion.span
                        className="word"
                        initial={{ y: "105%", opacity: 0 }}
                        animate={{ y: "0%", opacity: 1 }}
                        transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
                      >
                        {word}
                      </motion.span>
                    </span>
                    {index < words.length - 1 ? " " : ""}
                  </span>
                );
              })}
            </span>
          ))}
        </h1>

        <motion.p
          className="heroIntro"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75 }}
        >
          {hero.intro}
        </motion.p>

        <motion.div
          className="heroActions"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
        >
          <a className="button primary" href="#projects">
            프로젝트 보기
          </a>
          <a className="button secondary" href={profile.github} target="_blank" rel="noreferrer">
            GitHub <span aria-hidden>↗</span>
          </a>
          <a className="button ghost" href={profile.tilNotion} target="_blank" rel="noreferrer">
            매일 쓴 TIL <span aria-hidden>↗</span>
          </a>
        </motion.div>

        <ul className="heroStats">
          {hero.stats.map((stat, index) => (
            <motion.li
              key={stat.label}
              className="statCard glass"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.05 + index * 0.1 }}
            >
              <strong className="statValue display">
                <CountUp from={stat.from} to={stat.to} decimals={stat.decimals} prefix={stat.prefix} suffix={stat.suffix} />
              </strong>
              <span className="statLabel">{stat.label}</span>
              <span className="statNote mono">{stat.note}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
