// Main entry point - SPA Router setup
import './styles/index.css';
import './styles/login.css';
import './styles/components.css';
import './styles/dashboard.css';
import './styles/tables.css';

import { registerRoute, startRouter } from './utils/router.js';
import { isAuthenticated } from './utils/auth.js';
import { renderLogin } from './pages/login.js';
import { renderDashboard } from './pages/dashboard.js';
import { renderDevices } from './pages/devices.js';
import { renderDeviceTypes } from './pages/deviceTypes.js';
import { renderLocations } from './pages/locations.js';
import { renderUsers } from './pages/users.js';

// Auth guard wrapper
function withAuth(renderFn) {
  return async () => {
    if (!isAuthenticated()) {
      window.location.hash = '#/login';
      return;
    }
    return renderFn();
  };
}

// Register routes
registerRoute('/login', renderLogin);
registerRoute('/dashboard', withAuth(renderDashboard));
registerRoute('/devices', withAuth(renderDevices));
registerRoute('/device-types', withAuth(renderDeviceTypes));
registerRoute('/locations', withAuth(renderLocations));
registerRoute('/users', withAuth(renderUsers));

// Start router
startRouter();

// Default redirect
if (!window.location.hash) {
  window.location.hash = isAuthenticated() ? '#/dashboard' : '#/login';
}
