// Login page
import { login } from '../api/auth.js';
import { saveToken, isAuthenticated } from '../utils/auth.js';
import { navigateTo } from '../utils/router.js';

export async function renderLogin() {
  if (isAuthenticated()) {
    navigateTo('/dashboard');
    return;
  }

  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="login-page">
      <div class="login-container">
        <div class="login-card">
          <div class="login-header">
            <div class="login-icon">
              <i data-lucide="shield-check"></i>
            </div>
            <h1>San Rafael Hospital</h1>
            <p>Sistema de Gestión Hospitalaria</p>
          </div>

          <form class="login-form" id="login-form">
            <div id="login-error"></div>

            <div class="form-group">
              <label for="login-email">Correo Electrónico</label>
              <div class="input-wrapper">
                <input type="email" id="login-email" placeholder="admin@hospital.com" required autocomplete="email" />
                <i data-lucide="mail"></i>
              </div>
            </div>

            <div class="form-group">
              <label for="login-password">Contraseña</label>
              <div class="input-wrapper">
                <input type="password" id="login-password" placeholder="••••••••" required autocomplete="current-password" />
                <i data-lucide="lock"></i>
              </div>
            </div>

            <button type="submit" class="btn-login" id="btn-login">
              Iniciar Sesión
            </button>
          </form>

          <div class="login-footer">
            <p>© 2026 San Rafael Hospital — Panel de Administración</p>
          </div>
        </div>
      </div>
    </div>
  `;

  if (window.lucide) lucide.createIcons();

  const form = document.getElementById('login-form');
  form.addEventListener('submit', handleLogin);
}

async function handleLogin(e) {
  e.preventDefault();
  const btn = document.getElementById('btn-login');
  const errorDiv = document.getElementById('login-error');
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  if (!email || !password) {
    errorDiv.innerHTML = '<div class="login-error">Por favor completa todos los campos</div>';
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Ingresando...';
  errorDiv.innerHTML = '';

  try {
    const data = await login(email, password);
    saveToken(data.token);
    navigateTo('/dashboard');
  } catch (err) {
    errorDiv.innerHTML = `<div class="login-error">${err.message}</div>`;
    btn.disabled = false;
    btn.textContent = 'Iniciar Sesión';
  }
}
