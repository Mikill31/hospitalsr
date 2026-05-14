import API, { fetchAPI } from './config.js';

export async function getAllDevices() {
  return fetchAPI(`${API.DEVICES}/`);
}

export async function getDeviceById(id) {
  return fetchAPI(`${API.DEVICES}/${id}`);
}

export async function searchDevices(name) {
  return fetchAPI(`${API.DEVICES}/search?name=${encodeURIComponent(name)}`);
}

export async function createDevice(data) {
  return fetchAPI(`${API.DEVICES}/`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateDevice(id, data) {
  return fetchAPI(`${API.DEVICES}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function patchDevice(id, data) {
  return fetchAPI(`${API.DEVICES}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteDevice(id) {
  return fetchAPI(`${API.DEVICES}/${id}`, { method: 'DELETE' });
}

export async function getAllDeviceTypes() {
  return fetchAPI(`${API.DEVICES}/types`);
}

export async function createDeviceType(data) {
  return fetchAPI(`${API.DEVICES}/types`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
