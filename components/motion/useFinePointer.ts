"use client";

import { useEffect, useState } from "react";

// 마우스처럼 정밀한 포인터 + hover가 가능한 기기인지 판별한다.
// 터치 기기(모바일)에서는 tilt·spotlight를 끄기 위해 쓴다.
export function useFinePointer() {
  const [isFinePointer, setIsFinePointer] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setIsFinePointer(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return isFinePointer;
}
