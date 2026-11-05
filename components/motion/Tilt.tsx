"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import type { PointerEvent, ReactNode } from "react";
import { useFinePointer } from "./useFinePointer";

const MAX_TILT_DEG = 5;

// 마우스 위치에 따라 카드를 살짝 기울이는 3D tilt.
// rotateX/rotateY(transform)만 바꾸고, spring으로 부드럽게 따라가게 한다.
// 터치 기기나 '동작 줄이기' 사용자에게는 기울이지 않는다.
export default function Tilt({ children, className }: { children: ReactNode; className?: string }) {
  const isFinePointer = useFinePointer();
  const prefersReducedMotion = useReducedMotion();
  const enabled = isFinePointer && !prefersReducedMotion;

  const rotateX = useSpring(useMotionValue(0), { stiffness: 220, damping: 22 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 220, damping: 22 });

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!enabled) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const relativeX = (event.clientX - rect.left) / rect.width - 0.5;
    const relativeY = (event.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(relativeX * MAX_TILT_DEG * 2);
    rotateX.set(-relativeY * MAX_TILT_DEG * 2);
  };

  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      className={className}
      style={enabled ? { rotateX, rotateY, transformPerspective: 1000 } : undefined}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.div>
  );
}
