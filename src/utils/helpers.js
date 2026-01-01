// Échapper le HTML
export function escapeHtml(unsafe) {
  if (!unsafe && unsafe !== 0) return ''
  return String(unsafe).replace(/[&<>"'`=\/]/g, s => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '`': '&#x60;',
    '/': '&#x2F;',
    '=': '&#x3D;'
  })[s])
}

// Formater une date
export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('fr-FR')
}

// Formater une date et heure
export function formatDateTime(dateString) {
  return new Date(dateString).toLocaleString('fr-FR')
}

// Générer un slug à partir d'un titre
export function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// Tronquer un texte
export function truncate(text, length = 50) {
  if (!text) return ''
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}
