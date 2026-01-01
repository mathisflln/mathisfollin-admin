function TopBar({ onToggleMobile }) {
  return (
    <div className="top-bar">
      <button className="mobile-menu-btn" onClick={onToggleMobile}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <a href="#" className="top-bar-feedback" id="feedback-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <span>Feedback</span>
        </a>
        <a href="#" className="top-bar-link" id="help-link">Aide</a>
        <a href="#" className="top-bar-link" id="docs-link">Docs</a>
      </div>
    </div>
  )
}

export default TopBar