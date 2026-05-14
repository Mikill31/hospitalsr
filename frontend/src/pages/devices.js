// Devices page
import { renderSidebar, initSidebar } from '../components/sidebar.js';
import { showToast } from '../components/toast.js';
import { openModal, closeModal, confirmModal } from '../components/modal.js';
import { getAllDevices, createDevice, updateDevice, deleteDevice, getAllDeviceTypes } from '../api/devices.js';
import { getAllLocations } from '../api/locations.js';

let devices = [];
let deviceTypes = [];
let locations = [];
let filterStatus = '';
let searchQuery = '';

export async function renderDevices() {
  const app = document.getElementById('app');
  app.innerHTML = `
    ${renderSidebar()}
    <main class="main-content">
      <div class="page-header">
        <h1>Dispositivos</h1>
        <p>Gestión de dispositivos de red del hospital</p>
      </div>
      <div class="table-toolbar">
        <div class="table-toolbar-left">
          <div class="search-box">
            <i data-lucide="search"></i>
            <input type="text" id="search-devices" placeholder="Buscar dispositivo..." />
          </div>
          <select class="filter-select" id="filter-status">
            <option value="">Todos los estados</option>
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
            <option value="maintenance">Mantenimiento</option>
          </select>
        </div>
        <button class="btn btn-primary" id="btn-add-device">
          <i data-lucide="plus"></i> Nuevo Dispositivo
        </button>
      </div>
      <div class="table-container" id="devices-table">
        <div class="loading-spinner"></div>
      </div>
    </main>
  `;

  if (window.lucide) lucide.createIcons();
  initSidebar();

  document.getElementById('btn-add-device').addEventListener('click', () => openDeviceModal());
  document.getElementById('search-devices').addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase();
    renderTable();
  });
  document.getElementById('filter-status').addEventListener('change', (e) => {
    filterStatus = e.target.value;
    renderTable();
  });

  await loadData();
}

async function loadData() {
  try {
    [devices, deviceTypes, locations] = await Promise.all([
      getAllDevices().catch(() => []),
      getAllDeviceTypes().catch(() => []),
      getAllLocations().catch(() => []),
    ]);
    renderTable();
  } catch (err) {
    showToast('Error al cargar datos', 'error');
  }
}

function getFiltered() {
  return devices.filter(d => {
    const matchSearch = !searchQuery || d.name.toLowerCase().includes(searchQuery) || d.ip_address.includes(searchQuery);
    const matchStatus = !filterStatus || d.status === filterStatus;
    return matchSearch && matchStatus;
  });
}

function renderTable() {
  const el = document.getElementById('devices-table');
  if (!el) return;
  const filtered = getFiltered();

  if (filtered.length === 0) {
    el.innerHTML = `<div class="empty-state"><i data-lucide="monitor-off"></i><p>No se encontraron dispositivos</p></div>`;
    if (window.lucide) lucide.createIcons();
    return;
  }

  const getTypeName = (id) => { const t = deviceTypes.find(t => t.id === id); return t ? t.name : `#${id}`; };
  const getLocName = (id) => { const l = locations.find(l => l.id === id); return l ? l.name : `#${id}`; };

  el.innerHTML = `
    <table class="data-table">
      <thead><tr><th>ID</th><th>Nombre</th><th>IP</th><th>MAC</th><th>Estado</th><th>Tipo</th><th>Ubicación</th><th>Acciones</th></tr></thead>
      <tbody>
        ${filtered.map(d => `
          <tr>
            <td class="table-id">#${d.id}</td>
            <td class="table-name">${d.name}</td>
            <td>${d.ip_address}</td>
            <td>${d.mac_address}</td>
            <td><span class="status-badge ${d.status}">${d.status}</span></td>
            <td>${getTypeName(d.device_type_id)}</td>
            <td>${getLocName(d.location_id)}</td>
            <td class="table-actions">
              <button class="btn btn-secondary btn-sm btn-edit" data-id="${d.id}"><i data-lucide="pencil"></i></button>
              <button class="btn btn-danger btn-sm btn-delete" data-id="${d.id}"><i data-lucide="trash-2"></i></button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  if (window.lucide) lucide.createIcons();

  el.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', () => {
      const d = devices.find(d => d.id === +btn.dataset.id);
      if (d) openDeviceModal(d);
    });
  });

  el.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', () => {
      const d = devices.find(d => d.id === +btn.dataset.id);
      if (d) confirmModal('Eliminar Dispositivo', `¿Estás seguro de eliminar <strong>${d.name}</strong>?`, async () => {
        try {
          await deleteDevice(d.id);
          showToast('Dispositivo eliminado', 'success');
          await loadData();
        } catch (err) { showToast(err.message, 'error'); }
      });
    });
  });
}

