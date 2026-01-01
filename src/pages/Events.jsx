import { useState } from 'react'
import { useEvents } from '../hooks/useEvents'
import DataTable from '../components/ui/DataTable'
import EventModal from '../components/modals/EventModal'
import { formatDateTime, truncate } from '../utils/helpers'

function Events() {
  const { events, loading, create, update, remove, getById, reload } = useEvents()
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

  const handleSave = async (eventData) => {
    try {
      if (editingId) {
        await update(editingId, eventData)
      } else {
        await create(eventData)
      }
      setModalOpen(false)
      reload()
    } catch (error) {
      console.error('Error saving event:', error)
      alert('Erreur lors de la sauvegarde : ' + error.message)
    }
  }

  const columns = [
    { key: 'title', label: 'Titre' },
    { 
      key: 'event_date', 
      label: 'Date',
      render: (row) => formatDateTime(row.event_date)
    },
    { 
      key: 'location', 
      label: 'Lieu',
      render: (row) => row.location || '-'
    },
    { 
      key: 'description', 
      label: 'Description',
      render: (row) => truncate(row.description || '', 50)
    }
  ]

  const emptyIcon = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  )

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Événements</h1>
        <button className="btn-create" onClick={handleCreate}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Nouvel événement
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          Chargement...
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={events}
          onEdit={handleEdit}
          onDelete={remove}
          emptyIcon={emptyIcon}
          emptyMessage="Aucun événement pour le moment"
        />
      )}

      <EventModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        eventId={editingId}
        onSave={handleSave}
        getById={getById}
      />
    </>
  )
}

export default Events