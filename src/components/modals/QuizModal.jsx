import { useState, useEffect } from 'react'
import QuizBuilder from '../ui/QuizBuilder'

function QuizModal({ isOpen, onClose, quizId, onSave, getById }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && quizId) {
      loadQuiz()
    } else if (isOpen && !quizId) {
      resetForm()
    }
  }, [isOpen, quizId])

  const loadQuiz = async () => {
    setLoading(true)
    const quiz = await getById(quizId)
    if (quiz) {
      setTitle(quiz.title)
      setDescription(quiz.description || '')
      setQuestions(typeof quiz.questions === 'string' ? JSON.parse(quiz.questions) : quiz.questions)
    }
    setLoading(false)
  }

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setQuestions([])
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validation
    if (questions.length === 0) {
      alert('Veuillez ajouter au moins une question')
      return
    }

    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].question.trim()) {
        alert(`La question ${i + 1} est vide`)
        return
      }
      if (questions[i].options.some(a => !a.trim())) {
        alert(`Toutes les réponses de la question ${i + 1} doivent être remplies`)
        return
      }
    }

    onSave({
      title,
      description: description || null,
      questions
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
            {quizId ? "Modifier le quiz" : "Nouveau quiz"}
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
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                style={{ minHeight: '100px' }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Questions</label>
              <QuizBuilder questions={questions} onChange={setQuestions} />
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

export default QuizModal
