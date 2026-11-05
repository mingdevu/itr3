import { About, Contact } from "../components/AboutContact";
import Camp from "../components/Camp";
import Hero from "../components/Hero";
import Nav from "../components/Nav";
import Projects from "../components/Projects";
import SkillMarquee from "../components/SkillMarquee";

// 페이지는 섹션을 순서대로 조립만 한다. 문구는 data/content.ts, 모양은 각 컴포넌트가 맡는다.
export default function Home() {
  return (
    <>
      <a className="skipLink" href="#projects">
        본문으로 건너뛰기
      </a>
      <Nav />
      <main>
        <Hero />
        <Projects />
        <Camp />
        <SkillMarquee />
        <About />
        <Contact />
      </main>
    </>
  );
}
