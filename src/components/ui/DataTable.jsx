import { useState, useMemo, useEffect } from 'react'

function DataTable({ columns, data, onEdit, onDelete, emptyIcon, emptyMessage }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState([])
  const [openMenuId, setOpenMenuId] = useState(null)
  const itemsPerPage = 10

  // Filtrage par recherche
  const filteredData = useMemo(() => {
    if (!data) return []
    if (!searchQuery.trim()) return data

    return data.filter(row => {
      return columns.some(col => {
        const value = row[col.key]
        if (!value) return false
        return String(value).toLowerCase().includes(searchQuery.toLowerCase())
      })
    })
  }, [data, searchQuery, columns])

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

  // Fermer le menu si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.action-menu')) {
        setOpenMenuId(null)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  // Sélection
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(paginatedData.map(row => row.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectOne = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    )
  }

  const handleBulkDelete = async () => {
    if (!window.confirm(`Supprimer ${selectedIds.length} élément(s) ?`)) return
    
    for (const id of selectedIds) {
      const row = data.find(r => r.id === id)
      await onDelete(id, row)
    }
    setSelectedIds([])
  }

  const clearSelection = () => setSelectedIds([])

  if (!data || data.length === 0) {
    return (
      <div className="empty-state">
        {emptyIcon}
        <div>{emptyMessage || 'Aucune donnée'}</div>
      </div>
    )
  }

  return (
    <>
      {/* Barre de recherche */}
      <div className="table-search">
        <input
          type="text"
          placeholder="Rechercher..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setCurrentPage(1)
          }}
        />
      </div>

      {/* Table container avec scroll */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th className="col-checkbox">
                <input
                  type="checkbox"
                  className="table-checkbox"
                  checked={paginatedData.length > 0 && selectedIds.length === paginatedData.length}
                  onChange={handleSelectAll}
                />
              </th>
              {columns.map(col => (
                <th 
                  key={col.key} 
                  style={{ minWidth: col.minWidth || 'auto' }}
                >
                  {col.label}
                </th>
              ))}
              <th className="col-actions"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map(row => (
              <tr key={row.id}>
                <td className="col-checkbox">
                  <input
                    type="checkbox"
                    className="table-checkbox"
                    checked={selectedIds.includes(row.id)}
                    onChange={() => handleSelectOne(row.id)}
                  />
                </td>
                {columns.map(col => (
                  <td key={col.key} data-label={col.label}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
                <td className="col-actions">
                  <div className="action-menu">
                    <button 
                      className="action-menu-trigger"
                      onClick={() => setOpenMenuId(openMenuId === row.id ? null : row.id)}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="12" r="2"></circle>
                        <circle cx="12" cy="5" r="2"></circle>
                        <circle cx="12" cy="19" r="2"></circle>
                      </svg>
                    </button>
                    
                    {openMenuId === row.id && (
                      <div className="action-menu-dropdown">
                        {onEdit && (
                          <button 
                            className="action-menu-item"
                            onClick={() => {
                              onEdit(row.id)
                              setOpenMenuId(null)
                            }}
                          >
                            Modifier
                          </button>
                        )}
                        {onDelete && (
                          <button 
                            className="action-menu-item danger"
                            onClick={() => {
                              onDelete(row.id, row)
                              setOpenMenuId(null)
                            }}
                          >
                            Supprimer
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="table-footer">
        <div>{filteredData.length} élément(s)</div>
        
        {totalPages > 1 && (
          <div className="table-pagination">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              ←
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={currentPage === page ? 'active' : ''}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              →
            </button>
          </div>
        )}
      </div>

      {/* Barre de sélection */}
      {selectedIds.length > 0 && (
        <div className="selection-bar">
          <span className="selection-bar-text">
            {selectedIds.length} sélectionné(s)
          </span>
          
          <button 
            className="selection-bar-btn"
            onClick={clearSelection}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <div className="selection-bar-divider"></div>

          {onDelete && (
            <button 
              className="selection-bar-btn danger"
              onClick={handleBulkDelete}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              Supprimer
            </button>
          )}
        </div>
      )}

      {/* Overlay pour bloquer les interactions quand le menu est ouvert */}
      {openMenuId !== null && (
        <div 
          className="action-menu-overlay"
          onClick={() => setOpenMenuId(null)}
        />
      )}
    </>
  )
}

export default DataTable