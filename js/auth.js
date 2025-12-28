// Gestion de l'authentification admin
async function checkAdminAccess() {
  try {
    const { data: userData } = await supabaseClient.auth.getUser();
    if (!userData.user) {
      window.location.href = "/login.html"; // ← Chemin relatif
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
      window.location.href = "/login.html"; // ← Chemin relatif
      return null;
    }

    // Auth OK - afficher le contenu
    document.body.classList.remove('auth-checking');
    const loader = document.getElementById('auth-loader');
    if (loader) loader.classList.add('hide');

    return userData.user;
  } catch (err) {
    console.error('Auth error', err);
    window.location.href = "/login.html"; // ← Chemin relatif
    return null;
  }
}

// Afficher les infos admin avec nom et prénom
async function displayAdminInfo(user) {
  // Récupérer le profil avec first_name et last_name
  const { data: profile } = await supabaseClient
    .from('profiles')
    .select('first_name, last_name')
    .eq('id', user.id)
    .single();
  
  let name, initials;
  
  if (profile && profile.first_name && profile.last_name) {
    // Si on a nom et prénom
    name = `${profile.first_name} ${profile.last_name}`;
    initials = `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`.toUpperCase();
  } else {
    // Fallback sur l'email
    const email = user.email || '';
    name = email.split('@')[0] || 'Admin';
    initials = name.charAt(0).toUpperCase();
  }

  const userName = document.getElementById('user-name');
  const userAvatar = document.getElementById('user-avatar');
  const welcomeName = document.getElementById('welcome-name');

  if (userName) userName.textContent = name;
  if (userAvatar) userAvatar.textContent = initials;
  if (welcomeName) welcomeName.textContent = profile?.first_name || name.split(' ')[0];
}

// Déconnexion
async function adminLogout() {
  await supabaseClient.auth.signOut();
  window.location.href = "/login.html"; // ← Chemin relatif
}

// Initialiser le bouton de déconnexion
function initAdminLogoutButton() {
  const logoutBtn = document.getElementById('logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', adminLogout);
  }
}