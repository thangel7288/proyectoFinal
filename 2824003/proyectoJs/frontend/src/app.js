import { setupRoutes } from './router/index.js';

// Cuando el DOM esté completamente cargado, inicializamos las rutas.
document.addEventListener('DOMContentLoaded', () => {
  setupRoutes();
});