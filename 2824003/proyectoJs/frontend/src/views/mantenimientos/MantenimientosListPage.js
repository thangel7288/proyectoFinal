import { mantenimientoService, authService } from '../../services/apiServices.js';
import { router } from '../../router/index.js';
import Swal from 'sweetalert2';

export const MantenimientosListPage = (app) => {
  const currentUser = authService.getCurrentUser();
  if (!currentUser || currentUser.rol !== 'admin') {
    router.navigate('/salas');
    return;
  }

  app.innerHTML = `
    <div class="main-container mantenimientos-container">
      <h2>Gestión de Mantenimientos</h2>
      <p>Programa o revisa los períodos de mantenimiento de las salas.</p>
      <nav class="main-actions">
        <button data-navigate="/dashboard">Dashboard</button>
        <button data-navigate="/salas">Salas</button>
        <button data-navigate="/reservas">Reservas</button>
        <button data-navigate="/usuarios">Usuarios</button>
        <button data-navigate="/mantenimientos" class="active">Mantenimientos</button>
      </nav>
      <hr>
      <div class="page-actions">
        <button id="crear-mantenimiento-btn" class="btn-primary">Programar Nuevo Mantenimiento</button>
      </div>
      <h3>Mantenimientos Programados</h3>
      <div id="mantenimientos-list"><p>Cargando mantenimientos...</p></div>
    </div>
  `;

  // --- Lógica de Eventos ---
  document.querySelector('.main-actions').addEventListener('click', (e) => {
    if (e.target.matches('[data-navigate]')) {
      router.navigate(e.target.dataset.navigate);
    }
  });

  document.getElementById('crear-mantenimiento-btn').addEventListener('click', () => {
    router.navigate('/mantenimientos/crear');
  });

  const mantenimientosListDiv = document.getElementById('mantenimientos-list');
  mantenimientosListDiv.addEventListener('click', async (e) => {
    if (e.target.classList.contains('btn-delete')) {
      const mantenimientoElement = e.target.closest('li');
      const mantenimientoId = mantenimientoElement.dataset.id;

      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción eliminará el mantenimiento programado.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, ¡elimínalo!'
      });

      if (result.isConfirmed) {
        try {
          await mantenimientoService.deleteById(mantenimientoId);
          mantenimientoElement.remove();
          Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Mantenimiento eliminado', showConfirmButton: false, timer: 2000 });
        } catch (error) {
          Swal.fire('Error', error.message, 'error');
        }
      }
    }
  });

  // --- Función para Cargar y Mostrar los Mantenimientos ---
  const loadMantenimientos = async () => {
    try {
      const mantenimientos = await mantenimientoService.getAll();
      if (mantenimientos.length === 0) {
        mantenimientosListDiv.innerHTML = '<p>No hay mantenimientos programados.</p>';
        return;
      }
      mantenimientosListDiv.innerHTML = `
        <ul class="lista-items">
          ${mantenimientos.map(mantenimiento => `
            <li data-id="${mantenimiento.id}">
              <div class="item-info">
                <strong>Sala: ${mantenimiento.sala_nombre}</strong>
                <span>Motivo: ${mantenimiento.motivo}</span>
                <small>
                  Del: ${new Date(mantenimiento.fecha_inicio).toLocaleString()} 
                  Al: ${new Date(mantenimiento.fecha_fin).toLocaleString()}
                </small>
              </div>
              <div class="item-actions">
                <button class="btn-delete">Eliminar</button>
              </div>
            </li>
          `).join('')}
        </ul>
      `;
    } catch (error) {
      Swal.fire('Error', 'No se pudieron cargar los mantenimientos. ' + error.message, 'error');
    }
  };

  loadMantenimientos();
};
