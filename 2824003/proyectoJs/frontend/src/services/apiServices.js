import { router } from '../router/index.js';

const API_URL = 'http://localhost:3006/api';

// ======================================================
// SERVICIO DE AUTENTICACIÓN
// ======================================================
export const authService = {
  login: async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Error en el inicio de sesión');
    }
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.navigate('/login');
  },
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

// ======================================================
// MANEJADOR DE PETICIONES CENTRALIZADO
// ======================================================
const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, { ...options, headers });

  // --- LÓGICA CORREGIDA ---
  if (res.status === 401) {
    authService.logout(); // Cierra la sesión y redirige al login.
    // Detenemos la promesa para evitar que el código que llamó a la función continúe y muestre un error.
    return Promise.reject(new Error('Sesión expirada')); 
  }

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Ocurrió un error en la petición.');
  }
  
  if (res.headers.get("content-length") === "0" || res.status === 204) {
      return {};
  }
  
  return res.json();
};

// ======================================================
// SERVICIOS
// ======================================================
export const salaService = {
  getAll: () => fetchWithAuth(`${API_URL}/salas`),
  getAllInactive: () => fetchWithAuth(`${API_URL}/salas/inactivas`),
  getById: (id) => fetchWithAuth(`${API_URL}/salas/${id}`),
  create: (salaData) => fetchWithAuth(`${API_URL}/salas`, { method: 'POST', body: JSON.stringify(salaData) }),
  updateById: (id, salaData) => fetchWithAuth(`${API_URL}/salas/${id}`, { method: 'PUT', body: JSON.stringify(salaData) }),
  deactivateById: (id) => fetchWithAuth(`${API_URL}/salas/${id}`, { method: 'DELETE' }),
  reactivateById: (id) => fetchWithAuth(`${API_URL}/salas/${id}/reactivate`, { method: 'PUT' }),
};

export const departamentoService = {
  getAll: () => fetchWithAuth(`${API_URL}/departamentos`),
};

export const userService = {
  getAll: () => fetchWithAuth(`${API_URL}/usuarios`),
  getById: (id) => fetchWithAuth(`${API_URL}/usuarios/${id}`),
  create: (userData) => fetchWithAuth(`${API_URL}/usuarios`, { method: 'POST', body: JSON.stringify(userData) }),
  updateById: (id, userData) => fetchWithAuth(`${API_URL}/usuarios/${id}`, { method: 'PUT', body: JSON.stringify(userData) }),
  deleteById: (id) => fetchWithAuth(`${API_URL}/usuarios/${id}`, { method: 'DELETE' }),
};

export const reservaService = {
    getAll: () => fetchWithAuth(`${API_URL}/reservas`),
    create: (reservaData) => fetchWithAuth(`${API_URL}/reservas`, { method: 'POST', body: JSON.stringify(reservaData) }),
    cancelById: (id) => fetchWithAuth(`${API_URL}/reservas/${id}`, { method: 'DELETE' }),
};
  
export const mantenimientoService = {
    getAll: () => fetchWithAuth(`${API_URL}/mantenimientos`),
    create: (mantenimientoData) => fetchWithAuth(`${API_URL}/mantenimientos`, { method: 'POST', body: JSON.stringify(mantenimientoData) }),
    deleteById: (id) => fetchWithAuth(`${API_URL}/mantenimientos/${id}`, { method: 'DELETE' }),
};

export const dashboardService = {
    getStats: () => fetchWithAuth(`${API_URL}/dashboard/stats`),
};

export const notificacionService = {
    getAll: () => fetchWithAuth(`${API_URL}/notificaciones`),
    getUnreadCount: () => fetchWithAuth(`${API_URL}/notificaciones/unread-count`),
    markAsRead: (id) => fetchWithAuth(`${API_URL}/notificaciones/${id}/read`, { method: 'PUT' }),
    markAllAsRead: () => fetchWithAuth(`${API_URL}/notificaciones/read-all`, { method: 'PUT' }),
};