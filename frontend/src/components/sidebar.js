// Sidebar navigation component
import { getUserFromToken, getRoleName, isSuperAdmin, logout } from '../utils/auth.js';
import { getCurrentRoute } from '../utils/router.js';

export function renderSidebar() {
  const user = getUserFromToken();
  const currentRoute = getCurrentRoute();
  const roleName = user ? getRoleName(user.role_id) : 'Usuario';
  const email = user ? `ID: ${user.id}` : '';

  return `
    <button class="mobile-toggle" id="mobile-toggle">
      <i data-lucide="menu"></i>
    </button>
    <div class="sidebar-overlay" id="sidebar-overlay"></div>
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-header">
        <div class="sidebar-logo">
          <i data-lucide="activity"></i>
        </div>
        <div class="sidebar-brand">
          <h2>San Rafael</h2>
          <span>Hospital Management</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <div class="sidebar-section-title">Principal</div>
        <a class="sidebar-link ${currentRoute === '/dashboard' ? 'active' : ''}" href="#/dashboard">
          <i data-lucide="layout-dashboard"></i>
          <span>Dashboard</span>
        </a>

        <div class="sidebar-section-title">Gestión</div>
        <a class="sidebar-link ${currentRoute === '/devices' ? 'active' : ''}" href="#/devices">
          <i data-lucide="monitor"></i>
          <span>Dispositivos</span>
        </a>
        <a class="sidebar-link ${currentRoute === '/device-types' ? 'active' : ''}" href="#/device-types">
          <i data-lucide="cpu"></i>
          <span>Tipos de Dispositivo</span>
        </a>
        <a class="sidebar-link ${currentRoute === '/locations' ? 'active' : ''}" href="#/locations">
          <i data-lucide="map-pin"></i>
          <span>Ubicaciones</span>
        </a>
        ${isSuperAdmin() ? `
        <a class="sidebar-link ${currentRoute === '/users' ? 'active' : ''}" href="#/users">
          <i data-lucide="users"></i>
          <span>Usuarios</span>
        </a>
        ` : ''}

        <div class="sidebar-section-title">Monitoreo</div>
        <a class="sidebar-link disabled" href="#">
          <i data-lucide="bar-chart-3"></i>
          <span>Métricas</span>
          <span class="sidebar-badge soon">Pronto</span>
        </a>
        <a class="sidebar-link disabled" href="#">
          <i data-lucide="bell"></i>
          <span>Alertas</span>
          <span class="sidebar-badge soon">Pronto</span>
        </a>
      </nav>

      <div class="sidebar-footer">
        <div class="sidebar-user">
          <div class="sidebar-user-avatar">
            <i data-lucide="user"></i>
          </div>
          <div class="sidebar-user-info">
            <p>${roleName}</p>
            <span>${email}</span>
          </div>
        </div>
        <button class="btn-logout" id="btn-logout">
          <i data-lucide="log-out"></i>
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  `;
}

export function initSidebar() {
  const logoutBtn = document.getElementById('btn-logout');
  const toggle = document.getElementById('mobile-toggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  if (logoutBtn) logoutBtn.addEventListener('click', logout);

  if (toggle && sidebar && overlay) {
    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('open');
    });
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('open');
    });
  }
}
