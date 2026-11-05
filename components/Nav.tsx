"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { navItems } from "../data/content";

// 스크롤하면 살짝 작아지는 글래스 헤더 + 현재 보고 있는 섹션 하이라이트.
// 작아지는 효과는 transform(scale·translate)으로만 처리해서 본문 레이아웃이 흔들리지 않는다.
export default function Nav() {
  const [isCompact, setIsCompact] = useState(false);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const onScroll = () => setIsCompact(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // 화면 가운데 띠에 들어온 섹션을 '현재 섹션'으로 본다.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    navItems.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <header className={`navWrap ${isCompact ? "isCompact" : ""}`}>
      <nav className="nav glass" aria-label="주요 섹션">
        <a href="#top" className="brand">
          <span className="brandDot" aria-hidden />
          박민영<span className="brandRole">AI Engineer</span>
        </a>
        <ul className="navLinks">
          {navItems.map(({ id, label }) => (
            <li key={id}>
              <a href={`#${id}`} aria-current={activeId === id ? "true" : undefined}>
                {activeId === id && (
                  <motion.span layoutId="navActive" className="navActive" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
                )}
                <span className="navLabel">{label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
