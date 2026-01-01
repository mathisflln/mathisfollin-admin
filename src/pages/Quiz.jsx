import { useState } from 'react'
import { useQuizzes } from '../hooks/useQuizzes'
import DataTable from '../components/ui/DataTable'
import QuizModal from '../components/modals/QuizModal'
import { formatDate, truncate } from '../utils/helpers'

function Quiz() {
  const { quizzes, loading, create, update, remove, getById, reload } = useQuizzes()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const handleCreate = () => {
    setEditingId(null)
    setModalOpen(true)
  }

  const handleEdit = async (id) => {
    setEditingId(id)
    setModalOpen(true)
  }

  const handleSave = async (quizData) => {
    try {
      if (editingId) {
        await update(editingId, quizData)
      } else {
        await create(quizData)
      }
      setModalOpen(false)
      reload()
    } catch (error) {
      console.error('Error saving quiz:', error)
      alert('Erreur lors de la sauvegarde : ' + error.message)
    }
  }

  const columns = [
    { key: 'title', label: 'Titre' },
    { 
      key: 'description', 
      label: 'Description',
      render: (row) => truncate(row.description || '', 50)
    },
    { 
      key: 'questions', 
      label: 'Questions',
      render: (row) => {
        try {
          const qs = typeof row.questions === 'string' ? JSON.parse(row.questions) : row.questions
          return Array.isArray(qs) ? qs.length : 0
        } catch {
          return 0
        }
      }
    },
    { 
      key: 'created_at', 
      label: 'Date',
      render: (row) => formatDate(row.created_at)
    }
  ]

  const emptyIcon = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
  )

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Quiz</h1>
        <button className="btn-create" onClick={handleCreate}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Nouveau quiz
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          Chargement...
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={quizzes}
          onEdit={handleEdit}
          onDelete={remove}
          emptyIcon={emptyIcon}
          emptyMessage="Aucun quiz pour le moment"
        />
      )}

      <QuizModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        quizId={editingId}
        onSave={handleSave}
        getById={getById}
      />
    </>
  )
}

export default Quiz