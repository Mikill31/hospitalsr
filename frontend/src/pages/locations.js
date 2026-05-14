// Locations page
import { renderSidebar, initSidebar } from '../components/sidebar.js';
import { showToast } from '../components/toast.js';
import { openModal, closeModal, confirmModal } from '../components/modal.js';
import { getAllLocations, createLocation, updateLocation, deleteLocation } from '../api/locations.js';

let locations = [];
let searchQuery = '';

export async function renderLocations() {
  const app = document.getElementById('app');
  app.innerHTML = `
    ${renderSidebar()}
    <main class="main-content">
      <div class="page-header">
        <h1>Ubicaciones</h1>
        <p>Gestión de ubicaciones dentro del hospital</p>
      </div>
      <div class="table-toolbar">
        <div class="table-toolbar-left">
          <div class="search-box">
            <i data-lucide="search"></i>
            <input type="text" id="search-locations" placeholder="Buscar ubicación..." />
          </div>
        </div>
        <button class="btn btn-primary" id="btn-add-location">
          <i data-lucide="plus"></i> Nueva Ubicación
        </button>
      </div>
      <div class="table-container" id="locations-table">
        <div class="loading-spinner"></div>
      </div>
    </main>
  `;

  if (window.lucide) lucide.createIcons();
  initSidebar();

  document.getElementById('btn-add-location').addEventListener('click', () => openLocationModal());
  document.getElementById('search-locations').addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase();
    renderTable();
  });

  await loadData();
}

async function loadData() {
  try {
    locations = await getAllLocations();
    renderTable();
  } catch (err) { showToast('Error al cargar ubicaciones', 'error'); }
}

function renderTable() {
  const el = document.getElementById('locations-table');
  if (!el) return;
  const filtered = locations.filter(l => !searchQuery || l.name.toLowerCase().includes(searchQuery) || l.building.toLowerCase().includes(searchQuery));

  if (filtered.length === 0) {
    el.innerHTML = `<div class="empty-state"><i data-lucide="map-pin-off"></i><p>No se encontraron ubicaciones</p></div>`;
    if (window.lucide) lucide.createIcons();
    return;
  }

  el.innerHTML = `
    <table class="data-table">
      <thead><tr><th>ID</th><th>Nombre</th><th>Edificio</th><th>Piso</th><th>Descripción</th><th>Acciones</th></tr></thead>
      <tbody>
        ${filtered.map(l => `
          <tr>
            <td class="table-id">#${l.id}</td>
            <td class="table-name">${l.name}</td>
            <td>${l.building}</td>
            <td>${l.floor}</td>
            <td>${l.description || '—'}</td>
            <td class="table-actions">
              <button class="btn btn-secondary btn-sm btn-edit" data-id="${l.id}"><i data-lucide="pencil"></i></button>
              <button class="btn btn-danger btn-sm btn-delete" data-id="${l.id}"><i data-lucide="trash-2"></i></button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  if (window.lucide) lucide.createIcons();

  el.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', () => {
      const l = locations.find(l => l.id === +btn.dataset.id);
      if (l) openLocationModal(l);
    });
  });

  el.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', () => {
      const l = locations.find(l => l.id === +btn.dataset.id);
      if (l) confirmModal('Eliminar Ubicación', `¿Estás seguro de eliminar <strong>${l.name}</strong>?`, async () => {
        try {
          await deleteLocation(l.id);
          showToast('Ubicación eliminada', 'success');
          await loadData();
        } catch (err) { showToast(err.message, 'error'); }
      });
    });
  });
}

function openLocationModal(location = null) {
  const isEdit = !!location;
  const body = `
    <div class="form-group"><label>Nombre</label><input type="text" id="m-name" value="${location?.name || ''}" placeholder="Ej: Sala de Servidores" /></div>
    <div class="form-group"><label>Edificio</label><input type="text" id="m-building" value="${location?.building || ''}" placeholder="Ej: Edificio Principal" /></div>
    <div class="form-group"><label>Piso</label><input type="text" id="m-floor" value="${location?.floor || ''}" placeholder="Ej: Piso 3" /></div>
    <div class="form-group"><label>Descripción</label><textarea id="m-desc" placeholder="Descripción opcional...">${location?.description || ''}</textarea></div>
  `;
  const footer = `
    <button class="btn btn-secondary" id="m-cancel">Cancelar</button>
    <button class="btn btn-primary" id="m-save"><i data-lucide="save"></i> ${isEdit ? 'Guardar' : 'Crear'}</button>
  `;
  openModal(isEdit ? 'Editar Ubicación' : 'Nueva Ubicación', body, footer);

  document.getElementById('m-cancel').addEventListener('click', closeModal);
  document.getElementById('m-save').addEventListener('click', async () => {
    const data = {
      name: document.getElementById('m-name').value.trim(),
      building: document.getElementById('m-building').value.trim(),
      floor: document.getElementById('m-floor').value.trim(),
      description: document.getElementById('m-desc').value.trim(),
    };
    if (!data.name || !data.building || !data.floor) { showToast('Nombre, edificio y piso son obligatorios', 'warning'); return; }
    try {
      if (isEdit) { await updateLocation(location.id, data); showToast('Ubicación actualizada', 'success'); }
      else { await createLocation(data); showToast('Ubicación creada', 'success'); }
      closeModal();
      await loadData();
    } catch (err) { showToast(err.message, 'error'); }
  });
}
