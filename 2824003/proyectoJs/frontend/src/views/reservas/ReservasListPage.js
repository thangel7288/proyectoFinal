import { reservaService, authService } from '../../services/apiServices.js';
import { router } from '../../router/index.js';
import Swal from 'sweetalert2';

/**
 * Componente de página que renderiza la lista de reservas en una tabla.
 * @param {HTMLElement} container - El elemento donde se inyectará el contenido.
 */
export const ReservasListPage = (container) => {
  const currentUser = authService.getCurrentUser();
  const esAdminOAsistente = currentUser.rol === 'admin' || currentUser.rol === 'asistente';
  const pageTitle = esAdminOAsistente ? 'Gestión de Todas las Reservas' : 'Mis Reservas';

  container.innerHTML = `
    <div class="reservas-page-container">
      <div class="reservas-page-header">
        <h1>${pageTitle}</h1>
      </div>
      <div id="reservas-list-content" class="content-area">
        <p>Cargando reservas...</p>
      </div>
    </div>
  `;

  const reservasListContent = document.getElementById('reservas-list-content');

  reservasListContent.addEventListener('click', async (e) => {
    if (e.target.matches('.btn-cancel')) {
      const row = e.target.closest('tr');
      const reservaId = row.dataset.id;

      const result = await Swal.fire({
        title: '¿Estás seguro?', text: "Esta acción cancelará la reserva.", icon: 'warning',
        showCancelButton: true, confirmButtonText: 'Sí, ¡cancélala!'
      });

      if (result.isConfirmed) {
        try {
          await reservaService.cancelById(reservaId);
          // Actualizar la UI para reflejar la cancelación
          const statusCell = row.querySelector('.status-cell');
          statusCell.innerHTML = `<span class="status-badge status-cancelada">cancelada</span>`;
          e.target.remove(); // Eliminar el botón de cancelar
          Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Reserva cancelada', showConfirmButton: false, timer: 2000 });
        } catch (error) {
          Swal.fire('Error', error.message, 'error');
        }
      }
    }
  });

  const loadReservas = async () => {
    try {
      const reservas = await reservaService.getAll();
      if (!reservas || reservas.length === 0) {
        reservasListContent.innerHTML = '<p>No hay reservas para mostrar.</p>';
        return;
      }
      reservasListContent.innerHTML = `
        <table class="reservas-table">
          <thead>
            <tr>
              <th>Sala</th>
              <th>Motivo</th>
              ${esAdminOAsistente ? '<th>Usuario</th>' : ''}
              <th>Inicio</th>
              <th>Fin</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${reservas.map(reserva => `
              <tr data-id="${reserva.id}">
                <td>${reserva.sala_nombre}</td>
                <td>${reserva.motivo}</td>
                ${esAdminOAsistente ? `<td>${reserva.usuario_nombre}</td>` : ''}
                <td>${new Date(reserva.fecha_inicio).toLocaleString()}</td>
                <td>${new Date(reserva.fecha_fin).toLocaleString()}</td>
                <td class="status-cell">
                  <span class="status-badge status-${reserva.estado}">${reserva.estado}</span>
                </td>
                <td>
                  ${reserva.estado === 'confirmada' ? `<button class="btn btn-danger btn-cancel">Cancelar</button>` : ''}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } catch (error) {
      Swal.fire('Error', 'No se pudieron cargar las reservas. ' + error.message, 'error');
    }
  };

  loadReservas();
};