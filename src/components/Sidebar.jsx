import { NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function Sidebar({ mobileOpen, onMobileClose }) {
  const { user, profile, signOut } = useAuth()

  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`.toUpperCase()
    }
    return user?.email?.charAt(0).toUpperCase() || 'A'
  }

  const getName = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`
    }
    return user?.email?.split('@')[0] || 'Admin'
  }

  const handleNavClick = () => {
    if (window.innerWidth <= 1024) {
      onMobileClose()
    }
  }

  return (
    <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header">
        <a href="https://mathisfollin.fr" className="sidebar-logo">
          <img src="https://mathisfollin.fr/assets/logos/fah-white.png" alt="FAH Marie-Curie" />
        </a>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <div className="nav-section-title">Gestion</div>
          
          <NavLink to="/" end className="nav-item" onClick={handleNavClick}>
            <lottie-player
              src="/assets/logos/home.json"
              style={{width:'21px', height:'21px'}}
              loop="false"
              autoplay="false">
            </lottie-player>
            <span>Vue d'ensemble</span>
          </NavLink>
          
          <NavLink to="/articles" className="nav-item" onClick={handleNavClick}>
            <lottie-player
              src="/assets/logos/edit.json"
              style={{width:'23px', height:'23px'}}
              loop="false"
              autoplay="false">
            </lottie-player>
            <span>Articles</span>
          </NavLink>
          
          <NavLink to="/quiz" className="nav-item" onClick={handleNavClick}>
            <lottie-player
              src="/assets/logos/help.json"
              style={{width:'24px', height:'24px'}}
              loop="false"
              autoplay="false">
            </lottie-player>
            <span>Quiz</span>
          </NavLink>
          
          <NavLink to="/documents" className="nav-item" onClick={handleNavClick}>
            <lottie-player
              src="/assets/logos/folder.json"
              style={{width:'22px', height:'22px'}}
              loop="false"
              autoplay="false">
            </lottie-player>
            <span>Documents</span>
          </NavLink>
          
          <NavLink to="/events" className="nav-item" onClick={handleNavClick}>
            <lottie-player
              src="/assets/logos/calendar.json"
              style={{width:'22px', height:'22px'}}
              loop="false"
              autoplay="false">
            </lottie-player>
            <span>Événements</span>
          </NavLink>
        </div>
        
        <div className="nav-section">
          <div className="nav-section-title">Communication</div>
          
          <NavLink to="/emails" className="nav-item" onClick={handleNavClick}>
            <lottie-player
              src="/assets/logos/mail.json"
              style={{width:'22px', height:'22px'}}
              loop="false"
              autoplay="false">
            </lottie-player>
            <span>Emails</span>
          </NavLink>


          <NavLink to="/members" className="nav-item" onClick={handleNavClick}>
            <lottie-player
              src="/assets/logos/userPlus.json"
              style={{width:'22px', height:'22px'}}
              loop="false"
              autoplay="false">
            </lottie-player>
            <span>Membres</span>
          </NavLink>
          
          <NavLink to="/invites" className="nav-item" onClick={handleNavClick}>
            <lottie-player
              src="/assets/logos/userPlus.json"
              style={{width:'22px', height:'22px'}}
              loop="false"
              autoplay="false">
            </lottie-player>
            <span>Inviter des membres</span>
          </NavLink>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">{getInitials()}</div>
          <div className="user-details">
            <div className="user-name">{getName()}</div>
            <div className="user-role">Administrateur</div>
          </div>
        </div>
        <button className="btn-logout" onClick={signOut}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Se déconnecter
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
