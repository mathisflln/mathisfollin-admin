import { useMembers } from '../hooks/useMembers'
import DataTable from '../components/ui/DataTable'
import { formatDate } from '../utils/helpers'

function Members() {
  const { members, loading, remove, reload } = useMembers()

  const handleDelete = async (id, row) => {
    try {
      await remove(id)
      reload()
    } catch (error) {
      console.error('Error deleting member:', error)
      alert('Erreur lors de la suppression : ' + error.message)
    }
  }

  const getFullName = (row) => {
    if (row.first_name && row.last_name) {
      return `${row.first_name} ${row.last_name}`
    }
    return '-'
  }

  const columns = [
    { 
      key: 'name', 
      label: 'Nom',
      render: (row) => getFullName(row)
    },
    { 
      key: 'first_name', 
      label: 'Prénom',
      render: (row) => row.first_name || '-'
    },
    { 
      key: 'last_name', 
      label: 'Nom de famille',
      render: (row) => row.last_name || '-'
    },
    { 
      key: 'role', 
      label: 'Rôle',
      render: (row) => (
        <span className={`status-badge ${row.role === 'admin' ? 'status-admin' : 'status-member'}`}>
          {row.role === 'admin' ? 'Administrateur' : 'Membre'}
        </span>
      )
    },
    { 
      key: 'created_at', 
      label: 'Inscrit le',
      render: (row) => formatDate(row.created_at)
    }
  ]

  const emptyIcon = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  )

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Membres</h1>
          <p className="page-subtitle">Gérez les utilisateurs de votre plateforme</p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          Chargement...
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={members}
          onEdit={null}
          onDelete={handleDelete}
          emptyIcon={emptyIcon}
          emptyMessage="Aucun membre pour le moment"
        />
      )}
    </>
  )
}

export default Members