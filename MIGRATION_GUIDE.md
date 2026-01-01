# FAH Marie-Curie Admin - Architecture React

## 📁 Structure du projet

```
fah-admin/
├── public/
│   └── assets/
│       ├── images/
│       └── logos/
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx
│   │   ├── TopBar.jsx
│   │   ├── PrivateRoute.jsx
│   │   ├── modals/
│   │   │   ├── ArticleModal.jsx
│   │   │   ├── QuizModal.jsx
│   │   │   ├── DocumentModal.jsx
│   │   │   └── EventModal.jsx
│   │   └── ui/
│   │       ├── DataTable.jsx
│   │       ├── EmptyState.jsx
│   │       └── RichEditor.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Overview.jsx
│   │   ├── Articles.jsx
│   │   ├── Quiz.jsx
│   │   ├── Documents.jsx
│   │   ├── Events.jsx
│   │   ├── Emails.jsx
│   │   └── Invites.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useArticles.js
│   │   ├── useQuizzes.js
│   │   ├── useDocuments.js
│   │   └── useEvents.js
│   ├── lib/
│   │   └── supabase.js
│   ├── utils/
│   │   └── helpers.js
│   ├── styles/
│   │   ├── common.css (ton CSS existant)
│   │   └── login.css (styles du login)
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── vercel.json
```

## 🚀 Installation

```bash
npm install
npm run dev
```

## 🎨 Design - EXACTEMENT IDENTIQUE

Le CSS reste **EXACTEMENT** le même que ton fichier `common.css`.
La seule différence : **React gère la logique** au lieu de vanilla JS.

## 📝 Changements principaux

### Avant (Vanilla JS)
- Manipulation DOM manuelle
- Router custom maison
- Gestion d'état avec variables globales
- Multiples fichiers JS imbriqués

### Après (React)
- Composants réutilisables
- React Router (navigation propre)
- Hooks pour l'état
- Code organisé et maintenable

## ✨ Avantages

1. **État global** - Plus besoin de `currentUserId`, `editingArticleId`, etc.
2. **Hooks personnalisés** - `useAuth()`, `useArticles()`, etc.
3. **Composants réutilisables** - Modales, tables, formulaires
4. **Hot reload** - Rechargement instantané pendant le dev
5. **Build optimisé** - Vite génère un build ultra rapide
6. **TypeScript ready** - Facile d'ajouter TypeScript plus tard

## 📦 Composants à créer

### 1. Articles.jsx (Page Articles)
```jsx
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import DataTable from '../components/ui/DataTable'
import ArticleModal from '../components/modals/ArticleModal'

function Articles() {
  const [articles, setArticles] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)

  // Load articles
  // Handle create/edit/delete
  // Render table + modal
}
```

### 2. DataTable.jsx (Composant Table)
```jsx
function DataTable({ columns, data, onEdit, onDelete }) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          {columns.map(col => <th key={col.key}>{col.label}</th>)}
        </tr>
      </thead>
      <tbody>
        {data.map(row => (
          <tr key={row.id}>
            {/* Render cells */}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

### 3. ArticleModal.jsx
```jsx
import { useState, useEffect } from 'react'
import RichEditor from '../ui/RichEditor'

function ArticleModal({ isOpen, onClose, articleId, onSave }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  
  // Handle form submission
  // Render modal avec même structure HTML
}
```

## 🔄 Migration étape par étape

### Étape 1: Setup
```bash
npm create vite@latest fah-admin -- --template react
cd fah-admin
npm install @supabase/supabase-js react-router-dom
```

### Étape 2: Copier les assets
```bash
cp -r assets/ public/
```

### Étape 3: Copier le CSS
```bash
cp css/common.css src/styles/
```

### Étape 4: Créer les composants
- Utilise mes fichiers comme base
- Adapte ton code JS existant en React

### Étape 5: Tester
```bash
npm run dev
```

### Étape 6: Build & Deploy
```bash
npm run build
# Deploy sur Vercel
```

## 🎯 Points importants

### Le CSS ne change PAS
Tout ton CSS reste identique. React utilise les mêmes classes CSS.

### La structure HTML reste similaire
```jsx
// Avant (HTML)
<div class="stat-card">...</div>

// Après (JSX)
<div className="stat-card">...</div>
```

### Gestion d'état simplifiée
```jsx
// Avant
let editingArticleId = null

// Après
const [editingId, setEditingId] = useState(null)
```

### Navigation
```jsx
// Avant
document.querySelectorAll('[data-view]').forEach(...)

// Après
<NavLink to="/articles">Articles</NavLink>
```

## 🔧 Hooks personnalisés

### useArticles.js
```javascript
export function useArticles() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    const { data } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false })
    setArticles(data)
    setLoading(false)
  }

  const create = async (article) => { /* ... */ }
  const update = async (id, article) => { /* ... */ }
  const remove = async (id) => { /* ... */ }

  useEffect(() => { load() }, [])

  return { articles, loading, create, update, remove, reload: load }
}
```

## 📋 Todo List

- [x] Structure de base
- [x] Auth & Login
- [x] Sidebar & TopBar
- [x] Overview page
- [ ] Articles page + modal
- [ ] Quiz page + modal + builder
- [ ] Documents page + modal
- [ ] Events page + modal
- [ ] Emails page
- [ ] Invites page
- [ ] Composants UI (Table, Editor, etc.)
- [ ] Tests
- [ ] Deploy

## 🎨 Design reste IDENTIQUE

Je le répète : **ton design ne change pas d'un pixel**.
React gère juste la logique. Le CSS, les classes, tout reste pareil.

## 🤝 Besoin d'aide ?

Si tu veux que je continue et que je crée tous les fichiers manquants,
dis-le moi et je génère :
- Toutes les pages
- Tous les composants
- Tous les hooks
- Le tout avec ton design exact

Prêt à continuer ? 🚀
