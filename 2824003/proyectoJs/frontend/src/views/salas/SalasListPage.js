import { salaService, authService } from '../../services/apiServices.js';
import { router } from '../../router/index.js';
import Swal from 'sweetalert2';

/**
 * Componente de página que renderiza la lista de salas.
 * Ahora recibe un 'container' del MainLayout donde debe renderizarse.
 * @param {HTMLElement} container - El elemento donde se inyectará el contenido.
 */
export const SalasListPage = (container) => {
  const user = authService.getCurrentUser();

  // HTML específico de esta página. Ya no contiene la estructura general como menús o botones de logout.
  container.innerHTML = `
    <div class="page-header">
      <h1>Salas Disponibles</h1>
      ${user.rol === 'admin' ? `<button id="crear-sala-btn" class="btn btn-primary">Crear Nueva Sala</button>` : ''}
    </div>
    <div id="salas-list-content" class="content-area">
      <p>Cargando salas...</p>
    </div>
  `;

  // --- Lógica de eventos específica de esta página ---
  const salasListContent = document.getElementById('salas-list-content');

  // El botón para crear una sala ahora es parte de esta página
  document.getElementById('crear-sala-btn')?.addEventListener('click', () => {
    router.navigate('/salas/crear');
  });

  // Listener para los botones de la lista (Reservar, Editar, Eliminar)
  salasListContent.addEventListener('click', async (e) => {
    const salaElement = e.target.closest('li');
    if (!salaElement) return;

    const salaId = salaElement.dataset.id;

    if (e.target.classList.contains('btn-reservar')) {
      router.navigate(`/reservas/crear/${salaId}`);
    } 
    else if (e.target.classList.contains('btn-edit')) {
      router.navigate(`/salas/editar/${salaId}`);
    } 
    else if (e.target.classList.contains('btn-delete')) {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esta acción.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, ¡bórrala!'
      });
      if (result.isConfirmed) {
        try {
          await salaService.deleteById(salaId);
          salaElement.remove();
          Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Sala eliminada', showConfirmButton: false, timer: 2000 });
        } catch (error) {
          Swal.fire('Error', error.message, 'error');
        }
      }
    }
  });

  // --- Función para cargar y mostrar las salas ---
  const loadSalas = async () => {
    try {
      const salas = await salaService.getAll();
      if (salas.length === 0) {
        salasListContent.innerHTML = '<p>No hay salas registradas.</p>';
        return;
      }
      salasListContent.innerHTML = `
        <ul class="lista-items">
          ${salas.map(sala => `
            <li data-id="${sala.id}">
              <div class="item-info">
                <strong>${sala.nombre}</strong>
                <span>Capacidad: ${sala.capacidad} | Ubicación: ${sala.ubicacion || 'No especificada'}</span>
              </div>
              <div class="item-actions">
                <button class="btn btn-secondary btn-reservar">Reservar</button>
                ${user.rol === 'admin' ? `
                  <button class="btn btn-secondary btn-edit">Editar</button>
                  <button class="btn btn-danger btn-delete">Eliminar</button>
                ` : ''}
              </div>
            </li>
          `).join('')}
        </ul>
      `;
    } catch (error) { 
        Swal.fire('Error', 'No se pudieron cargar las salas. ' + error.message, 'error');
    }
  };
  
  loadSalas();
};