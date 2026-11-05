import { about, profile } from "../data/content";
import Reveal from "./motion/Reveal";

export function About() {
  return (
    <section id="about" className="section aboutGrid">
      <Reveal className="sectionHead">
        <p className="eyebrow mono">03 · About</p>
        <h2>{profile.name}</h2>
        <p className="sectionIntro">{about.intro}</p>
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

export function Contact() {
  return (
    <section id="contact" className="section">
      <Reveal className="contactCard glass">
        <p className="eyebrow mono">04 · Contact</p>
        <h2>함께 만들고, 함께 잴 팀을 찾고 있습니다.</h2>
        <div className="contactLinks">
          <a className="contactItem" href={`mailto:${profile.email}`}>
            <span className="mono">Email</span>
            <strong>{profile.email}</strong>
          </a>
          <a className="contactItem" href={profile.github} target="_blank" rel="noreferrer">
            <span className="mono">GitHub</span>
            <strong>github.com/mingdevu</strong>
          </a>
        </div>
      </Reveal>
      <footer className="footer mono">© 2026 {profile.name} · Built with Next.js</footer>
    </section>
  );
}
