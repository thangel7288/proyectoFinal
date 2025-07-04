import Navigo from 'navigo';
// --- RUTAS CORREGIDAS ---
// Usamos rutas absolutas desde la raíz del proyecto (la carpeta 'frontend')
// para evitar problemas de resolución.
import { authService } from '/src/services/apiServices.js';
import { MainLayout } from '/src/components/MainLayout.js';

// --- VISTAS ---
import { AuthLoginPage } from '/src/views/auth/AuthLoginPage.js';
import { DashboardPage } from '/src/views/admin/DashboardPage.js';
import { UsersListPage } from '/src/views/usuarios/UsersListPage.js';
import { UserCreatePage } from '/src/views/usuarios/UserCreatePage.js';
import { UserEditPage } from '/src/views/usuarios/UserEditPage.js';
import { SalasListPage } from '/src/views/salas/SalasListPage.js';
import { SalaCreatePage } from '/src/views/salas/SalaCreatePage.js';
import { SalaEditPage } from '/src/views/salas/SalaEditPage.js';
import { ReservasListPage } from '/src/views/reservas/ReservasListPage.js';
import { ReservaCreatePage } from '/src/views/reservas/ReservaCreatePage.js';
import { MantenimientosListPage } from '/src/views/mantenimientos/MantenimientosListPage.js';
import { MantenimientoCreatePage } from '/src/views/mantenimientos/MantenimientoCreatePage.js';

export const router = new Navigo('/', { hash: true });

export const setupRoutes = () => {
  const app = document.getElementById('app');

  const routes = {
    // La página de Login no usa el layout principal
    '/login': () => {
      app.innerHTML = ''; // Limpiamos el layout anterior si existía
      AuthLoginPage(app);
    },
    
    // Rutas que usarán el nuevo MainLayout
    // Pasamos el componente de la página y un nombre para resaltar el menú
    '/dashboard': () => MainLayout(DashboardPage, 'dashboard'),
    '/salas': () => MainLayout(SalasListPage, 'salas'),
    '/reservas': () => MainLayout(ReservasListPage, 'reservas'),
    '/usuarios': () => MainLayout(UsersListPage, 'usuarios'),
    '/mantenimientos': () => MainLayout(MantenimientosListPage, 'mantenimientos'),
    
    // Rutas con parámetros (Crear/Editar)
    '/salas/crear': () => MainLayout(SalaCreatePage, 'salas'),
    '/salas/editar/:id': (params) => MainLayout((container) => SalaEditPage(container, params.data.id), 'salas'),
    '/reservas/crear/:salaId': (params) => MainLayout((container) => ReservaCreatePage(container, params.data.salaId), 'salas'),
    '/usuarios/crear': () => MainLayout(UserCreatePage, 'usuarios'),
    '/usuarios/editar/:id': (params) => MainLayout((container) => UserEditPage(container, params.data.id), 'usuarios'),
    '/mantenimientos/crear': () => MainLayout(MantenimientoCreatePage, 'mantenimientos'),
    
    // Ruta Raíz Inteligente
    '/': () => {
      const user = authService.getCurrentUser();
      if (user) {
        router.navigate(user.rol === 'admin' ? '/dashboard' : '/salas');
      } else {
        router.navigate('/login');
      }
    }
  };

  router.on(routes).resolve();

  router.notFound(() => {
    app.innerHTML = '<h1>404 - Página No Encontrada</h1>';
  }).resolve();
};
