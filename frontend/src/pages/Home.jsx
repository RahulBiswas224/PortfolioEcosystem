// src/pages/Home.jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'
import { getPosts } from '../lib/api'
import profileImg from '../assets/image/profile-image.jpeg';
import resume from '../assets/documents/Rahul_Biswas_Resume_2026.pdf';

// ── Pill button ───────────────────────────────────────────────
function Pill({ href, to, fill, children, style }) {
  const cls = `inline-flex items-center px-5 py-2 rounded-full border text-sm transition-all cursor-pointer
    ${fill
      ? 'bg-text text-bg border-text hover:bg-[#d0d0d0] hover:border-[#d0d0d0]'
      : 'border-border2 text-text bg-transparent hover:border-[#444] hover:bg-white/5'
    }`
  if (to) return <Link to={to} className={cls} style={style}>{children}</Link>
  return <a href={href} className={cls} style={style}>{children}</a>
}

// ── Arrow + GitHub SVGs ───────────────────────────────────────
const ArrowSvg = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <path d="M1 9L9 1M9 1H4M9 1v5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// ── Section wrapper with reveal ───────────────────────────────
function Section({ id, children }) {
  const ref = useReveal()
  return (
    <section ref={ref} id={id} className="reveal py-20 border-t border-border">
      {children}
    </section>
  )
}

function SecLabel({ children }) {
  return <p className="text-xs font-medium tracking-widest uppercase text-text3 mb-8">{children}</p>
}

