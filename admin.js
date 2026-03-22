// ============================================
// Navro Capital — Admin (Login/Logout)
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const loginError = document.getElementById('loginError');

  // Check if already logged in
  if (localStorage.getItem(CONFIG.storageKeys.isAdmin) === 'true') {
    window.location.href = 'index.html';
    return;
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value;

      if (username === CONFIG.admin.username && password === CONFIG.admin.password) {
        localStorage.setItem(CONFIG.storageKeys.isAdmin, 'true');
        window.location.href = 'index.html';
      } else {
        loginError.classList.add('show');
        // Shake animation
        loginForm.style.animation = 'none';
        loginForm.offsetHeight; // reflow
        loginForm.style.animation = '';

        setTimeout(() => {
          loginError.classList.remove('show');
        }, 3000);
      }
    });
  }
});
