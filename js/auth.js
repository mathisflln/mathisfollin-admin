// Gestion de l'authentification admin
async function checkAdminAccess() {
  try {
    const { data: userData } = await supabaseClient.auth.getUser();
    if (!userData.user) {
      window.location.href = "https://admin.mathisfollin.fr/login";
      return null;
    }

    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("role")
      .eq("id", userData.user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      alert("Accès réservé aux administrateurs");
      await supabaseClient.auth.signOut();
      window.location.href = "https://mathisfollin.fr";
      return null;
    }

    // Auth OK - afficher le contenu
    document.body.classList.remove('auth-checking');
    const loader = document.getElementById('auth-loader');
    if (loader) loader.classList.add('hide');

    return userData.user;
  } catch (err) {
    console.error('Auth error', err);
    window.location.href = "https://admin.mathisfollin.fr/login";
    return null;
  }
}

// Afficher les infos admin
function displayAdminInfo(user) {
  const email = user.email || '';
  const name = email.split('@')[0] || 'Admin';
  const initials = name.charAt(0).toUpperCase();

  const userName = document.getElementById('user-name');
  const userAvatar = document.getElementById('user-avatar');
  const welcomeName = document.getElementById('welcome-name');

  if (userName) userName.textContent = name;
  if (userAvatar) userAvatar.textContent = initials;
  if (welcomeName) welcomeName.textContent = name;
}

// Déconnexion
async function adminLogout() {
  await supabaseClient.auth.signOut();
  window.location.href = "https://admin.mathisfollin.fr/login";
}

// Initialiser le bouton de déconnexion
function initAdminLogoutButton() {
  const logoutBtn = document.getElementById('logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', adminLogout);
  }
}