// Variables globales
let currentUserId = null;
let editingArticleId = null;
let editingQuizId = null;
let editingEventId = null;

// ========================================
// INITIALISATION
// ========================================

async function initAdmin() {
  const user = await checkAdminAccess();
  if (!user) return;
  
  currentUserId = user.id;
  displayAdminInfo(user);
  initAdminLogoutButton();
  initRichEditor();
  initModalClosing();
  initModals();
  initMobileMenu();
  initAdminRouter();
  
  await loadStats();
}

// ========================================
// STATS
// ========================================

async function loadStats() {
  const { count: articlesCount } = await supabaseClient
    .from('articles')
    .select('id', { count: 'exact', head: true });
  document.getElementById('stat-articles').textContent = articlesCount ?? '0';

  const { count: quizzesCount } = await supabaseClient
    .from('quizzes')
    .select('id', { count: 'exact', head: true });
  document.getElementById('stat-quizzes').textContent = quizzesCount ?? '0';

  const { count: docsCount } = await supabaseClient
    .from('documents_meta')
    .select('id', { count: 'exact', head: true });
  document.getElementById('stat-docs').textContent = docsCount ?? '0';

  const { count: eventsCount } = await supabaseClient
    .from('events')
    .select('id', { count: 'exact', head: true });
  document.getElementById('stat-events').textContent = eventsCount ?? '0';
}

// ========================================
// ARTICLES
// ========================================

async function loadArticles() {
  const { data: articles } = await supabaseClient
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false });
  
  const container = document.getElementById('articles-list');
  
  if (!articles || articles.length === 0) {
    renderEmptyState(
      container,
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>',
      'Aucun article pour le moment'
    );
    return;
  }

  container.innerHTML = `
    <table class="data-table">
      <thead>
        <tr>
          <th>Titre</th>
          <th>Slug</th>
          <th>Statut</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${articles.map(a => `
          <tr>
            <td data-label="Titre">${escapeHtml(a.title)}</td>
            <td data-label="Slug">${escapeHtml(a.slug)}</td>
            <td data-label="Statut"><span class="status-badge ${a.published ? 'status-published' : 'status-draft'}">${a.published ? 'Publié' : 'Brouillon'}</span></td>
            <td data-label="Date">${new Date(a.created_at).toLocaleDateString('fr-FR')}</td>
            <td data-label="Actions">
              <div class="action-buttons">
                <button class="btn-action" onclick="editArticle('${a.id}')">Modifier</button>
                <button class="btn-action btn-danger" onclick="deleteArticle('${a.id}')">Supprimer</button>
              </div>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

async function editArticle(id) {
  editingArticleId = id;
  const { data } = await supabaseClient.from('articles').select('*').eq('id', id).single();
  
  if (data) {
    document.getElementById('article-modal-title').textContent = 'Modifier l\'article';
    document.getElementById('article-title').value = data.title;
    document.getElementById('article-content').innerHTML = data.content;
    document.getElementById('article-cover').value = data.cover_image || '';
    document.getElementById('article-published').value = data.published.toString();
    document.getElementById('article-modal').classList.add('active');
  }
}

async function deleteArticle(id) {
  if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
    await supabaseClient.from('articles').delete().eq('id', id);
    loadArticles();
    loadStats();
  }
}

// ========================================
// QUIZ
// ========================================

