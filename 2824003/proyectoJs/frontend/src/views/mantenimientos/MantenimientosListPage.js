import { mantenimientoService, authService } from '../../services/apiServices.js';
import { router } from '../../router/index.js';
import Swal from 'sweetalert2';

/**
 * Componente de página que renderiza la lista de mantenimientos en una tabla.
 * @param {HTMLElement} container - El elemento donde se inyectará el contenido.
 */
export const MantenimientosListPage = (container) => {
  const currentUser = authService.getCurrentUser();
  if (!currentUser || currentUser.rol !== 'admin') {
    router.navigate('/salas');
    return;
  }

  container.innerHTML = `
    <div class="mantenimientos-page-container">
      <div class="mantenimientos-page-header">
        <h1>Gestión de Mantenimientos</h1>
        <button id="crear-mantenimiento-btn" class="btn btn-primary">Programar Mantenimiento</button>
      </div>
      <div id="mantenimientos-list-content" class="content-area">
        <p>Cargando mantenimientos...</p>
      </div>
    </div>
  `;

  const mantenimientosListContent = document.getElementById('mantenimientos-list-content');
  document.getElementById('crear-mantenimiento-btn').addEventListener('click', () => router.navigate('/mantenimientos/crear'));

  mantenimientosListContent.addEventListener('click', async (e) => {
    if (e.target.matches('.btn-delete')) {
      const row = e.target.closest('tr');
      const mantenimientoId = row.dataset.id;

      const result = await Swal.fire({
        title: '¿Estás seguro?', text: "Esta acción eliminará el mantenimiento programado.", icon: 'warning',
        showCancelButton: true, confirmButtonText: 'Sí, ¡elimínalo!'
      });

      if (result.isConfirmed) {
        try {
          await mantenimientoService.deleteById(mantenimientoId);
          row.remove();
          Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Mantenimiento eliminado', showConfirmButton: false, timer: 2000 });
        } catch (error) {
          Swal.fire('Error', error.message, 'error');
        }
      }
    }
  });

  const loadMantenimientos = async () => {
    try {
      const mantenimientos = await mantenimientoService.getAll();
      if (!mantenimientos || mantenimientos.length === 0) {
        mantenimientosListContent.innerHTML = '<p>No hay mantenimientos programados.</p>';
        return;
      }
      mantenimientosListContent.innerHTML = `
        <table class="mantenimientos-table">
          <thead>
            <tr>
              <th>Sala</th>
              <th>Motivo</th>
              <th>Inicio</th>
              <th>Fin</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${mantenimientos.map(mantenimiento => `
              <tr data-id="${mantenimiento.id}">
                <td>${mantenimiento.sala_nombre}</td>
                <td>${mantenimiento.motivo}</td>
                <td>${new Date(mantenimiento.fecha_inicio).toLocaleString()}</td>
                <td>${new Date(mantenimiento.fecha_fin).toLocaleString()}</td>
                <td>
                  <button class="btn btn-danger btn-delete">Eliminar</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } catch (error) {
      Swal.fire('Error', 'No se pudieron cargar los mantenimientos. ' + error.message, 'error');
    }
  };

  loadMantenimientos();
};