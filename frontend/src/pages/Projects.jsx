// src/pages/Projects.jsx
export default function Projects() {
  const projects = [
    {
      num: '01', name: 'Portfolio Ecosystem',
      desc: 'Full-stack portfolio with CMS, JWT auth, BullMQ email queues, Redis caching, and Neon PostgreSQL.',
      tags: ['Express', 'Prisma', 'PostgreSQL', 'BullMQ', 'Redis', 'React'],
      live: '#', code: 'https://github.com',
      year: '2026',
    },
    {
      num: '02', name: 'Blog CMS API',
      desc: 'RESTful CMS backend with authors, posts, tags, full-text search, pagination, and JWT auth.',
      tags: ['Node.js', 'Prisma', 'JWT', 'Neon', 'Express'],
      live: null, code: 'https://github.com',
      year: '2026',
    },
    {
      num: '03', name: 'React Portfolio',
      desc: 'Minimal dark portfolio built with React + Vite + Tailwind, consuming the CMS API in real time.',
      tags: ['React', 'Vite', 'Tailwind', 'React Router'],
      live: '#', code: 'https://github.com',
      year: '2026',
    },
  ]

  const ArrowSvg = () => (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M1 9L9 1M9 1H4M9 1v5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )

  return (
    <div className="max-w-page mx-auto px-12 pt-32 pb-20">
      <p className="text-xs font-medium tracking-widest uppercase text-text3 mb-8">Selected Work</p>

      <div className="flex flex-col">
        {projects.map((p, i) => (
          <div
            key={p.num}
            className={`flex justify-between items-start py-6 border-b border-border gap-6 hover:opacity-75 transition-opacity ${i === 0 ? 'border-t' : ''}`}
          >
            <div className="flex-1">
              <p className="text-2xs text-text3 mb-1">{p.num} · {p.year}</p>
              <p className="text-base font-medium text-text mb-1">{p.name}</p>
              <p className="text-sm font-light text-text2 leading-relaxed mb-3">{p.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {p.tags.map(t => (
                  <span key={t} className="text-2xs text-text3 px-2 py-0.5 rounded-full border border-border2">{t}</span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2 items-end flex-shrink-0 pt-5">
              {p.live && (
                <a href={p.live} target="_blank" rel="noreferrer"
                   className="text-xs text-text3 flex items-center gap-1 hover:text-text transition-colors">
                  <ArrowSvg /> Live
                </a>
              )}
              <a href={p.code} target="_blank" rel="noreferrer"
                 className="text-xs text-text3 flex items-center gap-1 hover:text-text transition-colors">
                <ArrowSvg /> Code
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
