import { reservaService, authService } from '../../services/apiServices.js';
import { router } from '../../router/index.js';
import Swal from 'sweetalert2';

export const ReservasListPage = (app) => {
  const currentUser = authService.getCurrentUser();
  if (!currentUser) {
    router.navigate('/login');
    return;
  }

  const esAdminOAsistente = currentUser.rol === 'admin' || currentUser.rol === 'asistente';
  const pageTitle = esAdminOAsistente ? 'Gestión de Todas las Reservas' : 'Mis Reservas';

  app.innerHTML = `
    <div class="main-container reservas-container">
      <h2>${pageTitle}</h2>
      <div class="main-actions">
        <button id="volver-salas-btn" class="btn-secondary">Volver a Salas</button>
      </div>
      <hr>
      <div id="reservas-list"><p>Cargando reservas...</p></div>
    </div>
  `;

  document.getElementById('volver-salas-btn').addEventListener('click', () => {
    router.navigate('/salas');
  });

  const reservasListDiv = document.getElementById('reservas-list');

  // --- Lógica para Cancelar una Reserva ---
  reservasListDiv.addEventListener('click', async (e) => {
    if (e.target.classList.contains('btn-cancel')) {
      const reservaElement = e.target.closest('li');
      const reservaId = reservaElement.dataset.id;

      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción cancelará la reserva.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Sí, ¡cancélala!'
      });

      if (result.isConfirmed) {
        try {
          await reservaService.cancelById(reservaId);
          // Actualizar la UI para reflejar la cancelación
          const estadoSpan = reservaElement.querySelector('.reserva-estado');
          estadoSpan.textContent = 'Cancelada';
          estadoSpan.className = 'reserva-estado cancelada';
          e.target.remove(); // Eliminar el botón de cancelar
          Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Reserva cancelada', showConfirmButton: false, timer: 2000 });
        } catch (error) {
          Swal.fire('Error', error.message, 'error');
        }
      }
    }
  });

  // --- Función para Cargar y Mostrar las Reservas ---
  const loadReservas = async () => {
    try {
      const reservas = await reservaService.getAll();
      if (reservas.length === 0) {
        reservasListDiv.innerHTML = '<p>No hay reservas para mostrar.</p>';
        return;
      }
      reservasListDiv.innerHTML = `
        <ul class="lista-items">
          ${reservas.map(reserva => `
            <li data-id="${reserva.id}" class="reserva-item">
              <div class="item-info">
                <strong>${reserva.sala_nombre}</strong>
                <span>Motivo: ${reserva.motivo}</span>
                <small>
                  Del: ${new Date(reserva.fecha_inicio).toLocaleString()} 
                  Al: ${new Date(reserva.fecha_fin).toLocaleString()}
                </small>
                ${esAdminOAsistente ? `<small>Reservado por: ${reserva.usuario_nombre}</small>` : ''}
              </div>
              <div class="item-actions">
                <span class="reserva-estado ${reserva.estado}">${reserva.estado}</span>
                ${reserva.estado === 'confirmada' ? `<button class="btn-cancel">Cancelar</button>` : ''}
              </div>
            </li>
          `).join('')}
        </ul>
      `;
    } catch (error) {
      Swal.fire('Error', 'No se pudieron cargar las reservas. ' + error.message, 'error');
    }
  };

  loadReservas();
};