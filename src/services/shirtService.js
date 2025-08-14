import { API_BASE_URL, handleResponse } from "./api.js";

export const shirtService = {
    getAll: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/shirts`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return await handleResponse(response);
        } catch (error) {
            console.error('Error al obtener camisetas:', error);
            throw error;
        }
    },

    getById: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/shirts/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return await handleResponse(response);
        } catch (error) {
            console.error('Error al obtener camiseta:', error);
            throw error;
        }
    },

    create: async (shirt) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/shirts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    team_id: shirt.team_id,
                    name: shirt.name,
                    description: shirt.description,
                    image: shirt.image,
                    price: parseFloat(shirt.price),
                    discount: parseInt(shirt.discount) || 0,
                    size: shirt.size
                })
            });
            return await handleResponse(response);
        } catch (error) {
            console.error('Error al crear camiseta:', error);
            throw error;
        }
    },

    update: async (id, shirt) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/shirts/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    team_id: shirt.team_id,
                    name: shirt.name,
                    description: shirt.description,
                    image: shirt.image,
                    price: parseFloat(shirt.price),
                    discount: parseInt(shirt.discount) || 0,
                    size: shirt.size
                })
            });
            return await handleResponse(response);
        } catch (error) {
            console.error('Error al actualizar camiseta:', error);
            throw error;
        }
    },

    deactivate: async (id) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/shirts/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            return await handleResponse(response);
        } catch (error) {
            console.error('Error al desactivar camiseta:', error);
            throw error;
        }
    }
};
