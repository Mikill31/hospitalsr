// Simple hash-based SPA router

const routes = {};
let currentCleanup = null;

export function registerRoute(path, handler) {
  routes[path] = handler;
}

export function navigateTo(path) {
  window.location.hash = `#${path}`;
}

export function startRouter() {
  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}

async function handleRoute() {
  const hash = window.location.hash.slice(1) || '/login';

  // cleanup previous page
  if (currentCleanup && typeof currentCleanup === 'function') {
    currentCleanup();
    currentCleanup = null;
  }

  const handler = routes[hash];
  if (handler) {
    currentCleanup = await handler();
  } else {
    // fallback to login
    window.location.hash = '#/login';
  }
}

export function getCurrentRoute() {
  return window.location.hash.slice(1) || '/login';
}
