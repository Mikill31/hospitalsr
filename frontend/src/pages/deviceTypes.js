// Device Types page
import { renderSidebar, initSidebar } from '../components/sidebar.js';
import { showToast } from '../components/toast.js';
import { openModal, closeModal } from '../components/modal.js';
import { getAllDeviceTypes, createDeviceType } from '../api/devices.js';

let deviceTypes = [];

export async function renderDeviceTypes() {
  const app = document.getElementById('app');
  app.innerHTML = `
    ${renderSidebar()}
    <main class="main-content">
      <div class="page-header">
        <h1>Tipos de Dispositivo</h1>
        <p>Categorías para clasificar los dispositivos del hospital</p>
      </div>
      <div class="table-toolbar">
        <div class="table-toolbar-left">
          <div class="search-box">
            <i data-lucide="search"></i>
            <input type="text" id="search-types" placeholder="Buscar tipo..." />
          </div>
        </div>
        <button class="btn btn-primary" id="btn-add-type">
          <i data-lucide="plus"></i> Nuevo Tipo
        </button>
      </div>
      <div class="table-container" id="types-table">
        <div class="loading-spinner"></div>
      </div>
    </main>
  `;

  if (window.lucide) lucide.createIcons();
  initSidebar();

  document.getElementById('btn-add-type').addEventListener('click', openTypeModal);
  document.getElementById('search-types').addEventListener('input', (e) => renderTable(e.target.value.toLowerCase()));

  await loadData();
}

async function loadData() {
  try {
    deviceTypes = await getAllDeviceTypes();
    renderTable();
  } catch (err) { showToast('Error al cargar tipos', 'error'); }
}

function renderTable(search = '') {
  const el = document.getElementById('types-table');
  if (!el) return;
  const filtered = deviceTypes.filter(t => !search || t.name.toLowerCase().includes(search));

  if (filtered.length === 0) {
    el.innerHTML = `<div class="empty-state"><i data-lucide="cpu"></i><p>No se encontraron tipos</p></div>`;
    if (window.lucide) lucide.createIcons();
    return;
  }

  el.innerHTML = `
    <table class="data-table">
      <thead><tr><th>ID</th><th>Nombre</th><th>Descripción</th></tr></thead>
      <tbody>
        ${filtered.map(t => `
          <tr>
            <td class="table-id">#${t.id}</td>
            <td class="table-name">${t.name}</td>
            <td>${t.description || '—'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
  if (window.lucide) lucide.createIcons();
}

function openTypeModal() {
  const body = `
    <div class="form-group"><label>Nombre</label><input type="text" id="m-name" placeholder="Ej: Router, Switch, Servidor..." /></div>
    <div class="form-group"><label>Descripción</label><textarea id="m-desc" placeholder="Descripción del tipo de dispositivo..."></textarea></div>
  `;
  const footer = `
    <button class="btn btn-secondary" id="m-cancel">Cancelar</button>
    <button class="btn btn-primary" id="m-save"><i data-lucide="save"></i> Crear</button>
  `;
  openModal('Nuevo Tipo de Dispositivo', body, footer);

  document.getElementById('m-cancel').addEventListener('click', closeModal);
  document.getElementById('m-save').addEventListener('click', async () => {
    const name = document.getElementById('m-name').value.trim();
    const description = document.getElementById('m-desc').value.trim();
    if (!name) { showToast('El nombre es obligatorio', 'warning'); return; }
    try {
      await createDeviceType({ name, description });
      showToast('Tipo creado exitosamente', 'success');
      closeModal();
      await loadData();
    } catch (err) { showToast(err.message, 'error'); }
  });
}
