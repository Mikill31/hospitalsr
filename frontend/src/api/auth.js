import API, { fetchAPI } from './config.js';

export async function login(email, password) {
  return fetchAPI(`${API.AUTH}/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function register(email, password, role_id) {
  return fetchAPI(`${API.AUTH}/register`, {
    method: 'POST',
    body: JSON.stringify({ email, password, role_id }),
  });
}
