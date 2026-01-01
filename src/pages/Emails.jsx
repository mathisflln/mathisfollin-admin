import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import RichEditor from '../components/ui/RichEditor'

const SUPABASE_URL = "https://ckfdysasgawyixbxjyfz.supabase.co"

function Emails() {
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const [usersCount, setUsersCount] = useState('—')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadUsersCount()
  }, [])

  const loadUsersCount = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch(`${SUPABASE_URL}/functions/v1/get_users_count`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUsersCount(data.count || '0')
      }
    } catch (err) {
      console.error('Error loading users count:', err)
      setUsersCount('?')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!content.trim()) {
      alert('Le contenu de l\'email ne peut pas être vide')
      return
    }

    setLoading(true)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        alert('Session expirée, veuillez vous reconnecter')
        window.location.href = '/login'
        return
      }

      const response = await fetch(`${SUPABASE_URL}/functions/v1/send_email_to_all`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          subject,
          htmlContent: content
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de l\'envoi')
      }

      alert(`✅ ${result.message}\n\n✓ Envoyés: ${result.success}\n${result.failed > 0 ? `✗ Échecs: ${result.failed}` : ''}`)
      
      setSubject('')
      setContent('')
    } catch (err) {
      console.error('Error sending email:', err)
      alert('❌ Erreur lors de l\'envoi des emails: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Envoyer un email</h1>
      </div>

      <div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Objet de l'email *</label>
            <input
              type="text"
              className="form-input"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              placeholder="Ex: Information importante"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Contenu de l'email *</label>
            <RichEditor
              value={content}
              onChange={setContent}
              placeholder="Commencez à écrire votre email..."
            />
            <p style={{ fontSize: '0.85rem', color: '#999', marginTop: '8px' }}>
              💡 Astuce : Le contenu sera automatiquement mis en page avec le design FAH Marie-Curie
            </p>
          </div>

          <div className="modal-actions">
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={loading}
            >
              {loading ? 'Envoi en cours...' : 'Envoyer à tous les membres'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default Emails