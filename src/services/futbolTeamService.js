import { API_BASE_URL, handleResponse } from './api.js';

export const futbolTeamService = {
  getAll: async () => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/futbol_teams`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    });
    return await handleResponse(response);
  },

  create: async (team) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/futbol_teams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(team),
    });
    return await handleResponse(response);
  },

  update: async (id, team) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/futbol_teams/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(team),
    });
    return await handleResponse(response);
  },

  deactivate: async (id) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/futbol_teams/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    });
    return await handleResponse(response);
  },
};
