import API, { fetchAPI } from './config.js';

export async function getAllUsers() {
  return fetchAPI(`${API.USERS}/`);
}

export async function getUserById(id) {
  return fetchAPI(`${API.USERS}/${id}`);
}

export async function updateUser(id, data) {
  return fetchAPI(`${API.USERS}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteUser(id) {
  return fetchAPI(`${API.USERS}/${id}`, { method: 'DELETE' });
}

export async function getAllRoles() {
  return fetchAPI(`${API.USERS}/roles`);
}
