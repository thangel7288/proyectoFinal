import { authService } from '../services/apiServices.js';
import { router } from '../router/index.js';
import { NotificationBell } from './NotificationBell.js';
import Swal from 'sweetalert2';

export const MainLayout = (pageComponent, activeRoute) => {
  const app = document.getElementById('app');
  const currentUser = authService.getCurrentUser();

  if (!currentUser) {
    router.navigate('/login');
    return;
  }

  const isAdmin = currentUser.rol === 'admin';

  // --- Iconos SVG ---
  const icons = {
    dashboard: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`,
    salas: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>`,
    reservas: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
    usuarios: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
    mantenimientos: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>`,
    logout: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>`,
    menu: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`,
    github: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>`,
    linkedin: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>`,
    instagram: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>`
  };

  // --- Estructura HTML del Layout ---
  app.innerHTML = `
    <div class="app-layout">
      <!-- Barra Lateral -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <span class="logo-text">Salas</span>
        </div>
        <ul class="sidebar-nav">
          ${isAdmin ? `<li><a href="/dashboard" data-navigo class="nav-link ${activeRoute === 'dashboard' ? 'active' : ''}">${icons.dashboard}<span class="nav-text">Dashboard</span></a></li>` : ''}
          <li><a href="/salas" data-navigo class="nav-link ${activeRoute === 'salas' ? 'active' : ''}">${icons.salas}<span class="nav-text">Salas</span></a></li>
          <li><a href="/reservas" data-navigo class="nav-link ${activeRoute === 'reservas' ? 'active' : ''}">${icons.reservas}<span class="nav-text">Mis Reservas</span></a></li>
          ${isAdmin ? `<li><a href="/usuarios" data-navigo class="nav-link ${activeRoute === 'usuarios' ? 'active' : ''}">${icons.usuarios}<span class="nav-text">Usuarios</span></a></li>` : ''}
          ${isAdmin ? `<li><a href="/mantenimientos" data-navigo class="nav-link ${activeRoute === 'mantenimientos' ? 'active' : ''}">${icons.mantenimientos}<span class="nav-text">Mantenimientos</span></a></li>` : ''}
        </ul>
        <!-- Footer de la Sidebar SIN botón de logout -->
        <div class="sidebar-footer">
          <div class="user-info">
            <p>${currentUser.nombre}</p>
            <small>${currentUser.rol}</small>
          </div>
        </div>
      </aside>

      <!-- Contenido Principal -->
      <div class="main-container-wrapper">
        <!-- Barra Superior con el NUEVO botón de logout -->
        <header class="top-bar">
          <button id="menu-toggle-btn">${icons.menu}</button>
          <div class="top-bar-right">
            <div id="notification-bell-container"></div>
            <button id="logout-btn-header" class="btn btn-secondary">${icons.logout} <span>Cerrar Sesión</span></button>
          </div>
        </header>
        
        <!-- Contenido de la Página -->
        <main class="page-content" id="page-content-container">
          <!-- El contenido de cada página se inyectará aquí -->
        </main>
        
        <!-- Footer -->
        <footer class="page-footer">
          <div class="footer-content">
            <div class="footer-contact">
              <p>Desarrollado por angel lizarazo</p>
              <p>Contáctanos: 3142708116</p>
            </div>
            <div class="footer-socials">
              <a href="https://github.com/tu-usuario" target="_blank" title="GitHub">${icons.github}</a>
              <a href="https://linkedin.com/in/tu-usuario" target="_blank" title="LinkedIn">${icons.linkedin}</a>
              <a href="https://instagram.com/tu-usuario" target="_blank" title="Instagram">${icons.instagram}</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  `;

  // --- Lógica del Layout ---
  const pageContentContainer = document.getElementById('page-content-container');
  pageComponent(pageContentContainer);

  // Lógica para el NUEVO botón de logout en la barra superior
  document.getElementById('logout-btn-header').addEventListener('click', (e) => {
    e.preventDefault();
    authService.logout();
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Sesión cerrada exitosamente',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true
    });
    setTimeout(() => {
      router.navigate('/login');
    }, 1500);
  });

  const sidebar = document.querySelector('.sidebar');
  document.getElementById('menu-toggle-btn').addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
  });

  NotificationBell.init('#notification-bell-container');
  router.updatePageLinks();
};
