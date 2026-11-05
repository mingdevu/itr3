"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { projects, type Project } from "../data/content";
import TodoText from "./TodoText";
import Reveal from "./motion/Reveal";
import Tilt from "./motion/Tilt";

const gateLabel = { pass: "통과", fail: "미달", pending: "기준 미정" } as const;

function ProjectDetail({ project }: { project: Project }) {
  return (
    <div className="detail">
      <section className="detailBlock">
        <h4 className="detailStep mono">01 · 문제</h4>
        <p>{project.problem}</p>
      </section>

      <section className="detailBlock">
        <h4 className="detailStep mono">02 · 접근</h4>
        <ul className="bulletList">
          {project.approach.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        {project.architecture && (
          <figure className="archFlow">
            <figcaption className="mono">아키텍처 요약</figcaption>
            <ol>
              {project.architecture.map((edge) => (
                <li key={`${edge.from}-${edge.to}`}>
                  <span className="archNode">{edge.from}</span>
                  <span className="archEdge mono">{edge.label} →</span>
                  <span className="archNode">{edge.to}</span>
                </li>
              ))}
            </ol>
          </figure>
        )}
      </section>

      <section className="detailBlock">
        <h4 className="detailStep mono">03 · 결과</h4>
        <ul className="metricGrid">
          {project.results.map((metric) => (
            <li key={metric.label} className="metric">
              <strong className="display">{metric.value}</strong>
              <span>{metric.label}</span>
              {metric.note && <small>{metric.note}</small>}
            </li>
          ))}
        </ul>

        {project.gates && (
          <div className="gateBox">
            <div className="gateHead">
              <span className="verdict mono">출시 판정 · {project.gates.verdict}</span>
              <p>{project.gates.summary}</p>
            </div>
            <table className="gateTable">
              <thead>
                <tr>
                  <th scope="col">게이트</th>
                  <th scope="col">기준</th>
                  <th scope="col">측정값</th>
                  <th scope="col">판정</th>
                </tr>
              </thead>
              <tbody>
                {project.gates.items.map((gate) => (
                  <tr key={gate.name}>
                    <th scope="row">{gate.name}</th>
                    <td className="mono">{gate.rule}</td>
                    <td className="mono">{gate.measured}</td>
                    <td>
                      <span className={`gatePill ${gate.pass}`}>{gateLabel[gate.pass]}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {project.honesty && (
          <div className="honesty">
            <span className="mono">숨기지 않고 기록한 것</span>
            <ul className="bulletList">
              {project.honesty.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className="detailBlock">
        <h4 className="detailStep mono">04 · 내 역할</h4>
        <ul className="bulletList">
          {project.role.map((item) => (
            <li key={item}>
              <TodoText text={item} />
            </li>
          ))}
        </ul>
        <ul className="linkRow">
          {project.links.map((link) => (
            <li key={link.href}>
              <a className="linkChip" href={link.href} target="_blank" rel="noreferrer">
                {link.label} <span aria-hidden>↗</span>
              </a>
              {link.note && <small className="linkNote">{link.note}</small>}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function ProjectCard({ project, isOpen, onToggle }: { project: Project; isOpen: boolean; onToggle: () => void }) {
  const detailId = `${project.id}-detail`;
  const isFeatured = project.id === "mestory";
  const githubUrl = project.links.find((link) => link.label === "GitHub")?.href;

  return (
    <motion.article
      layout
      transition={{ layout: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }}
      className={`bentoCard ${isFeatured ? "isFeatured" : ""} ${isOpen ? "isOpen" : ""}`}
      aria-labelledby={`${project.id}-title`}
    >
      {/* 펼쳐진 카드는 면적이 커서 기울이면 어색하므로 tilt를 끈다 */}
      <Tilt className={`cardSurface glass ${isOpen ? "" : "canTilt"}`}>
        <span className="cardGlow" aria-hidden />
        <motion.div layout="position" className="cardFace">
          {/* 카드 전체를 덮는 링크: 카드 어디를 눌러도 GitHub가 새 탭으로 열린다.
              진짜 <a>라서 키보드(Tab·Enter)와 스크린리더로도 쓸 수 있다. 상세 버튼은 이 링크보다 위에 놓인다. */}
          {githubUrl && (
            <a className="cardLink" href={githubUrl} target="_blank" rel="noreferrer" aria-label={`${project.name} GitHub 저장소 새 탭에서 열기`}>
              <span className="cardLinkHint mono" aria-hidden>
                GitHub ↗
              </span>
            </a>
          )}
          <div className="cardText">
            <p className="cardMeta mono">{project.meta}</p>
            <h3 id={`${project.id}-title`} className="cardTitle display">
              {project.name}
            </h3>
            <p className="cardTagline">{project.tagline}</p>

            <div className="headlineMetric">
              <strong className="display">{project.headlineMetric.value}</strong>
              <span>{project.headlineMetric.label}</span>
              {project.headlineMetric.note && <small className="mono">{project.headlineMetric.note}</small>}
            </div>

            <ul className="chipRow" aria-label="사용 기술">
              {project.stack.map((tech) => (
                <li key={tech} className="chip">
                  {tech}
                </li>
              ))}
            </ul>
          </div>

          <div className="cardMedia">
            {project.image ? (
              <Image
                src={project.image.src}
                alt={project.image.alt}
                width={project.image.width}
                height={project.image.height}
                unoptimized={project.image.unoptimized}
                sizes="(max-width: 900px) 100vw, 60vw"
              />
            ) : (
              <div className="mediaPlaceholder">
                <span className="display">{project.name}</span>
                {project.imageTodo && <TodoText text={project.imageTodo} />}
              </div>
            )}
          </div>

          <button
            type="button"
            className="detailToggle"
            aria-expanded={isOpen}
            aria-controls={detailId}
            onClick={onToggle}
          >
            {isOpen ? "상세 닫기" : "문제 → 접근 → 결과 → 역할 보기"}
            <span className={`toggleIcon ${isOpen ? "isOpen" : ""}`} aria-hidden>
              +
            </span>
          </button>
        </motion.div>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              id={detailId}
              key="detail"
              className="detailWrap"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.45, delay: 0.2 } }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
            >
              <ProjectDetail project={project} />
            </motion.div>
          )}
        </AnimatePresence>
      </Tilt>
    </motion.article>
  );
}

export default function Projects() {
  // 한 번에 하나의 프로젝트만 펼친다. 여러 개를 동시에 열면 그리드가 너무 길어진다.
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section id="projects" className="section">
      <Reveal className="sectionHead">
        <p className="eyebrow mono">01 · Projects</p>
        <h2>직접 만들고, 직접 잰 프로젝트</h2>
        <p className="sectionIntro">
          카드를 누르면 GitHub 저장소가 열리고, 아래 버튼을 누르면 문제 → 접근 → 결과 → 내 역할 순서로 상세를 볼 수 있습니다. 수치는 각 레포의 README와 평가 리포트에 적힌 값만 옮겼습니다.
        </p>
      </Reveal>

      <LayoutGroup>
        <div className="bento">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              isOpen={openId === project.id}
              onToggle={() => setOpenId((current) => (current === project.id ? null : project.id))}
            />
          ))}
        </div>
      </LayoutGroup>
    </section>
  );
}
