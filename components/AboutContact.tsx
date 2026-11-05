import { about, contact, profile } from "../data/content";
import Reveal from "./motion/Reveal";

export function About() {
  return (
    <section id="about" className="section aboutGrid">
      <Reveal className="sectionHead">
        <p className="eyebrow mono">03 · About · {profile.name}</p>
        <h2>{about.title}</h2>
        {about.intro.map((paragraph) => (
          <p key={paragraph} className="sectionIntro aboutParagraph">
            {paragraph}
          </p>
        ))}
      </Reveal>
      <Reveal className="factGrid" delay={0.1}>
        {about.facts.map((fact) => (
          <div key={fact.label} className="factCard glass">
            <span className="mono">{fact.label}</span>
            <ul>
              {fact.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </Reveal>
    </section>
  );
}

// 왼쪽: 제안 문구와 바로 행동할 버튼 / 오른쪽: 연락처 목록과 한눈에 보는 요약.
// 가운데에 링크 두 개만 있던 빈 칸을 두 단으로 나눠 채웠다.
export function Contact() {
  const contactRows = [
    { label: "Email", value: profile.email, href: `mailto:${profile.email}`, external: false },
    { label: "GitHub", value: "github.com/mingdevu", href: profile.github, external: true },
    { label: "TIL", value: "노션 학습 기록", href: profile.tilNotion, external: true },
  ];

  return (
    <section id="contact" className="section">
      <Reveal className="contactCard glass">
        <div className="contactMain">
          <p className="eyebrow mono">04 · Contact</p>
          <h2>{contact.title}</h2>
          <p className="contactBody">{contact.body}</p>
          <div className="heroActions">
            <a className="button primary" href={`mailto:${profile.email}`}>
              메일 보내기
            </a>
            <a className="button secondary" href={profile.github} target="_blank" rel="noreferrer">
              GitHub <span aria-hidden>↗</span>
            </a>
          </div>
        </div>

        <div className="contactAside">
          <ul className="contactList">
            {contactRows.map((row) => (
              <li key={row.label}>
                <a
                  className="contactRow"
                  href={row.href}
                  {...(row.external ? { target: "_blank", rel: "noreferrer" } : {})}
                >
                  <span className="mono">{row.label}</span>
                  <strong>{row.value}</strong>
                  <span className="contactArrow" aria-hidden>
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <ul className="contactHighlights">
            {contact.highlights.map((item) => (
              <li key={item.label}>
                <strong className="display">{item.value}</strong>
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
      <footer className="footer mono">© 2026 {profile.name} · Built with Next.js</footer>
    </section>
  );
}
