import Navigo from 'navigo';

// CAMBIO CRÍTICO: Actualizamos las rutas para apuntar a los archivos
// en sus nuevas ubicaciones y con sus nuevos nombres.
import { AuthLoginPage } from '../views/auth/AuthLoginPage.js';
import { SalasListPage } from '../views/salas/SalasListPage.js';

// La configuración del router se queda como la teníamos
export const router = new Navigo('/', { hash: true });
const app = document.getElementById('app');

export const setupRoutes = () => {
  router
    .on({
      // Las rutas ahora apuntan a las funciones con sus nuevos nombres
      'login': () => AuthLoginPage(app),
      'salas': () => SalasListPage(app),
      
      // La ruta raíz sigue funcionando igual
      '/': () => {
        const token = localStorage.getItem('token');
        if (token) {
          router.navigate('salas');
        } else {
          router.navigate('login');
        }
      }
    })
    .notFound(() => {
      app.innerHTML = '<h1>404 - Página No Encontrada</h1>';
    })
    .resolve();
};