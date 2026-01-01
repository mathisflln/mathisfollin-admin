import { useState } from 'react'
import { useDocuments } from '../hooks/useDocuments'
import DataTable from '../components/ui/DataTable'
import DocumentModal from '../components/modals/DocumentModal'
import { formatDate, truncate } from '../utils/helpers'

function Documents() {
  const { documents, loading, create, remove, reload } = useDocuments()
  const [modalOpen, setModalOpen] = useState(false)

  const handleCreate = () => {
    setModalOpen(true)
  }

  const handleSave = async (title, description, file) => {
    try {
      await create(title, description, file)
      setModalOpen(false)
      reload()
    } catch (error) {
      console.error('Error saving document:', error)
      alert('Erreur lors de la sauvegarde : ' + error.message)
    }
  }

  const handleDelete = async (id, row) => {
    try {
      await remove(id, row.filename)
      reload()
    } catch (error) {
      console.error('Error deleting document:', error)
      alert('Erreur lors de la suppression : ' + error.message)
    }
  }

  const columns = [
    { key: 'title', label: 'Titre' },
    { key: 'filename', label: 'Fichier' },
    { 
      key: 'description', 
      label: 'Description',
      render: (row) => truncate(row.description || '', 50)
    },
    { 
      key: 'created_at', 
      label: 'Date',
      render: (row) => formatDate(row.created_at)
    }
  ]

  const emptyIcon = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
    </svg>
  )

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Documents</h1>
        <button className="btn-create" onClick={handleCreate}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Nouveau document
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          Chargement...
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={documents}
          onEdit={null}
          onDelete={handleDelete}
          emptyIcon={emptyIcon}
          emptyMessage="Aucun document pour le moment"
        />
      )}

      <DocumentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </>
  )
}

export default Documents