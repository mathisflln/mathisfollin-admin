// Utilitaire pour échapper le HTML
function escapeHtml(unsafe) {
  if (!unsafe && unsafe !== 0) return '';
  return String(unsafe).replace(/[&<>"'`=\/]/g, s => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',
    "'":'&#39;','`':'&#x60;','/':'&#x2F;','=':'&#x3D;'
  })[s]);
}

// État vide pour les listes
function renderEmptyState(container, icon, message) {
  container.innerHTML = `
    <div class="empty-state">
      ${icon}
      <div>${message}</div>
    </div>
  `;
}

// Éditeur riche
function initRichEditor() {
  document.querySelectorAll('.editor-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const command = btn.dataset.command;
      const value = btn.dataset.value;
      const target = btn.dataset.target;
      
      const editorId = target === 'email' ? 'email-content' : 'article-content';
      
      if (command === 'createLink') {
        const url = prompt('URL du lien:');
        if (url) document.execCommand('createLink', false, url);
      } else if (value) {
        document.execCommand(command, false, value);
      } else {
        document.execCommand(command, false, null);
      }
      
      document.getElementById(editorId).focus();
    });
  });
}

// Quiz builder
let quizQuestions = [];

function renderQuizBuilder() {
  const container = document.getElementById('quiz-builder');
  container.innerHTML = '';
  
  quizQuestions.forEach((q, index) => {
    const block = document.createElement('div');
    block.className = 'question-block';
    block.innerHTML = `
      <div class="question-header">
        <span class="question-number">Question ${index + 1}</span>
        <button type="button" class="btn-remove-question" data-index="${index}">Supprimer</button>
      </div>
      <div class="form-group">
        <input type="text" class="form-input" placeholder="Texte de la question" value="${escapeHtml(q.question)}" data-index="${index}" data-field="question">
      </div>
      <div class="form-group">
        <label class="form-label" style="margin-bottom: 8px;">Temps limite (secondes)</label>
        <input type="number" class="form-input" placeholder="20" value="${q.timeLimit || 20}" data-index="${index}" data-field="timeLimit" min="5" max="120">
      </div>
      <div class="form-group">
        <label class="form-label" style="margin-bottom: 8px;">Réponses (cochez la bonne réponse)</label>
        ${q.options.map((ans, i) => `
          <div class="answer-option">
            <input type="radio" name="correctIndex-${index}" value="${i}" ${q.correctIndex === i ? 'checked' : ''} data-index="${index}" data-answer="${i}">
            <input type="text" class="form-input" placeholder="Réponse ${i + 1}" value="${escapeHtml(ans)}" data-index="${index}" data-field="option" data-answer="${i}">
          </div>
        `).join('')}
      </div>
    `;
    container.appendChild(block);
  });
  
  // Event listeners
  container.querySelectorAll('input[data-field="question"]').forEach(input => {
    input.addEventListener('input', (e) => {
      const idx = parseInt(e.target.dataset.index);
      quizQuestions[idx].question = e.target.value;
    });
  });
  
  container.querySelectorAll('input[data-field="timeLimit"]').forEach(input => {
    input.addEventListener('input', (e) => {
      const idx = parseInt(e.target.dataset.index);
      quizQuestions[idx].timeLimit = parseInt(e.target.value) || 20;
    });
  });
  
  container.querySelectorAll('input[data-field="option"]').forEach(input => {
    input.addEventListener('input', (e) => {
      const idx = parseInt(e.target.dataset.index);
      const ansIdx = parseInt(e.target.dataset.answer);
      quizQuestions[idx].options[ansIdx] = e.target.value;
    });
  });
  
  container.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      const idx = parseInt(e.target.dataset.index);
      const ansIdx = parseInt(e.target.dataset.answer);
      quizQuestions[idx].correctIndex = ansIdx;
    });
  });
  
  container.querySelectorAll('.btn-remove-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index);
      quizQuestions.splice(idx, 1);
      renderQuizBuilder();
    });
  });
}

// Fermer modales en cliquant à l'extérieur
function initModalClosing() {
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });
}