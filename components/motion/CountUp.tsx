"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

// 화면에 보이면 from → to로 숫자가 올라가는 컴포넌트.
// 서버 렌더링 결과에는 최종값을 그대로 넣어 둔다(JS가 없거나 검색엔진이 읽어도 정확한 숫자가 보이게).
// 숫자 변경은 React state 대신 DOM textContent를 직접 바꿔서, 프레임마다 리렌더링하지 않는다.
export default function CountUp({
  from,
  to,
  decimals = 0,
  prefix = "",
  suffix = "",
}: {
  from: number;
  to: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const prefersReducedMotion = useReducedMotion();
  const format = (value: number) => `${prefix}${value.toFixed(decimals)}${suffix}`;

  useEffect(() => {
    if (!inView || prefersReducedMotion || !ref.current) return;
    const element = ref.current;
    const controls = animate(from, to, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (value) => {
        element.textContent = format(value);
      },
    });
    return () => controls.stop();
    // format은 props로만 결정되므로 의존성에서 제외해도 안전하다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, prefersReducedMotion, from, to]);

  return (
    <span ref={ref} className="tabular">
      {format(to)}
    </span>
  );
}
