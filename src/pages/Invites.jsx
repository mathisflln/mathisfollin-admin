import { useState } from 'react'
import { supabase } from '../lib/supabase'

const SUPABASE_URL = "https://ckfdysasgawyixbxjyfz.supabase.co"

function Invites() {
  const [emails, setEmails] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const emailList = emails
      .split('\n')
      .map(e => e.trim())
      .filter(e => e && e.includes('@'))

    if (emailList.length === 0) {
      alert('Veuillez entrer au moins une adresse email valide')
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

      const response = await fetch(`${SUPABASE_URL}/functions/v1/send_invitations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ emails: emailList })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de l\'envoi')
      }

      let message = `✅ Invitations envoyées!\n\n`
      message += `✓ Réussies: ${result.success}\n`
      if (result.failed > 0) {
        message += `✗ Échecs: ${result.failed}\n\n`
        message += `Erreurs:\n${result.errors.slice(0, 5).join('\n')}`
      }

      alert(message)

      if (result.success > 0) {
        setEmails('')
      }
    } catch (err) {
      console.error('Error sending invitations:', err)
      alert('❌ Erreur: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Inviter des membres</h1>
      </div>

      <div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Adresses email *</label>
            <textarea
              className="form-textarea"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              placeholder="email1@exemple.com&#10;email2@exemple.com&#10;email3@exemple.com"
              style={{ minHeight: '200px' }}
              required
            />
            <p style={{ fontSize: '0.85rem', color: '#999', marginTop: '8px' }}>
              💡 Entrez une adresse email par ligne
            </p>
          </div>

          <div className="modal-actions">
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={loading}
            >
              {loading ? 'Envoi en cours...' : 'Envoyer les invitations'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default Invites