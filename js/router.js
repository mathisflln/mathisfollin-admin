// Gestion du routing côté client pour l'admin
class AdminRouter {
  constructor(routes) {
    this.routes = routes;
    this.init();
  }

  init() {
    // Gérer les clics sur les liens de navigation
    document.addEventListener('click', (e) => {
      const link = e.target.closest('[data-view]');
      if (link && link.classList.contains('nav-item')) {
        e.preventDefault();
        const view = link.getAttribute('data-view');
        this.navigateTo(view);
      }
      
      // Gérer les clics sur les cartes de raccourcis
      const shortcut = e.target.closest('.stat-card[data-view]');
      if (shortcut && !shortcut.classList.contains('nav-item')) {
        const view = shortcut.getAttribute('data-view');
        this.navigateTo(view);
      }
    });

    // Gérer le bouton retour du navigateur
    window.addEventListener('popstate', () => {
      this.handleRoute(window.location.pathname);
    });

    // Charger la route initiale
    this.handleRoute(window.location.pathname);
  }

  navigateTo(view) {
    // Convertir le nom de vue en path
    const path = view === 'overview' ? '/' : `/${view}`;
    
    // Changer l'URL sans recharger la page
    history.pushState(null, '', path);
    this.handleRoute(path);
  }

  handleRoute(path) {
    // Normaliser le path
    let viewName = path === '/' || path === '' ? 'overview' : path.substring(1);
    
    // Vérifier que la route existe
    if (!this.routes[viewName]) {
      viewName = 'overview';
    }
    
    const route = this.routes[viewName];
    
    // Cacher toutes les vues
    document.querySelectorAll('.view-section').forEach(v => 
      v.classList.remove('active')
    );
    
    // Retirer active de tous les nav items
    document.querySelectorAll('.nav-item').forEach(item => 
      item.classList.remove('active')
    );
    
    // Afficher la vue correspondante
    const viewElement = document.getElementById(`view-${viewName}`);
    if (viewElement) {
      viewElement.classList.add('active');
    }
    
    // Activer le bon nav item
    const activeNav = document.querySelector(`.nav-item[data-view="${viewName}"]`);
    if (activeNav) {
      activeNav.classList.add('active');
    }
    
    // Exécuter la fonction de chargement de la vue
    if (route.onLoad && typeof route.onLoad === 'function') {
      route.onLoad();
    }
    
    // Mettre à jour le titre de la page
    document.title = route.title || 'Admin - FAH Marie-Curie';
  }
}

// Configuration des routes admin
const adminRoutes = {
  'overview': {
    title: 'Admin - FAH Marie-Curie',
    onLoad: () => {
      if (window.loadStats) window.loadStats();
    }
  },
  'articles': {
    title: 'Articles - Admin FAH',
    onLoad: () => {
      if (window.loadArticles) window.loadArticles();
    }
  },
  'quiz': {
    title: 'Quiz - Admin FAH',
    onLoad: () => {
      if (window.loadQuizzes) window.loadQuizzes();
    }
  },
  'documents': {
    title: 'Documents - Admin FAH',
    onLoad: () => {
      if (window.loadDocuments) window.loadDocuments();
    }
  },
  'events': {
    title: 'Événements - Admin FAH',
    onLoad: () => {
      if (window.loadEvents) window.loadEvents();
    }
  },
  'emails': {
    title: 'Envoyer un email - Admin FAH',
    onLoad: () => {
      if (window.loadUsersCount) window.loadUsersCount();
    }
  },
  'invites': {
    title: 'Inviter des membres - Admin FAH',
    onLoad: () => {
      // Rien à charger pour cette vue
    }
  }
};

// Initialiser le router admin
let adminRouter;
function initAdminRouter() {
  adminRouter = new AdminRouter(adminRoutes);
}