// src/pages/About.jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAuthors } from '../lib/api'
import { useReveal } from '../hooks/useReveal'

const skills = [
  { title: 'Frontend',  items: ['React & Vite', 'JavaScript (ES6+)', 'Tailwind CSS', 'React Router', 'HTML & CSS'] },
  { title: 'Backend',   items: ['Node.js & Express', 'REST APIs', 'PostgreSQL', 'Prisma ORM', 'Redis & BullMQ'] },
  { title: 'DevOps',    items: ['Neon (Serverless PG)', 'Upstash Redis', 'Git & GitHub', 'Vercel / Render', 'Linux'] },
]

const timeline = [
  { year: '2026', title: 'Portfolio Ecosystem', desc: 'Built a full-stack portfolio with CMS, BullMQ queues, Redis caching, and Neon PostgreSQL.' },
  { year: '2025', title: 'Open Source Contributions', desc: 'Contributed to several open-source Node.js and React projects on GitHub.' },
  { year: '2024', title: 'Backend Specialization', desc: 'Deepened expertise in PostgreSQL, REST API design, and distributed systems.' },
  { year: '2023', title: 'Full-Stack Journey Begins', desc: 'Started building production-ready applications across the full stack.' },
]

function Section({ children }) {
  const ref = useReveal()
  return (
    <section ref={ref} className="reveal py-16 border-t border-border">
      {children}
    </section>
  )
}

function SecLabel({ children }) {
  return <p className="text-xs font-medium tracking-widest uppercase text-text3 mb-8">{children}</p>
}

export default function About() {
  const [authors, setAuthors] = useState([])

  useEffect(() => {
    getAuthors().then(setAuthors).catch(() => {})
  }, [])

  // Use first author as "me" — update this to match your actual author id
  const me = authors[0]

  return (
    <div className="max-w-page mx-auto px-6 md:px-12 pt-28 pb-20">

      {/* ── Hero ── */}
      <div className="py-16 border-b border-border">
        <div className="flex items-start gap-5 mb-8">
          {me?.avatarUrl ? (
            <img src={me.avatarUrl} alt={me.name}
              className="w-16 h-16 rounded-full object-cover border border-border flex-shrink-0 grayscale opacity-90" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-border flex items-center justify-center flex-shrink-0">
              <span className="text-xl font-medium text-text3">R</span>
            </div>
          )}
          <div>
            <h1 className="text-2xl font-medium text-text tracking-tight mb-1">
              {me?.name || 'Rahul Biswas'}
            </h1>
            <p className="text-sm font-light text-text2">Full-Stack Software Engineer</p>
          </div>
        </div>

        <div className="space-y-3 mb-8">
          <p className="text-sm font-light text-text2 leading-loose">
            {me?.bio || "I'm a full-stack developer based in Kolkata, India. I've been building for the web, obsessing over clean code, performance, and interfaces people actually enjoy using."}
          </p>
          <p className="text-sm font-light text-text2 leading-loose">
            I work across the full stack but have a deep love for <strong className="text-text font-medium">backend architecture</strong> and developer tooling. I believe great software is the intersection of elegant engineering and thoughtful design.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-0 border border-border rounded-xl overflow-hidden">
          {[
            { label: 'Projects',  value: '10+' },
            { label: 'Posts',     value: me?._count?.posts || '0' },
            { label: 'Status',    value: 'Available ✓', green: true },
          ].map((s, i) => (
            <div key={s.label}
              className={`flex flex-col items-center justify-center py-5 ${i < 2 ? 'border-r border-border' : ''}`}>
              <span className={`text-xl font-medium mb-1 ${s.green ? 'text-green' : 'text-text'}`}>{s.value}</span>
              <span className="text-xs text-text3">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Social links */}
        {(me?.githubUrl || me?.linkedinUrl || me?.twitterUrl) && (
          <div className="flex gap-5 mt-6">
            {me.githubUrl   && <a href={me.githubUrl}   target="_blank" rel="noreferrer" className="text-sm text-text3 hover:text-text transition-colors">GitHub →</a>}
            {me.linkedinUrl && <a href={me.linkedinUrl} target="_blank" rel="noreferrer" className="text-sm text-text3 hover:text-text transition-colors">LinkedIn →</a>}
            {me.twitterUrl  && <a href={me.twitterUrl}  target="_blank" rel="noreferrer" className="text-sm text-text3 hover:text-text transition-colors">Twitter →</a>}
          </div>
        )}
      </div>

      {/* ── Skills ── */}
      <Section>
        <SecLabel>Skills</SecLabel>
        <div className="grid grid-cols-3 gap-8">
          {skills.map(col => (
            <div key={col.title}>
              <p className="text-2xs font-medium text-text3 tracking-widest uppercase mb-4">{col.title}</p>
              <ul className="flex flex-col gap-2">
                {col.items.map(item => (
                  <li key={item} className="text-sm font-light text-text2 flex items-center gap-2">
                    <span className="w-[3px] h-[3px] rounded-full bg-text3 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Timeline ── */}
      <Section>
        <SecLabel>Timeline</SecLabel>
        <div className="flex flex-col">
          {timeline.map((item, i) => (
            <div key={i} className={`flex gap-6 py-5 border-b border-border ${i === 0 ? 'border-t' : ''}`}>
              <span className="text-xs text-text3 flex-shrink-0 w-10 pt-0.5">{item.year}</span>
              <div>
                <p className="text-sm font-medium text-text mb-1">{item.title}</p>
                <p className="text-sm font-light text-text2 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── CTA ── */}
      <Section>
        <SecLabel>Get in touch</SecLabel>
        <p className="text-sm font-light text-text2 mb-6 leading-loose">
          I'm always open to interesting projects and conversations.<br/>
          If you have something in mind, let's talk.
        </p>
        <div className="flex items-center gap-4">
          <a href="/#contact"
            className="inline-flex items-center px-5 py-2 rounded-full bg-text text-bg border border-text text-sm hover:bg-[#d0d0d0] transition-colors">
            Say Hello
          </a>
          <Link to="/projects"
            className="text-sm text-text2 hover:text-text transition-colors">
            View my work →
          </Link>
        </div>
      </Section>

    </div>
  )
}