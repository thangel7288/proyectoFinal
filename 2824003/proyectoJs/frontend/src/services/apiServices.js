const API_URL = 'http://localhost:3001/api';

export const authService = {
  login: async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
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

export const salaService = {
  getAll: async () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No hay token de autenticación.');
    const res = await fetch(`${API_URL}/salas`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Error al obtener las salas');
    }
    return res.json();
  },
};