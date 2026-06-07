// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './lib/auth'
import Snowfall from 'react-snowfall' 

import Nav      from './components/layout/Nav'
import Home     from './pages/Home'
import About    from './pages/About'
import Projects from './pages/Projects'
import Blog     from './pages/Blog'
import Post     from './pages/Post'
import Author   from './pages/Author'
import Login    from './pages/Login'
import Admin    from './pages/Admin'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Global background setup for full-screen coverage */}
        <div style={{ position: 'relative', minHeight: '100vh', background: '#0a0a0c' }}>
          
          <Snowfall 
            style={{
              position: 'fixed',
              width: '100vw',
              height: '100vh',
              zIndex: 1 ,
              pointerEvents: 'none'
            }} 
            // Snowflake count
            snowflakeCount={40} 
            // Change the range of snowflake sizes in pixels [min, max]
            radius={[0.5, 3.0]}
            // Control the speed of the fall [min, max]
            speed={[1.0, 3.0]}
            // Control the side-to-side wind drift [min, max]
            wind={[-0.5, 0.5]}
          />

          <div style={{ position: 'relative', zIndex: 10 }}>
            <Nav />
          </div>

          <main style={{ position: 'relative', zIndex: 5 }}>
            <Routes>
              <Route path="/"            element={<Home />} />
              <Route path="/about"       element={<About />} />
              <Route path="/projects"    element={<Projects />} />
              <Route path="/blog"        element={<Blog />} />
              <Route path="/blog/:slug"  element={<Post />} />
              <Route path="/authors/:id" element={<Author />} />
              <Route path="/login"       element={<Login />} />
              <Route path="/admin"       element={<Admin />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}