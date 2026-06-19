/**
 * API Integration Layer (pre-requisite: Axios, REST APIs, Error Handling)
 * All backend communication is centralized here — no fetch/axios calls in components
 * Base URL points to .NET Web API
 */

import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

// Axios instance with base config
const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ─────────────────────────────────────────────────────────────────────────────
// USER API FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/** GET /api/users — fetch all users */
export const getAllUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

/** POST /api/users — create new user */
export const createUser = async (userData) => {
  const response = await api.post('/users', userData);
  return response.data;
};

/** PUT /api/users/:id — update user */
export const updateUser = async (id, userData) => {
  const response = await api.put(`/users/${id}`, userData);
  return response.data;
};

/** DELETE /api/users/:id — delete user */
export const deleteUser = async (id) => {
  await api.delete(`/users/${id}`);
};

export default api;
