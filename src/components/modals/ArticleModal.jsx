import { useState, useEffect } from 'react'
import RichEditor from '../ui/RichEditor'

function ArticleModal({ isOpen, onClose, articleId, onSave, getById }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [published, setPublished] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && articleId) {
      loadArticle()
    } else if (isOpen && !articleId) {
      resetForm()
    }
  }, [isOpen, articleId])

  const loadArticle = async () => {
    setLoading(true)
    const article = await getById(articleId)
    if (article) {
      setTitle(article.title)
      setContent(article.content)
      setCoverImage(article.cover_image || '')
      setPublished(article.published)
    }
    setLoading(false)
  }

  const resetForm = () => {
    setTitle('')
    setContent('')
    setCoverImage('')
    setPublished(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      title,
      content,
      cover_image: coverImage || null,
      published
    })
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="modal active">
      <div className="modal-content wide">
        <div className="modal-header">
          <h2 className="modal-title">
            {articleId ? "Modifier l'article" : "Nouvel article"}
          </h2>
          <button className="btn-close-modal" onClick={handleClose}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Chargement...</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Titre *</label>
              <input
                type="text"
                className="form-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contenu *</label>
              <RichEditor
                value={content}
                onChange={setContent}
                placeholder="Commencez à écrire votre article..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Image de couverture (URL)</label>
              <input
                type="text"
                className="form-input"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Statut</label>
              <select
                className="form-select"
                value={published}
                onChange={(e) => setPublished(e.target.value === 'true')}
              >
                <option value="false">Brouillon</option>
                <option value="true">Publié</option>
              </select>
            </div>

            <div className="modal-actions">
              <button type="submit" className="btn-modal btn-primary">
                Enregistrer
              </button>
              <button type="button" className="btn-modal btn-secondary" onClick={handleClose}>
                Annuler
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default ArticleModal