// ── Home ──────────────────────────────────────────────────────
export default function Home() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    getPosts({ limit: 3, published: 'true' })
      .then(r => setPosts(r.data || []))
      .catch(() => {})
  }, [])

  return (
    <div className="max-w-page mx-auto px-12">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-[#1DA1F2]/10 rounded-full blur-[130px] pointer-events-none z-0" />
      {/* ── HERO ── */}
      <section id="hero" className="min-h-screen flex items-center">
        <div className="space-y-0">
        <div className="relative w-11 h-11 mb-5 animate-fade-up" style={{ animationDelay: '0.15s', opacity: 0 }}>
          <img
            src={profileImg}
            alt="Rahul"
            className="w-full h-full rounded-full object-cover"
          />
          {/* Green Online Dot Status Indicator */}
          <span className="absolute bottom-0 right-0 block w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#0a0a0a] ring-1 ring-black/10" />
        </div>

         <p className="flex items-center gap-2 font-runde text-[24px] font-medium tracking-[-1px] leading-[28.8px] text-white mb-4 animate-fade-up" style={{ animationDelay: '0.22s', opacity: 0 ,marginBottom: '1rem' }}>
            <span>Hi, I'm Rahul Biswas.</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="w-6 h-6 shrink-0" 
              fill="#3ecf8e" 
              viewBox="0 0 256 256"
            >
              <path d="M225.86,102.82c-3.77-3.94-7.67-8-9.14-11.57-1.36-3.27-1.44-8.69-1.52-13.94-.15-9.76-.31-20.82-8-28.51s-18.75-7.85-28.51-8c-5.25-.08-10.67-.16-13.94-1.52-3.56-1.47-7.63-5.37-11.57-9.14C146.28,23.51,138.44,16,128,16s-18.27,7.51-25.18,14.14c-3.94,3.77-8,7.67-11.57,9.14C88,40.64,82.56,40.72,77.31,40.8c-9.76.15-20.82.31-28.51,8S41,67.55,40.8,77.31c-.08,5.25-.16,10.67-1.52,13.94-1.47,3.56-5.37,7.63-9.14,11.57C23.51,109.72,16,117.56,16,128s7.51,18.27,14.14,25.18c3.77,3.94,7.67,8,9.14,11.57,1.36,3.27,1.44,8.69,1.52,13.94.15,9.76.31,20.82,8,28.51s18.75,7.85,28.51,8c5.25.08,10.67.16,13.94,1.52,3.56,1.47,11.57,9.14,11.57,9.14C109.72,232.49,117.56,240,128,240s18.27-7.51,25.18-14.14c3.94-3.77,8-7.67,11.57-9.14,3.27-1.36,8.69-1.44,13.94-1.52,9.76-.15,20.82-.31,28.51-8s7.85-18.75,8-28.51c.08-5.25.16-10.67,1.52-13.94,1.47-3.56,5.37-7.63,9.14-11.57C232.49,146.28,240,138.44,240,128S232.49,109.73,225.86,102.82Zm-52.2,6.84-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z"></path>
            </svg>
          </p>
          <p className="font-sans text-[13px] font-light leading-loose text-text2 mb-6 animate-fade-up" style={{ animationDelay: '0.29s', opacity: 0 }}>
            <strong className="text-text font-medium"> <em className="text-amber not-italic"> </em>Cloud-focused Full-Stack Engineer</strong>
             and 
            <strong className="text-text font-medium"> <em className="text-amber not-italic"></em>AWS Solutions Architect trainee</strong>. 
            I bridge the gap between <strong className="text-text font-medium"> <em className="text-amber not-italic"></em>complex web architectures</strong> 
            and cloud infrastructure—building robust React/Node 
            <strong className="text-text font-medium"> <em className="text-amber not-italic"></em>apps  
            backed by fault-tolerant, automated AWS environments</strong>.
          </p>
          <p className="text-sm font-light text-text2 mb-6 animate-fade-up"
             style={{ animationDelay: '0.33s', opacity: 0 }}>
            Currently working on{' '}
            <strong className="text-text font-medium">
              Portfolio Ecosystem <em className="text-amber not-italic">⚡</em>
            </strong>
          </p>
          <p className="text-sm font-medium text-text mb-2 animate-fade-up"
            style={{ animationDelay: '0.38s', opacity: 0, marginTop: '2rem' }}>
            Top Skills
          </p>
          <div className="flex flex-wrap items-center text-sm font-light text-text2 mb-7 animate-fade-up gap-y-1"
              style={{ animationDelay: '0.42s', opacity: 0 ,marginTop:'.5rem'}}>
            {[
              'AWS Ecosystem (EC2/S3/VPC)', 
              'Bash Scripting & Linux',
              'CloudFormation (IaC)', 
              'PostgreSQL & Prisma', 
              'Node.js & Express', 
              'Redis & BullMQ', 
              'React & Vite', 
            ].map((s, i, arr) => (
              <span key={s} className="inline-flex items-center">
                {s}{i < arr.length - 1 && <span className="mx-2 text-text3 select-none">·</span>}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4 animate-fade-up" style={{ animationDelay: '0.50s', opacity: 0 , marginTop: '1rem' }}>
  
          <Pill 
            href="#contact"
            className="group relative transition-all duration-300 hover:ring-4 hover:ring-[#1DA1F2]/20"
          >
            Say Hello
          </Pill>

          <Pill 
            href="#projects" 
            className="group inline-flex items-center"
            style={{ 
              borderColor: 'transparent', 
              color: '#1DA1F2', 
              paddingLeft: '4px' 
            }}
          >
            View work 
            <span className="inline-block translate-x-0 group-hover:translate-x-1 transition-transform duration-200 ease-out ml-1.5 select-none">
              →
            </span>
          </Pill>

        </div>
        </div>
      </section>
      
      {/* ── ABOUT ── */}
      <Section id="about">
      <SecLabel>
        <span className="inline-block pb-1 border-b-2 border-[#1DA1F2]/40">
          <strong className="text-text font-bold"><span className="text-xl opacity-80 select-none">🎓</span>About</strong>
        </span>
      </SecLabel>     
      <div className="mb-9 space-y-3">
        {[
          <>I'm <strong className="text-text font-medium">Rahul Biswas</strong>, a cloud-focused full-stack developer based near <strong className="text-text font-medium">Kolkata, India</strong>. Pursuing my BCA (Hons) with a <strong className="text-text font-medium">9.40 CGPA</strong>, I engineer web applications that are performance-optimized from the UI layer down to the hosting infrastructure.</>,
          <>While I write robust code across the full stack, my core passion lies in <strong className="text-text font-medium">Cloud Architecture &amp; DevOps</strong>. Through intensive AWS re/Start training, I have completed over 30+ enterprise-grade hands-on labs spanning serverless setups, automated network engineering, and secure identity management.</>,
          <>I specialize in provisioning <strong className="text-text font-medium">Infrastructure as Code (IaC)</strong> using AWS CloudFormation and integrating predictive environments using <strong className="text-text font-medium">Amazon SageMaker and Bedrock</strong>—ensuring software isn't just functional, but securely resilient and highly scalable.</>,
        ].map((p, i) => (
          <p key={i} className="text-sm font-light text-text2 leading-loose">{p}</p>
        ))}
      </div>
      
      <div className="flex flex-col">
        {[
          { k: 'Location',   v: 'Kolkata, India' },
          { k: 'Specialty',  v: 'Cloud Architecture & Full-Stack' },
          { k: 'Core Stack', v: 'AWS · Node.js · React · MongoDB' },
          { k: 'AWS Labs',   v: '30+ Environments Built' },
          { k: 'Status',     v: 'Available for Roles ✓', green: true },
        ].map((s, i) => (
          <div key={i} className={`flex justify-between items-center py-3 border-b border-border ${i === 0 ? 'border-t' : ''}`}>
            <span className="text-xs text-text3 tracking-wider">{s.k}</span>
            <span className={`text-sm font-normal ${s.green ? 'text-green' : 'text-text'}`}>{s.v}</span>
          </div>
        ))}
      </div>
    </Section>

    {/* ── SKILLS ── */}
    <Section id="skills">
      <SecLabel>
        <span className="inline-block pb-1 border-b-2 border-[#1DA1F2]/40">
          <strong className="text-text font-bold"><span className="text-xl opacity-80 select-none">🛠️</span>Top Skills</strong>
        </span>
      </SecLabel>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {[
          { 
            title: 'Cloud (AWS)',   
            items: ['EC2, S3 & VPC', 'IAM & Security', 'Lambda & API Gateway', 'CloudFormation (IaC)', 'SageMaker & Bedrock'] 
          },
          { 
            title: 'Backend',    
            items: ['Node.js & Express', 'REST APIs', 'PostgreSQL & Prisma', 'Redis & BullMQ', 'MongoDB & MySQL'] 
          },
          { 
            title: 'Frontend',   
            items: ['React & Vite', 'JavaScript (ES6+)', 'Tailwind CSS', 'React Router', 'HTML5 & CSS3'] 
          },
          { 
            title: 'DevOps & Tools', 
            items: ['Git & GitHub', 'Bash Shell Scripting', 'Linux (Amazon Linux)', 'Docker / Vercel', 'Postman'] 
          },
        ].map(col => (
          <div key={col.title}>
            <p className="text-2xs font-medium text-text3 tracking-widest uppercase mb-4">
              <strong className="text-text font-medium">
                <em className="text-amber not-italic"></em>
                {col.title}
              </strong>
            </p>           
           <ul className="flex flex-col gap-2">
            {col.items.map(item => (
              <li key={item} className="text-sm font-light text-text2 flex items-center gap-2">
                {/* Bullet upgraded to high-contrast bright white */}
                <span className="w-[3px] h-[3px] rounded-full bg-white flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          </div>
        ))}
      </div>
    </Section>

    {/* ── PROJECTS ── */}
    <Section id="projects" className="relative z-10">
      <SecLabel>
        <span className="inline-block pb-1 border-b-2 border-[#1DA1F2]/40">
          <strong className="text-text font-bold"><span className="text-xl opacity-80 select-none">⚡</span>Selected Work</strong>
        </span>
      </SecLabel>
      <div className="flex flex-col mt-4">
        {[
          {
            num: '01', 
            name: 'Portfolio Ecosystem',
            desc: 'Full-stack portfolio featuring a custom CMS, JWT authentication, background processing with BullMQ email queues, Redis caching layers, and serverless Neon PostgreSQL storage.',
            tags: ['Express', 'Prisma', 'PostgreSQL', 'BullMQ', 'Redis'],
            live: '#', 
            code: 'https://github.com',
          },
          {
            num: '02', 
            name: 'AWS Multi-Tier Cloud Café Infrastructure',
            desc: 'Architected and deployed a multi-tier web application simulating an enterprise on-premises to cloud migration. Provisions isolated EC2 computing layers backed by persistent relational storage on Amazon RDS (Aurora/MySQL), and offloads static assets to secure S3 buckets governed by lifecycle policies.',
            tags: ['AWS RDS', 'Amazon EC2', 'Amazon S3', 'IAM Security', 'AWS DMS'],
            live: null, 
            code: 'https://github.com',
          },
          {
            num: '03', 
            name: 'Scalable High-Availability Cloud Architecture',
            desc: 'Designed a fully fault-tolerant, scalable cloud network using Amazon EC2 Auto Scaling and Elastic Load Balancing (ELB) to automatically distribute volatile web traffic. Authored modular Infrastructure as Code (IaC) YAML/JSON CloudFormation templates for repeatable deployments alongside Amazon Route 53 failovers.',
            tags: ['AWS CloudFormation', 'Auto Scaling', 'ELB', 'Route 53', 'IaC (YAML)'],
            live: null, 
            code: 'https://github.com',
          },
          {
            num: '04', 
            name: 'Event-Driven Serverless Pipeline',
            desc: 'Built an event-driven serverless system using AWS Lambda exposed as scalable RESTful endpoints via Amazon API Gateway, eliminating manual server overhead. Integrated secure downstream service authorization with granular IAM execution roles and utilized Amazon CloudWatch for live invocation logging and debugging.',
            tags: ['AWS Lambda', 'API Gateway', 'IAM Roles', 'CloudWatch', 'Serverless'],
            live: null, 
            code: 'https://github.com',
          },
        ].map((p, i, arr) => (
          <div 
            key={p.num} 
            className={`group relative flex justify-between items-start p-6 -mx-6 transition-all duration-300 ease-out border-b border-border hover:bg-zinc-900/15 ${
              i === 0 ? 'border-t' : ''
            }`}
          >
            {/* Core Content Area */}
            <div className="flex-1">
              {/* Light-up Accent Item Number */}
              <p className="text-2xs text-text3 group-hover:text-emerald-400 transition-colors duration-200 font-mono mb-1.5 tracking-wider">
                {p.num}
              </p>
              
              {/* Interactive High-Contrast Title & Arrow Shift */}
              <p className="text-base font-medium text-text group-hover:text-white transition-colors duration-200 mb-1 flex items-center gap-1.5">
                <span>{p.name}</span>
                <span className="inline-block opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-emerald-400 text-xs">
                  →
                </span>
              </p>
              
              <p className="text-sm font-light text-text2 leading-relaxed mb-4 max-w-2xl">
                {p.desc}
              </p>
              
              {/* Dynamic Technology Tag Shells */}
              <div className="flex flex-wrap gap-1.5">
                {p.tags.map(t => (
                  <span 
                    key={t} 
                    className="text-2xs text-text3 px-2.5 py-0.5 rounded-md border border-border2 bg-zinc-900/30 group-hover:border-emerald-500/10 group-hover:text-zinc-300 transition-colors duration-300 select-none"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Actions Link Block */}
            <div className="flex flex-col gap-2.5 items-end flex-shrink-0 pt-7">
              {p.live && (
                <a 
                  href={p.live} 
                  className="text-xs text-text3 flex items-center gap-1 hover:text-white transition-colors"
                >
                  <ArrowSvg /> <span className="underline decoration-transparent hover:decoration-text3 transition-all">Live</span>
                </a>
              )}
              <a 
                href={p.code} 
                className="text-xs text-text3 flex items-center gap-1 hover:text-white transition-colors"
              >
                <ArrowSvg /> <span className="underline decoration-transparent hover:decoration-text3 transition-all">Code</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </Section>

      {/* ── BLOG PREVIEW ── */}
      {posts.length > 0 && (
        <Section id="writing">
          <SecLabel>
            <span className="inline-block pb-1 border-b-2 border-[#1DA1F2]/40">
              <strong className="text-text font-bold"><span className="text-xl opacity-80 select-none">✍️</span>Writing</strong>
            </span>
          </SecLabel>
          <div className="flex flex-col">
            {posts.map((post, i) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className={`flex justify-between items-start py-5 border-b border-border hover:opacity-75 transition-opacity ${i === 0 ? 'border-t' : ''}`}
              >
                <div>
                  <p className="text-base font-medium text-text mb-1">{post.title}</p>
                  <p className="text-sm font-light text-text2">{post.excerpt}</p>
                </div>
                <span className="text-xs text-text3 flex-shrink-0 pt-1 ml-6">
                  {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-6">
            <Link to="/blog" className="text-sm text-text2 hover:text-text transition-colors">
              All posts →
            </Link>
          </div>
        </Section>
      )}

      {/* ── CONTACT ── */}
      <ContactSection />

      {/* ── FOOTER ── */}
      <footer className="py-7 flex justify-between items-center border-t border-border flex-wrap gap-3">
        <span className="text-xs text-text3">© 2026 Rahul Biswas</span>
        <a href="#hero" className="text-xs text-text3 hover:text-text2 transition-colors">Back to top ↑</a>
      </footer>

    </div>
  )
}

// ── Contact section ───────────────────────────────────────────
import { sendContact } from '../lib/api'

function ContactSection() {
  const ref = useReveal()
  const [form, setForm]     = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState(null) // 'sending' | 'ok' | 'error'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      await sendContact(form)
      setStatus('ok')
      setForm({ name: '', email: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <section ref={ref} id="contact" className="reveal py-20 border-t border-border">
      <SecLabel>
            <span className="inline-block pb-1 border-b-2 border-[#1DA1F2]/40">
              <strong className="text-text font-bold"><span className="text-xl opacity-80 select-none">📬</span>Contact</strong>
            </span>
      </SecLabel>
      <h2 className="text-2xl font-light text-text tracking-tight leading-tight mb-2">
        Let's work <strong className="font-medium">together.</strong>
      </h2>
      <p className="text-sm font-light text-text2 mb-8">
        Have a project in mind or just want to say hi? My inbox is always open.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-9">
        <div className="grid grid-cols-2 gap-3">
          <input
            className="w-full bg-bg2 border border-border rounded-lg px-3.5 py-2.5 text-sm font-light text-text placeholder-text3 outline-none focus:border-border2 transition-colors"
            type="text" placeholder="Your name"
            value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            required
          />
          <input
            className="w-full bg-bg2 border border-border rounded-lg px-3.5 py-2.5 text-sm font-light text-text placeholder-text3 outline-none focus:border-border2 transition-colors"
            type="email" placeholder="your@email.com"
            value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
            required
          />
        </div>
        <textarea
          className="w-full bg-bg2 border border-border rounded-lg px-3.5 py-2.5 text-sm font-light text-text placeholder-text3 outline-none focus:border-border2 transition-colors resize-none h-24"
          placeholder="Tell me about your project..."
          value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
          required
        />
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={status === 'sending'}
            className="inline-flex items-center px-5 py-2 rounded-full bg-text text-bg border border-text text-sm hover:bg-[#d0d0d0] transition-colors disabled:opacity-50"
          >
            {status === 'sending' ? 'Sending…' : 'Send message'}
          </button>
          {status === 'ok' && <span className="text-sm text-green">Message sent. We will get back to you soon! ✓</span>}
          {status === 'error' && <span className="text-sm text-red-400">Something went wrong</span>}
        </div>
      </form>

      <div className="flex justify-between items-center pt-7 border-t border-border flex-wrap gap-4">
        <div className="flex gap-6">
          {[
            { label: 'GitHub',   href: 'https://github.com/RahulBiswas224' },
            { label: 'LinkedIn', href: 'https://linkedin.com/in/rahulbiswas224/' },
            { label: 'Email',    href: 'mailto:rahulbiswas006677@gmail.com' },
            { label: 'Twitter',  href: 'https://x.com/BiswasScript' },
          ].map(s => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
               className="text-sm text-text3 hover:text-text transition-colors">
              <span className="inline-block pb-0 border-b border-zinc-800">
                <strong className="text-text font-bold"> {s.label}</strong>
              </span>
            </a>
          ))}
        </div>
        <a 
          href={resume} 
          download="Rahul_Biswas_Resume.pdf" className="inline-flex items-center px-4 py-1.5 rounded-full border border-border2 text-xs text-text hover:border-[#444] hover:bg-white/5 transition-all">
          Download Resume
        </a>
      </div>
    </section>
  )
}
