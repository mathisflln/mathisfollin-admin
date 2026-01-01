import { useState } from 'react'
import { useArticles } from '../hooks/useArticles'
import { useAuth } from '../hooks/useAuth'
import DataTable from '../components/ui/DataTable'
import ArticleModal from '../components/modals/ArticleModal'
import { formatDate } from '../utils/helpers'

function Articles() {
  const { user } = useAuth()
  const { articles, loading, create, update, remove, getById, reload } = useArticles()
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

  const handleSave = async (articleData) => {
    try {
      if (editingId) {
        await update(editingId, articleData)
      } else {
        await create(articleData, user.id)
      }
      setModalOpen(false)
      reload()
    } catch (error) {
      console.error('Error saving article:', error)
      alert('Erreur lors de la sauvegarde : ' + error.message)
    }
  }

  const columns = [
    { key: 'title', label: 'Titre' },
    { key: 'slug', label: 'Slug' },
    { 
      key: 'published', 
      label: 'Statut',
      render: (row) => (
        <span className={`status-badge ${row.published ? 'status-published' : 'status-draft'}`}>
          {row.published ? 'Publié' : 'Brouillon'}
        </span>
      )
    },
    { 
      key: 'created_at', 
      label: 'Date',
      render: (row) => formatDate(row.created_at)
    }
  ]

  const emptyIcon = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 20h9"></path>
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
    </svg>
  )

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Articles</h1>
        <button className="btn-create" onClick={handleCreate}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Nouvel article
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          Chargement...
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={articles}
          onEdit={handleEdit}
          onDelete={remove}
          emptyIcon={emptyIcon}
          emptyMessage="Aucun article pour le moment"
        />
      )}

      <ArticleModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        articleId={editingId}
        onSave={handleSave}
        getById={getById}
      />
    </>
  )
}

export default Articles