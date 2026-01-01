import { useState, useRef } from 'react'

function DocumentModal({ isOpen, onClose, onSave }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setFile(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!file) {
      alert('Veuillez sélectionner un fichier')
      return
    }
    onSave(title, description, file)
    resetForm()
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleChange = (e) => {
    if (e.target.files.length > 0) setFile(e.target.files[0])
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0])
      e.dataTransfer.clearData()
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragging(true)
  }

  const handleDragLeave = () => {
    setDragging(false)
  }

  if (!isOpen) return null

  return (
    <div className="modal active">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Nouveau document</h2>
          <button className="btn-close-modal" onClick={handleClose}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

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
            <div
              className={`file-upload ${dragging ? 'dragging' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => inputRef.current.click()}
            >
              <img src="/assets/logos/upload.png" alt="Upload" />
              <span className="file-upload-text">
                {file ? file.name : 'Sélectionner un fichier ou glisser-déposer ici'}
              </span>
              <input
                type="file"
                ref={inputRef}
                onChange={handleChange}
                required
                style={{ display: 'none' }}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="submit" className="btn-modal btn-primary">
              Uploader
            </button>
            <button type="button" className="btn-modal btn-secondary" onClick={handleClose}>
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DocumentModal
