"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

// 스크롤로 화면에 들어올 때 살짝 올라오며 나타나는 래퍼.
// opacity와 transform(y)만 움직여서 레이아웃을 다시 계산하지 않는다.
export default function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  const Component = motion[as];
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Component>
  );
}
