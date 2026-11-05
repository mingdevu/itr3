"use client";

import { ReactLenis } from "lenis/react";
import { MotionConfig, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

// 앱 전체를 감싸는 모션 설정.
// - MotionConfig reducedMotion="user": OS에서 '동작 줄이기'를 켠 사용자에게는 motion이 transform·layout 애니메이션을 자동으로 끈다.
// - Lenis(부드러운 스크롤)도 같은 사용자에게는 아예 켜지 않는다. 스크롤 관성이 멀미를 유발할 수 있기 때문이다.
export default function MotionProvider({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      {prefersReducedMotion ? (
        children
      ) : (
        <ReactLenis root options={{ lerp: 0.12, anchors: { offset: -88 } }}>
          {children}
        </ReactLenis>
      )}
    </MotionConfig>
  );
}
