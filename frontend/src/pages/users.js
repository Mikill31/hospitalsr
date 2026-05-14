// Users page (superadmin only)
import { renderSidebar, initSidebar } from '../components/sidebar.js';
import { showToast } from '../components/toast.js';
import { confirmModal } from '../components/modal.js';
import { getAllUsers, deleteUser } from '../api/users.js';
import { isSuperAdmin, getRoleName } from '../utils/auth.js';
import { navigateTo } from '../utils/router.js';

let users = [];

export async function renderUsers() {
  if (!isSuperAdmin()) {
    showToast('Acceso denegado', 'error');
    navigateTo('/dashboard');
    return;
  }

  const app = document.getElementById('app');
  app.innerHTML = `
    ${renderSidebar()}
    <main class="main-content">
      <div class="page-header">
        <h1>Usuarios</h1>
        <p>Gestión de usuarios del sistema (solo superadmin)</p>
      </div>
      <div class="table-toolbar">
        <div class="table-toolbar-left">
          <div class="search-box">
            <i data-lucide="search"></i>
            <input type="text" id="search-users" placeholder="Buscar usuario..." />
          </div>
        </div>
      </div>
      <div class="table-container" id="users-table">
        <div class="loading-spinner"></div>
      </div>
    </main>
  `;

  if (window.lucide) lucide.createIcons();
  initSidebar();

  document.getElementById('search-users').addEventListener('input', (e) => renderTable(e.target.value.toLowerCase()));
  await loadData();
}

async function loadData() {
  try {
    users = await getAllUsers();
    renderTable();
  } catch (err) { showToast('Error al cargar usuarios', 'error'); }
}

function renderTable(search = '') {
  const el = document.getElementById('users-table');
  if (!el) return;
  const filtered = users.filter(u => !search || u.email.toLowerCase().includes(search));

  if (filtered.length === 0) {
    el.innerHTML = `<div class="empty-state"><i data-lucide="users"></i><p>No se encontraron usuarios</p></div>`;
    if (window.lucide) lucide.createIcons();
    return;
  }

  el.innerHTML = `
    <table class="data-table">
      <thead><tr><th>ID</th><th>Email</th><th>Rol</th><th>Creado</th><th>Acciones</th></tr></thead>
      <tbody>
        ${filtered.map(u => `
          <tr>
            <td class="table-id">#${u.id}</td>
            <td class="table-name">${u.email}</td>
            <td><span class="status-badge ${u.role_id === 1 ? 'active' : u.role_id === 2 ? 'maintenance' : 'inactive'}">${getRoleName(u.role_id)}</span></td>
            <td>${u.created_at ? new Date(u.created_at).toLocaleDateString('es-CO') : '—'}</td>
            <td class="table-actions">
              <button class="btn btn-danger btn-sm btn-delete" data-id="${u.id}"><i data-lucide="trash-2"></i></button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  if (window.lucide) lucide.createIcons();

  el.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', () => {
      const u = users.find(u => u.id === +btn.dataset.id);
      if (u) confirmModal('Eliminar Usuario', `¿Estás seguro de eliminar <strong>${u.email}</strong>?`, async () => {
        try {
          await deleteUser(u.id);
          showToast('Usuario eliminado', 'success');
          await loadData();
        } catch (err) { showToast(err.message, 'error'); }
      });
    });
  });
}