async function loadQuizzes() {
  const { data: quizzes } = await supabaseClient
    .from('quizzes')
    .select('*')
    .order('created_at', { ascending: false });
  
  const container = document.getElementById('quiz-list');
  
  if (!quizzes || quizzes.length === 0) {
    renderEmptyState(
      container,
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
      'Aucun quiz pour le moment'
    );
    return;
  }

  container.innerHTML = `
    <table class="data-table">
      <thead>
        <tr>
          <th>Titre</th>
          <th>Description</th>
          <th>Questions</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${quizzes.map(q => {
          let questionsCount = 0;
          try {
            const qs = typeof q.questions === 'string' ? JSON.parse(q.questions) : q.questions;
            questionsCount = Array.isArray(qs) ? qs.length : 0;
          } catch (e) {}
          
          return `
            <tr>
              <td data-label="Titre">${escapeHtml(q.title)}</td>
              <td data-label="Description">${escapeHtml((q.description || '').substring(0, 50))}${(q.description || '').length > 50 ? '...' : ''}</td>
              <td data-label="Questions">${questionsCount}</td>
              <td data-label="Date">${new Date(q.created_at).toLocaleDateString('fr-FR')}</td>
              <td data-label="Actions">
                <div class="action-buttons">
                  <button class="btn-action" onclick="editQuiz('${q.id}')">Modifier</button>
                  <button class="btn-action btn-danger" onclick="deleteQuiz('${q.id}')">Supprimer</button>
                </div>
              </td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  `;
}

async function editQuiz(id) {
  editingQuizId = id;
  const { data } = await supabaseClient.from('quizzes').select('*').eq('id', id).single();
  
  if (data) {
    document.getElementById('quiz-modal-title').textContent = 'Modifier le quiz';
    document.getElementById('quiz-title').value = data.title;
    document.getElementById('quiz-description').value = data.description || '';
    
    quizQuestions = typeof data.questions === 'string' ? JSON.parse(data.questions) : data.questions;
    renderQuizBuilder();
    
    document.getElementById('quiz-modal').classList.add('active');
  }
}

async function deleteQuiz(id) {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce quiz ?')) {
    await supabaseClient.from('quizzes').delete().eq('id', id);
    loadQuizzes();
    loadStats();
  }
}

// ========================================
// DOCUMENTS
// ========================================

async function loadDocuments() {
  const { data: documents } = await supabaseClient
    .from('documents_meta')
    .select('*')
    .order('created_at', { ascending: false });
  
  const container = document.getElementById('documents-list');
  
  if (!documents || documents.length === 0) {
    renderEmptyState(
      container,
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>',
      'Aucun document pour le moment'
    );
    return;
  }

  container.innerHTML = `
    <table class="data-table">
      <thead>
        <tr>
          <th>Titre</th>
          <th>Fichier</th>
          <th>Description</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${documents.map(d => `
          <tr>
            <td data-label="Titre">${escapeHtml(d.title)}</td>
            <td data-label="Fichier">${escapeHtml(d.filename)}</td>
            <td data-label="Description">${escapeHtml((d.description || '').substring(0, 50))}${(d.description || '').length > 50 ? '...' : ''}</td>
            <td data-label="Date">${new Date(d.created_at).toLocaleDateString('fr-FR')}</td>
            <td data-label="Actions">
              <div class="action-buttons">
                <button class="btn-action btn-danger" onclick="deleteDocument(${d.id}, '${escapeHtml(d.filename)}')">Supprimer</button>
              </div>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

async function deleteDocument(id, filename) {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
    try {
      const { error: dbError } = await supabaseClient.from('documents_meta').delete().eq('id', id);
      if (dbError) {
        console.error('DB delete error:', dbError);
        alert('Erreur lors de la suppression des métadonnées : ' + dbError.message);
        return;
      }
      
      const { error: storageError } = await supabaseClient.storage.from('documents').remove([filename]);
      if (storageError) {
        console.error('Storage delete error:', storageError);
      }
      
      loadDocuments();
      loadStats();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Erreur lors de la suppression : ' + error.message);
    }
  }
}

// ========================================
// ÉVÉNEMENTS
// ========================================

async function loadEvents() {
  const { data: events } = await supabaseClient
    .from('events')
    .select('*')
    .order('event_date', { ascending: false });
  
  const container = document.getElementById('events-list');
  
  if (!events || events.length === 0) {
    renderEmptyState(
      container,
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>',
      'Aucun événement pour le moment'
    );
    return;
  }

  container.innerHTML = `
    <table class="data-table">
      <thead>
        <tr>
          <th>Titre</th>
          <th>Date</th>
          <th>Lieu</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${events.map(ev => `
          <tr>
            <td data-label="Titre">${escapeHtml(ev.title)}</td>
            <td data-label="Date">${new Date(ev.event_date).toLocaleString('fr-FR')}</td>
            <td data-label="Lieu">${escapeHtml(ev.location || '-')}</td>
            <td data-label="Description">${escapeHtml((ev.description || '').substring(0, 50))}${(ev.description || '').length > 50 ? '...' : ''}</td>
            <td data-label="Actions">
              <div class="action-buttons">
                <button class="btn-action" onclick="editEvent('${ev.id}')">Modifier</button>
                <button class="btn-action btn-danger" onclick="deleteEvent('${ev.id}')">Supprimer</button>
              </div>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

async function editEvent(id) {
  editingEventId = id;
  const { data } = await supabaseClient.from('events').select('*').eq('id', id).single();
  
  if (data) {
    document.getElementById('event-modal-title').textContent = 'Modifier l\'événement';
    document.getElementById('event-title').value = data.title;
    document.getElementById('event-description').value = data.description || '';
    document.getElementById('event-date').value = new Date(data.event_date).toISOString().slice(0, 16);
    document.getElementById('event-location').value = data.location || '';
    document.getElementById('event-modal').classList.add('active');
  }
}

async function deleteEvent(id) {
  if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
    await supabaseClient.from('events').delete().eq('id', id);
    loadEvents();
    loadStats();
  }
}

// ========================================
// EMAILS
// ========================================

async function loadUsersCount() {
  try {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) return;

    const response = await fetch(`${SUPABASE_URL}/functions/v1/get_users_count`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.access_token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      document.getElementById('users-count').textContent = data.count || '0';
    } else {
      const { data: { users } } = await supabaseClient.auth.admin.listUsers();
      document.getElementById('users-count').textContent = users?.length || '0';
    }
  } catch (err) {
    console.error('Erreur chargement users:', err);
    document.getElementById('users-count').textContent = '?';
  }
}

// ========================================
// MODALS - INITIALISATION
// ========================================

function initModals() {
  // ARTICLES
  document.getElementById('btn-new-article').addEventListener('click', () => {
    editingArticleId = null;
    document.getElementById('article-modal-title').textContent = 'Nouvel article';
    document.getElementById('article-form').reset();
    document.getElementById('article-content').innerHTML = '';
    document.getElementById('article-modal').classList.add('active');
  });

  document.getElementById('btn-close-article').addEventListener('click', () => {
    document.getElementById('article-modal').classList.remove('active');
  });

  document.getElementById('btn-cancel-article').addEventListener('click', () => {
    document.getElementById('article-modal').classList.remove('active');
  });

  document.getElementById('article-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('article-title').value;
    const contentDiv = document.getElementById('article-content');
    const content = contentDiv.innerHTML;
    const coverImage = document.getElementById('article-cover').value;
    const published = document.getElementById('article-published').value === 'true';
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const articleData = {
      title,
      slug,
      content,
      cover_image: coverImage || null,
      published,
      author_id: currentUserId
    };

    if (editingArticleId) {
      await supabaseClient.from('articles').update(articleData).eq('id', editingArticleId);
    } else {
      await supabaseClient.from('articles').insert([articleData]);
    }

    document.getElementById('article-modal').classList.remove('active');
    loadArticles();
    loadStats();
  });

  // QUIZ
  document.getElementById('btn-new-quiz').addEventListener('click', () => {
    editingQuizId = null;
    quizQuestions = [];
    document.getElementById('quiz-modal-title').textContent = 'Nouveau quiz';
    document.getElementById('quiz-form').reset();
    renderQuizBuilder();
    document.getElementById('quiz-modal').classList.add('active');
  });

  document.getElementById('btn-close-quiz').addEventListener('click', () => {
    document.getElementById('quiz-modal').classList.remove('active');
  });

  document.getElementById('btn-cancel-quiz').addEventListener('click', () => {
    document.getElementById('quiz-modal').classList.remove('active');
  });

  document.getElementById('btn-add-quiz-question').addEventListener('click', () => {
    quizQuestions.push({
      question: '',
      options: ['', '', '', ''],
      correctIndex: 0,
      timeLimit: 20
    });
    renderQuizBuilder();
  });

  document.getElementById('quiz-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('quiz-title').value;
    const description = document.getElementById('quiz-description').value;

    if (quizQuestions.length === 0) {
      alert('Veuillez ajouter au moins une question');
      return;
    }

    for (let i = 0; i < quizQuestions.length; i++) {
      if (!quizQuestions[i].question.trim()) {
        alert(`La question ${i + 1} est vide`);
        return;
      }
      if (quizQuestions[i].options.some(a => !a.trim())) {
        alert(`Toutes les réponses de la question ${i + 1} doivent être remplies`);
        return;
      }
    }

    const quizData = {
      title,
      description: description || null,
      questions: quizQuestions
    };

    try {
      if (editingQuizId) {
        const { error } = await supabaseClient.from('quizzes').update(quizData).eq('id', editingQuizId);
        if (error) throw error;
      } else {
        const { error } = await supabaseClient.from('quizzes').insert([quizData]);
        if (error) throw error;
      }

      document.getElementById('quiz-modal').classList.remove('active');
      loadQuizzes();
      loadStats();
    } catch (error) {
      console.error('Erreur quiz:', error);
      alert('Erreur lors de l\'enregistrement : ' + error.message);
    }
  });

  // DOCUMENTS
  document.getElementById('btn-new-document').addEventListener('click', () => {
    document.getElementById('document-form').reset();
    document.getElementById('document-modal').classList.add('active');
  });

  document.getElementById('btn-close-document').addEventListener('click', () => {
    document.getElementById('document-modal').classList.remove('active');
  });

  document.getElementById('btn-cancel-document').addEventListener('click', () => {
    document.getElementById('document-modal').classList.remove('active');
  });

  document.getElementById('document-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('document-title').value;
    const description = document.getElementById('document-description').value;
    const fileInput = document.getElementById('document-file');
    const file = fileInput.files[0];

    if (!file) {
      alert('Veuillez sélectionner un fichier');
      return;
    }

    try {
      const filename = `${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabaseClient.storage
        .from('documents')
        .upload(filename, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        alert('Erreur lors de l\'upload : ' + uploadError.message);
        return;
      }

      const { error: insertError } = await supabaseClient.from('documents_meta').insert([{
        title,
        filename,
        description: description || null
      }]);

      if (insertError) {
        console.error('Insert error:', insertError);
        await supabaseClient.storage.from('documents').remove([filename]);
        alert('Erreur lors de la création des métadonnées : ' + insertError.message);
        return;
      }

      document.getElementById('document-modal').classList.remove('active');
      loadDocuments();
      loadStats();
    } catch (error) {
      console.error('Error:', error);
      alert('Erreur : ' + error.message);
    }
  });

  // ÉVÉNEMENTS
  document.getElementById('btn-new-event').addEventListener('click', () => {
    editingEventId = null;
    document.getElementById('event-modal-title').textContent = 'Nouvel événement';
    document.getElementById('event-form').reset();
    document.getElementById('event-modal').classList.add('active');
  });

  document.getElementById('btn-close-event').addEventListener('click', () => {
    document.getElementById('event-modal').classList.remove('active');
  });

  document.getElementById('btn-cancel-event').addEventListener('click', () => {
    document.getElementById('event-modal').classList.remove('active');
  });

  document.getElementById('event-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('event-title').value;
    const description = document.getElementById('event-description').value;
    const eventDate = document.getElementById('event-date').value;
    const location = document.getElementById('event-location').value;

    const eventData = {
      title,
      description: description || null,
      event_date: eventDate,
      location: location || null
    };

    if (editingEventId) {
      await supabaseClient.from('events').update(eventData).eq('id', editingEventId);
    } else {
      await supabaseClient.from('events').insert([eventData]);
    }

    document.getElementById('event-modal').classList.remove('active');
    loadEvents();
    loadStats();
  });

  // EMAILS
  document.getElementById('email-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '⏳ Envoi en cours...';

    try {
      const subject = document.getElementById('email-subject').value;
      const contentDiv = document.getElementById('email-content');
      const htmlContent = contentDiv.innerHTML;

      if (!htmlContent.trim()) {
        alert('Le contenu de l\'email ne peut pas être vide');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        return;
      }

      const { data: { session } } = await supabaseClient.auth.getSession();
      if (!session) {
        alert('Session expirée, veuillez vous reconnecter');
        window.location.href = '/admin/login.html';
        return;
      }

      const response = await fetch(`${SUPABASE_URL}/functions/v1/send_email_to_all`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          subject,
          htmlContent
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de l\'envoi');
      }

      alert(`✅ ${result.message}\n\n✓ Envoyés: ${result.success}\n${result.failed > 0 ? `✗ Échecs: ${result.failed}` : ''}`);
      
      document.getElementById('email-form').reset();
      contentDiv.innerHTML = '';

    } catch (err) {
      console.error('Erreur envoi email:', err);
      alert('❌ Erreur lors de l\'envoi des emails: ' + err.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });

  // INVITATIONS
  document.getElementById('invite-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '⏳ Envoi en cours...';

    try {
      const emailsText = document.getElementById('invite-emails').value;
      const emails = emailsText
        .split('\n')
        .map(e => e.trim())
        .filter(e => e && e.includes('@'));

      if (emails.length === 0) {
        alert('Veuillez entrer au moins une adresse email valide');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        return;
      }

      const { data: { session } } = await supabaseClient.auth.getSession();
      if (!session) {
        alert('Session expirée, veuillez vous reconnecter');
        window.location.href = '/admin/login.html';
        return;
      }

      const response = await fetch(`${SUPABASE_URL}/functions/v1/send_invitations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ emails })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de l\'envoi');
      }

      let message = `✅ Invitations envoyées!\n\n`;
      message += `✓ Réussies: ${result.success}\n`;
      if (result.failed > 0) {
        message += `✗ Échecs: ${result.failed}\n\n`;
        message += `Erreurs:\n${result.errors.slice(0, 5).join('\n')}`;
      }

      alert(message);

      if (result.success > 0) {
        document.getElementById('invite-form').reset();
      }

    } catch (err) {
      console.error('Erreur envoi invitations:', err);
      alert('❌ Erreur: ' + err.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
}

// ========================================
// MENU MOBILE
// ========================================

function initMobileMenu() {
  const burgerHTML = `
    <button class="mobile-menu-btn" id="mobile-menu-btn">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
    </button>
    <div class="mobile-overlay" id="mobile-overlay"></div>
  `;
  
  document.body.insertAdjacentHTML('afterbegin', burgerHTML);
  
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileOverlay = document.getElementById('mobile-overlay');
  const sidebar = document.querySelector('.sidebar');
  
  mobileMenuBtn.addEventListener('click', () => {
    sidebar.classList.add('mobile-open');
    mobileOverlay.classList.add('active');
  });
  
  mobileOverlay.addEventListener('click', () => {
    sidebar.classList.remove('mobile-open');
    mobileOverlay.classList.remove('active');
  });
  
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      if (window.innerWidth <= 1024) {
        sidebar.classList.remove('mobile-open');
        mobileOverlay.classList.remove('active');
      }
    });
  });
  
  document.querySelectorAll('.stat-card[data-view]').forEach(card => {
    card.addEventListener('click', () => {
      if (window.innerWidth <= 1024) {
        sidebar.classList.remove('mobile-open');
        mobileOverlay.classList.remove('active');
      }
    });
  });
}

// ========================================
// DÉMARRAGE
// ========================================

initAdmin();