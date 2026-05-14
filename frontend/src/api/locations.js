import API, { fetchAPI } from './config.js';

export async function getAllLocations() {
  return fetchAPI(`${API.LOCATIONS}/`);
}

export async function getLocationById(id) {
  return fetchAPI(`${API.LOCATIONS}/${id}`);
}

export async function searchLocations(name) {
  return fetchAPI(`${API.LOCATIONS}/search?name=${encodeURIComponent(name)}`);
}

export async function createLocation(data) {
  return fetchAPI(`${API.LOCATIONS}/`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateLocation(id, data) {
  return fetchAPI(`${API.LOCATIONS}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteLocation(id) {
  return fetchAPI(`${API.LOCATIONS}/${id}`, { method: 'DELETE' });
}
