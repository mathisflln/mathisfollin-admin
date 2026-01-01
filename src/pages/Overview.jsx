import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

function Overview() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const [stats, setStats] = useState({
    articles: '—',
    quizzes: '—',
    docs: '—',
    events: '—'
  })

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    const { count: articlesCount } = await supabase
      .from('articles')
      .select('id', { count: 'exact', head: true })

    const { count: quizzesCount } = await supabase
      .from('quizzes')
      .select('id', { count: 'exact', head: true })

    const { count: docsCount } = await supabase
      .from('documents_meta')
      .select('id', { count: 'exact', head: true })

    const { count: eventsCount } = await supabase
      .from('events')
      .select('id', { count: 'exact', head: true })

    setStats({
      articles: articlesCount ?? '0',
      quizzes: quizzesCount ?? '0',
      docs: docsCount ?? '0',
      events: eventsCount ?? '0'
    })
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">
          Bienvenue {profile?.first_name || 'Admin'} 👋
        </h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
          </div>
          <div className="stat-value">{stats.articles}</div>
          <div className="stat-label">Articles</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
          <div className="stat-value">{stats.quizzes}</div>
          <div className="stat-label">Quiz</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
          </div>
          <div className="stat-value">{stats.docs}</div>
          <div className="stat-label">Documents</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <div className="stat-value">{stats.events}</div>
          <div className="stat-label">Événements</div>
        </div>
      </div>

      <div className="content-section">
        <div className="section-header">
          <h2 className="section-title">Accès rapide</h2>
        </div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px'}}>
          <div className="stat-card" style={{cursor: 'pointer'}} onClick={() => navigate('/articles')}>
            <div style={{fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px'}}>📝 Nouvel article</div>
            <div style={{fontSize: '0.85rem', color: '#999'}}>Créer un article</div>
          </div>
          <div className="stat-card" style={{cursor: 'pointer'}} onClick={() => navigate('/quiz')}>
            <div style={{fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px'}}>🧪 Nouveau quiz</div>
            <div style={{fontSize: '0.85rem', color: '#999'}}>Créer un quiz</div>
          </div>
          <div className="stat-card" style={{cursor: 'pointer'}} onClick={() => navigate('/documents')}>
            <div style={{fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px'}}>📄 Nouveau document</div>
            <div style={{fontSize: '0.85rem', color: '#999'}}>Uploader un document</div>
          </div>
          <div className="stat-card" style={{cursor: 'pointer'}} onClick={() => navigate('/events')}>
            <div style={{fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px'}}>📅 Nouvel événement</div>
            <div style={{fontSize: '0.85rem', color: '#999'}}>Créer un événement</div>
          </div>
          <div className="stat-card" style={{cursor: 'pointer'}} onClick={() => navigate('/emails')}>
            <div style={{fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px'}}>📧 Envoyer un email</div>
            <div style={{fontSize: '0.85rem', color: '#999'}}>Email groupé aux membres</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Overview
