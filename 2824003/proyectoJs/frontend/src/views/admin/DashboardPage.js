import { dashboardService, authService } from '../../services/apiServices.js';
import { router } from '../../router/index.js';
import Swal from 'sweetalert2';
// No es necesario importar NotificationBell aquí, MainLayout se encarga de eso.

/**
 * Componente de página que renderiza el Dashboard del admin.
 * Ahora recibe un 'container' del MainLayout donde debe renderizarse.
 * @param {HTMLElement} container - El elemento donde se inyectará el contenido.
 */
export const DashboardPage = (container) => {
  const currentUser = authService.getCurrentUser();
  // Doble chequeo de seguridad
  if (!currentUser || currentUser.rol !== 'admin') {
    router.navigate('/salas');
    return;
  }

  // Estilos CSS específicos para el contenido del Dashboard
  const styles = `
    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    .stat-card {
      background-color: #ffffff;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      text-align: center;
      border: 1px solid #e0e0e0;
    }
    .stat-card h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.1rem;
      color: #555;
      font-weight: 600;
    }
    .stat-card .stat-number {
      font-size: 2.5rem;
      font-weight: 700;
      color: #333;
      line-height: 1;
    }
    .activity-section h3 {
      border-bottom: 2px solid #f0f0f0;
      padding-bottom: 0.5rem;
      margin-bottom: 1rem;
    }
    .activity-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
      background-color: #fff;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      border-radius: 8px;
      overflow: hidden;
    }
    .activity-table th, .activity-table td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #e0e0e0;
    }
    .activity-table th {
      background-color: #f9fafb;
      font-weight: 600;
      color: #374151;
    }
    .activity-table tbody tr:last-child td {
      border-bottom: none;
    }
  `;

  // HTML específico de esta página. Ya no contiene la estructura general.
  container.innerHTML = `
    <style>${styles}</style>
    <div class="page-header">
      <h1>Panel de Administrador</h1>
      <p>Resumen general del sistema.</p>
    </div>
    <div id="dashboard-content-area" class="content-area">
      <p>Cargando estadísticas...</p>
    </div>
  `;

  // --- LÓGICA PARA CARGAR DATOS DEL DASHBOARD ---
  const loadDashboardData = async () => {
    try {
      const stats = await dashboardService.getStats();
      const dashboardContent = document.getElementById('dashboard-content-area');

      dashboardContent.innerHTML = `
        <div class="dashboard-grid">
          <div class="stat-card">
            <h3>Total de Usuarios</h3>
            <p class="stat-number">${stats.totalUsuarios}</p>
          </div>
          <div class="stat-card">
            <h3>Total de Salas</h3>
            <p class="stat-number">${stats.totalSalas}</p>
          </div>
          <div class="stat-card">
            <h3>Reservas Activas</h3>
            <p class="stat-number">${stats.reservasActivas}</p>
          </div>
          <div class="stat-card">
            <h3>Sala Más Popular</h3>
            <p class="stat-number" style="font-size: 1.5rem; padding-top: 0.5rem;">${stats.salaMasReservada}</p>
          </div>
        </div>

        <div class="activity-section">
          <h3>Actividad Reciente</h3>
          <table class="activity-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Sala</th>
                <th>Motivo</th>
                <th>Fecha de Inicio</th>
              </tr>
            </thead>
            <tbody>
              ${stats.actividadReciente.map(act => `
                <tr>
                  <td>${act.usuario_nombre}</td>
                  <td>${act.sala_nombre}</td>
                  <td>${act.motivo}</td>
                  <td>${new Date(act.fecha_inicio).toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    } catch (error) {
      Swal.fire('Error', 'No se pudieron cargar las estadísticas del dashboard. ' + error.message, 'error');
    }
  };

  loadDashboardData();
};
