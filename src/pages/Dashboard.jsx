import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import Overview from './Overview'
import Articles from './Articles'
import Quiz from './Quiz'
import Documents from './Documents'
import Events from './Events'
import Emails from './Emails'
import Invites from './Invites'

function Dashboard() {
  const [mobileOpen, setMobileOpen] = useState(false)

  const closeMobile = () => setMobileOpen(false)

  // Lottie animations for nav items
  useEffect(() => {
    const navItems = document.querySelectorAll('.nav-item')
    
    navItems.forEach(navItem => {
      const lottie = navItem.querySelector('lottie-player')
      if (!lottie) return

      lottie.autoplay = false
      lottie.loop = false

      navItem.addEventListener('mouseenter', () => {
        lottie.setDirection(1)
        lottie.play()
      })

      navItem.addEventListener('mouseleave', () => {
        lottie.setDirection(-1)
        lottie.play()
      })
    })
  }, [])

  return (
    <>
      {/* Mobile menu button */}
      <button 
        className="mobile-menu-btn" 
        onClick={() => setMobileOpen(true)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>

      {/* Mobile overlay */}
      <div 
        className={`mobile-overlay ${mobileOpen ? 'active' : ''}`}
        onClick={closeMobile}
      />

      {/* Sidebar */}
      <Sidebar mobileOpen={mobileOpen} onMobileClose={closeMobile} />

      {/* Main content */}
      <main className="main-content">
        <TopBar />
        
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/events" element={<Events />} />
          <Route path="/emails" element={<Emails />} />
          <Route path="/invites" element={<Invites />} />
        </Routes>
      </main>
    </>
  )
}

export default Dashboard
