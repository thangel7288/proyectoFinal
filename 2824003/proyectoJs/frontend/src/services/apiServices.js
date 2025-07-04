// frontend/src/services/apiServices.js

const API_URL = 'http://localhost:3006/api';

// ======================================================
// SERVICIO DE AUTENTICACIÓN (Sin cambios)
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
  },
  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  }
};

// ======================================================
// FUNCIÓN DE AYUDA PARA HEADERS (Sin cambios)
// ======================================================
const createAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.hash = '/login';
    return;
  }
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// ======================================================
// SERVICIOS EXISTENTES (Sin cambios)
// ======================================================
export const salaService = { /* ... código existente ... */ 
  getAll: async () => {
    const res = await fetch(`${API_URL}/salas`, { headers: createAuthHeaders() });
    if (!res.ok) { const d = await res.json(); throw new Error(d.message || 'Error al obtener las salas');}
    return res.json();
  },
  getById: async (id) => {
    const res = await fetch(`${API_URL}/salas/${id}`, { headers: createAuthHeaders() });
    if (!res.ok) { const d = await res.json(); throw new Error(d.message || 'Error al obtener la sala');}
    return res.json();
  },
  create: async (salaData) => {
    const res = await fetch(`${API_URL}/salas`, { method: 'POST', headers: createAuthHeaders(), body: JSON.stringify(salaData) });
    if (!res.ok) { const d = await res.json(); throw new Error(d.message || 'Error al crear la sala');}
    return res.json();
  },
  updateById: async (id, salaData) => {
    const res = await fetch(`${API_URL}/salas/${id}`, { method: 'PUT', headers: createAuthHeaders(), body: JSON.stringify(salaData) });
    if (!res.ok) { const d = await res.json(); throw new Error(d.message || 'Error al actualizar la sala');}
    return res.json();
  },
  deleteById: async (id) => {
    const res = await fetch(`${API_URL}/salas/${id}`, { method: 'DELETE', headers: createAuthHeaders() });
    if (!res.ok) { const d = await res.json(); throw new Error(d.message || 'Error al eliminar la sala');}
    return res.json();
  }
};
export const userService = { /* ... código existente ... */ 
  getAll: async () => {
    const res = await fetch(`${API_URL}/usuarios`, { headers: createAuthHeaders() });
    if (!res.ok) { const d = await res.json(); throw new Error(d.message || 'Error al obtener los usuarios');}
    return res.json();
  },
  getById: async (id) => {
    const res = await fetch(`${API_URL}/usuarios/${id}`, { headers: createAuthHeaders() });
    if (!res.ok) { const d = await res.json(); throw new Error(d.message || 'Error al obtener el usuario');}
    return res.json();
  },
  create: async (userData) => {
    const res = await fetch(`${API_URL}/usuarios`, { method: 'POST', headers: createAuthHeaders(), body: JSON.stringify(userData) });
    if (!res.ok) { const d = await res.json(); throw new Error(d.message || 'Error al crear el usuario');}
    return res.json();
  },
  updateById: async (id, userData) => {
    const res = await fetch(`${API_URL}/usuarios/${id}`, { method: 'PUT', headers: createAuthHeaders(), body: JSON.stringify(userData) });
    if (!res.ok) { const d = await res.json(); throw new Error(d.message || 'Error al actualizar el usuario');}
    return res.json();
  },
  deleteById: async (id) => {
    const res = await fetch(`${API_URL}/usuarios/${id}`, { method: 'DELETE', headers: createAuthHeaders() });
    if (!res.ok) { const d = await res.json(); throw new Error(d.message || 'Error al eliminar el usuario');}
    return res.json();
  }
};
export const reservaService = { /* ... código existente ... */ 
  getAll: async () => {
    const res = await fetch(`${API_URL}/reservas`, { headers: createAuthHeaders() });
    if (!res.ok) { const d = await res.json(); throw new Error(d.message || 'Error al obtener las reservas');}
    return res.json();
  },
  create: async (reservaData) => {
    const res = await fetch(`${API_URL}/reservas`, { method: 'POST', headers: createAuthHeaders(), body: JSON.stringify(reservaData) });
    if (!res.ok) { const d = await res.json(); throw new Error(d.message || 'Error al crear la reserva');}
    return res.json();
  },
  cancelById: async (id) => {
    const res = await fetch(`${API_URL}/reservas/${id}`, { method: 'DELETE', headers: createAuthHeaders() });
    if (!res.ok) { const d = await res.json(); throw new Error(d.message || 'Error al cancelar la reserva');}
    return res.json();
  }
};
export const dashboardService = { /* ... código existente ... */ 
  getStats: async () => {
    const res = await fetch(`${API_URL}/dashboard/stats`, { headers: createAuthHeaders() });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Error al obtener las estadísticas');
    }
    return res.json();
  }
};
export const mantenimientoService = { /* ... código existente ... */ 
  getAll: async () => {
    const res = await fetch(`${API_URL}/mantenimientos`, { headers: createAuthHeaders() });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Error al obtener los mantenimientos');
    }
    return res.json();
  },
  create: async (mantenimientoData) => {
    const res = await fetch(`${API_URL}/mantenimientos`, {
      method: 'POST',
      headers: createAuthHeaders(),
      body: JSON.stringify(mantenimientoData)
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Error al programar el mantenimiento');
    }
    return res.json();
  },
  deleteById: async (id) => {
    const res = await fetch(`${API_URL}/mantenimientos/${id}`, {
      method: 'DELETE',
      headers: createAuthHeaders()
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Error al eliminar el mantenimiento');
    }
    return res.json();
  }
};

// ======================================================
// NUEVO SERVICIO DE NOTIFICACIONES
// ======================================================
export const notificacionService = {
  /**
   * Obtiene las notificaciones del usuario.
   */
  getAll: async () => {
    const res = await fetch(`${API_URL}/notificaciones`, { headers: createAuthHeaders() });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Error al obtener las notificaciones');
    }
    return res.json();
  },

  /**
   * Obtiene el contador de notificaciones no leídas.
   */
  getUnreadCount: async () => {
    const res = await fetch(`${API_URL}/notificaciones/unread-count`, { headers: createAuthHeaders() });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Error al obtener el contador');
    }
    return res.json();
  },

  /**
   * Marca una notificación como leída.
   * @param {number} id - El ID de la notificación.
   */
  markAsRead: async (id) => {
    const res = await fetch(`${API_URL}/notificaciones/${id}/read`, {
      method: 'PUT',
      headers: createAuthHeaders()
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Error al marcar como leída');
    }
    return res.json();
  },

  /**
   * Marca todas las notificaciones como leídas.
   */
  markAllAsRead: async () => {
    const res = await fetch(`${API_URL}/notificaciones/read-all`, {
      method: 'PUT',
      headers: createAuthHeaders()
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Error al marcar todas como leídas');
    }
    return res.json();
  }
};