// API Configuration - Base URLs for each microservice
const API = {
  AUTH: 'http://localhost:5006/auth',
  USERS: 'http://localhost:5001/users',
  DEVICES: 'http://localhost:5002/devices',
  LOCATIONS: 'http://localhost:5003/locations',
};

export function getToken() {
  return localStorage.getItem('token');
}

export function getHeaders() {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export async function fetchAPI(url, options = {}) {
  try {
    const res = await fetch(url, {
      ...options,
      headers: { ...getHeaders(), ...options.headers },
    });
    const data = await res.json();
    if (!res.ok) {
      throw { status: res.status, message: data.error || data.message || 'Error desconocido' };
    }
    return data;
  } catch (err) {
    if (err.status) throw err;
    throw { status: 0, message: 'No se pudo conectar con el servidor' };
  }
}

export default API;