function openDeviceModal(device = null) {
  const isEdit = !!device;
  const title = isEdit ? 'Editar Dispositivo' : 'Nuevo Dispositivo';

  const body = `
    <div class="form-group"><label>Nombre</label><input type="text" id="m-name" value="${device?.name || ''}" placeholder="Nombre del dispositivo" /></div>
    <div class="form-group"><label>Dirección IP</label><input type="text" id="m-ip" value="${device?.ip_address || ''}" placeholder="192.168.1.1" /></div>
    <div class="form-group"><label>Dirección MAC</label><input type="text" id="m-mac" value="${device?.mac_address || ''}" placeholder="AA:BB:CC:DD:EE:FF" /></div>
    <div class="form-group"><label>Estado</label>
      <select id="m-status">
        <option value="active" ${device?.status === 'active' ? 'selected' : ''}>Activo</option>
        <option value="inactive" ${device?.status === 'inactive' ? 'selected' : ''}>Inactivo</option>
        <option value="maintenance" ${device?.status === 'maintenance' ? 'selected' : ''}>Mantenimiento</option>
      </select>
    </div>
    <div class="form-group"><label>Tipo de Dispositivo</label>
      <select id="m-type">
        <option value="">Seleccionar...</option>
        ${deviceTypes.map(t => `<option value="${t.id}" ${device?.device_type_id === t.id ? 'selected' : ''}>${t.name}</option>`).join('')}
      </select>
    </div>
    <div class="form-group"><label>Ubicación</label>
      <select id="m-location">
        <option value="">Seleccionar...</option>
        ${locations.map(l => `<option value="${l.id}" ${device?.location_id === l.id ? 'selected' : ''}>${l.name} — ${l.building}</option>`).join('')}
      </select>
    </div>
  `;

  const footer = `
    <button class="btn btn-secondary" id="m-cancel">Cancelar</button>
    <button class="btn btn-primary" id="m-save"><i data-lucide="save"></i> ${isEdit ? 'Guardar' : 'Crear'}</button>
  `;

  openModal(title, body, footer);

  document.getElementById('m-cancel').addEventListener('click', closeModal);
  document.getElementById('m-save').addEventListener('click', async () => {
    const data = {
      name: document.getElementById('m-name').value.trim(),
      ip_address: document.getElementById('m-ip').value.trim(),
      mac_address: document.getElementById('m-mac').value.trim(),
      status: document.getElementById('m-status').value,
      device_type_id: +document.getElementById('m-type').value,
      location_id: +document.getElementById('m-location').value,
    };

    if (!data.name || !data.ip_address || !data.mac_address || !data.device_type_id || !data.location_id) {
      showToast('Todos los campos son obligatorios', 'warning');
      return;
    }

    try {
      if (isEdit) {
        await updateDevice(device.id, data);
        showToast('Dispositivo actualizado', 'success');
      } else {
        await createDevice(data);
        showToast('Dispositivo creado', 'success');
      }
      closeModal();
      await loadData();
    } catch (err) { showToast(err.message, 'error'); }
  });
}
