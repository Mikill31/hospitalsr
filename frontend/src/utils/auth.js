// Auth utility - token & user management via localStorage

export function saveToken(token) {
  localStorage.setItem('token', token);
}

export function getToken() {
  return localStorage.getItem('token');
}

export function removeToken() {
  localStorage.removeItem('token');
}

export function isAuthenticated() {
  const token = getToken();
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function getUserFromToken() {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.user_id,
      role_id: payload.role_id,
    };
  } catch {
    return null;
  }
}

export function isSuperAdmin() {
  const user = getUserFromToken();
  return user && user.role_id === 1;
}

export function getRoleName(roleId) {
  const roles = { 1: 'Super Admin', 2: 'Admin TI', 3: 'Técnico TI' };
  return roles[roleId] || 'Usuario';
}

export function logout() {
  removeToken();
  window.location.hash = '#/login';
}
