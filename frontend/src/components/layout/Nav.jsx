// src/components/layout/Nav.jsx
import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../lib/auth'

const links = [
  { label: 'Home',     href: '/' },
  { label: 'About',    href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Blog',     href: '/blog' },
  { label: 'Contact',  href: '/#contact' }, // Keeps hash for routing references
]

export default function Nav() {
  const { user }        = useAuth()
  const [open, setOpen] = useState(false)
  const { pathname }    = useLocation()
  const navigate        = useNavigate()

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Custom handler for page jumps and smooth section anchor targets
  const handleLinkClick = (label, e) => {
    setOpen(false) // Safely close mobile menu drawer

    if (label === 'Home') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } 
    
    else if (label === 'Contact') {
      e.preventDefault() // Stop default raw <a> jump behavior
      
      if (pathname === '/') {
        // If already on Home page, slide down smoothly
        const element = document.getElementById('contact')
        element?.scrollIntoView({ behavior: 'smooth' })
      } else {
        // If on another route, navigate home first, then find the element after a tiny layout paint timeout
        navigate('/')
        setTimeout(() => {
          const element = document.getElementById('contact')
          element?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      }
    }
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 flex justify-between items-center px-6 md:px-12 py-6 z-50 animate-fade-in">
        <Link 
          to="/" 
          onClick={(e) => handleLinkClick('Home', e)}
          className="text-sm text-text2 font-normal tracking-tight hover:text-text transition-colors"
        >
          <strong className="text-text font-bold">
            <span className="text-2xl opacity-80 select-none">☁️</span> Rahul`s Object
          </strong>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-7">
          {links.map(l => (
            l.label === 'Contact' ? (
              <a 
                key={l.label} 
                href={l.href} 
                onClick={(e) => handleLinkClick(l.label, e)} 
                className="text-sm text-text2 hover:text-text transition-colors"
              >
                {l.label}
              </a>
            ) : (
              <Link 
                key={l.label} 
                to={l.href} 
                onClick={(e) => handleLinkClick(l.label, e)}
                className="text-sm text-text2 hover:text-text transition-colors"
              >
                {l.label}
              </Link>
            )
          ))}
          {user
            ? <Link to="/admin" className="text-sm text-text2 hover:text-text transition-colors">Dashboard</Link>
            : <Link to="/login" className="text-sm text-text2 hover:text-text transition-colors">Login</Link>
          }
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden flex flex-col gap-1.5 p-1" onClick={() => setOpen(v => !v)} aria-label="Toggle menu">
          <span className={`block w-5 h-px bg-text2 transition-all duration-300 origin-center ${open ? 'rotate-45 translate-y-[7px]' : ''}`} />
          <span className={`block w-5 h-px bg-text2 transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-px bg-text2 transition-all duration-300 origin-center ${open ? '-rotate-45 -translate-y-[7px]' : ''}`} />
        </button>
      </nav>

      {/* Mobile overlay */}
      <div className={`fixed inset-0 z-40 bg-bg flex flex-col justify-center px-8 transition-all duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex flex-col gap-6">
          {links.map((l, i) => (
            l.label === 'Contact' ? (
              <a 
                key={l.label} 
                href={l.href} 
                onClick={(e) => handleLinkClick(l.label, e)}
                className="text-2xl font-light text-text2 hover:text-text transition-colors"
                style={{ transitionDelay: open ? `${i * 50}ms` : '0ms' }}
              >
                {l.label}
              </a>
            ) : (
              <Link 
                key={l.label} 
                to={l.href} 
                onClick={(e) => handleLinkClick(l.label, e)}
                className="text-2xl font-light text-text2 hover:text-text transition-colors"
                style={{ transitionDelay: open ? `${i * 50}ms` : '0ms' }}
              >
                {l.label}
              </Link>
            )
          ))}
          {user
            ? <Link to="/admin" onClick={() => setOpen(false)} className="text-2xl font-light text-text2 hover:text-text transition-colors">Dashboard</Link>
            : <Link to="/login" onClick={() => setOpen(false)} className="text-2xl font-light text-text2 hover:text-text transition-colors">Login</Link>
          }
        </div>
        <p className="absolute bottom-8 left-8 text-xs text-text3">© 2026 Rahul Biswas</p>
      </div>
    </>
  )
}