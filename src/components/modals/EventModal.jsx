import { useState, useEffect } from 'react'

function EventModal({ isOpen, onClose, eventId, onSave, getById }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [location, setLocation] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && eventId) {
      loadEvent()
    } else if (isOpen && !eventId) {
      resetForm()
    }
  }, [isOpen, eventId])

  const loadEvent = async () => {
    setLoading(true)
    const event = await getById(eventId)
    if (event) {
      setTitle(event.title)
      setDescription(event.description || '')
      setEventDate(new Date(event.event_date).toISOString().slice(0, 16))
      setLocation(event.location || '')
    }
    setLoading(false)
  }

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setEventDate('')
    setLocation('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      title,
      description: description || null,
      event_date: eventDate,
      location: location || null
    })
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="modal active">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">
            {eventId ? "Modifier l'événement" : "Nouvel événement"}
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Date et heure *</label>
              <input
                type="datetime-local"
                className="form-input"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Lieu</label>
              <input
                type="text"
                className="form-input"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
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

export default EventModal
