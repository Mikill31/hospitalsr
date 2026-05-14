// Dashboard page
import { renderSidebar, initSidebar } from '../components/sidebar.js';
import { getAllDevices } from '../api/devices.js';
import { getAllLocations } from '../api/locations.js';

export async function renderDashboard() {
  const app = document.getElementById('app');
  app.innerHTML = `
    ${renderSidebar()}
    <main class="main-content">
      <div class="page-header">
        <h1>Dashboard</h1>
        <p>Resumen general del sistema hospitalario</p>
      </div>
      <div class="dashboard-stats" id="dashboard-stats">
        <div class="stat-card"><div class="loading-spinner"></div></div>
      </div>
      <div class="dashboard-section">
        <div class="section-header">
          <h2>Dispositivos Recientes</h2>
          <a href="#/devices">Ver todos →</a>
        </div>
        <div class="table-container" id="recent-devices">
          <div class="loading-spinner"></div>
        </div>
      </div>
    </main>
  `;

  if (window.lucide) lucide.createIcons();
  initSidebar();
  loadDashboardData();
}

async function loadDashboardData() {
  try {
    let devices = [], locations = [];
    try { devices = await getAllDevices(); } catch(e) { devices = []; }
    try { locations = await getAllLocations(); } catch(e) { locations = []; }

    const active = devices.filter(d => d.status === 'active').length;
    const inactive = devices.filter(d => d.status === 'inactive').length;
    const maintenance = devices.filter(d => d.status === 'maintenance').length;

    const statsEl = document.getElementById('dashboard-stats');
    if (!statsEl) return;

    statsEl.innerHTML = `
      <div class="stat-card">
        <div class="stat-icon cyan"><i data-lucide="monitor"></i></div>
        <div class="stat-info">
          <h3>${devices.length}</h3>
          <p>Total Dispositivos</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon green"><i data-lucide="check-circle-2"></i></div>
        <div class="stat-info">
          <h3>${active}</h3>
          <p>Activos</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon red"><i data-lucide="x-circle"></i></div>
        <div class="stat-info">
          <h3>${inactive}</h3>
          <p>Inactivos</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon yellow"><i data-lucide="wrench"></i></div>
        <div class="stat-info">
          <h3>${maintenance}</h3>
          <p>En Mantenimiento</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon blue"><i data-lucide="map-pin"></i></div>
        <div class="stat-info">
          <h3>${locations.length}</h3>
          <p>Ubicaciones</p>
        </div>
      </div>
    `;

    // Recent devices table
    const recentEl = document.getElementById('recent-devices');
    if (!recentEl) return;

    if (devices.length === 0) {
      recentEl.innerHTML = `
        <div class="empty-state">
          <i data-lucide="monitor-off"></i>
          <p>No hay dispositivos registrados</p>
        </div>
      `;
    } else {
      const recent = devices.slice(0, 8);
      recentEl.innerHTML = `
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>IP</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            ${recent.map(d => `
              <tr>
                <td class="table-id">#${d.id}</td>
                <td class="table-name">${d.name}</td>
                <td>${d.ip_address}</td>
                <td><span class="status-badge ${d.status}">${d.status}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    if (window.lucide) lucide.createIcons();
  } catch (err) {
    console.error('Dashboard error:', err);
  }
}
