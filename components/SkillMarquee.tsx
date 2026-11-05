import { skills } from "../data/content";

// 무한으로 흐르는 기술 배지 띠.
// 같은 목록을 두 번 이어 붙이고 CSS로 -50%만큼 이동시키면 끊김 없이 반복된다.
// 두 번째 목록은 스크린리더가 중복으로 읽지 않도록 aria-hidden 처리한다.
export default function SkillMarquee() {
  return (
    <section className="marqueeSection" aria-label="프로젝트에서 다룬 기술">
      <div className="marquee">
        <ul className="marqueeTrack">
          {skills.map((skill) => (
            <li key={skill} className="marqueeItem">
              {skill}
            </li>
          ))}
        </ul>
        <ul className="marqueeTrack" aria-hidden>
          {skills.map((skill) => (
            <li key={`${skill}-copy`} className="marqueeItem">
              {skill}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
