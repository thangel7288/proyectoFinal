import { salaService, authService } from '../../services/apiServices.js';
import { router } from '../../router/index.js';
import Swal from 'sweetalert2';

/**
 * Componente de página que renderiza la lista de salas con un diseño de tarjetas.
 */
export const SalasListPage = (container) => {
  const user = authService.getCurrentUser();

  const icons = {
    capacidad: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>`,
    ubicacion: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`
  };

  const loadSalas = async () => {
    try {
      const salas = await salaService.getAll(); // Esto ya solo trae las salas activas
      if (!salas || salas.length === 0) {
        salasListContent.innerHTML = '<p>No hay salas disponibles en este momento.</p>';
        return;
      }
      salasListContent.innerHTML = `
        <div class="salas-grid">
          ${salas.map(sala => `
            <div class="sala-card" data-id="${sala.id}">
              <div class="sala-card-body">
                <h3>${sala.nombre}</h3>
                <ul class="sala-card-details">
                  <li>${icons.capacidad} <span>Capacidad: ${sala.capacidad} personas</span></li>
                  <li>${icons.ubicacion} <span>${sala.ubicacion || 'No especificada'}</span></li>
                </ul>
              </div>
              <div class="sala-card-footer">
                <button class="btn btn-primary btn-reservar">Reservar</button>
                ${user.rol === 'admin' ? `
                  <button class="btn btn-secondary btn-edit">Editar</button>
                  <button class="btn btn-warning btn-deactivate">Desactivar</button>
                ` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } catch (error) { 
        Swal.fire('Error', 'No se pudieron cargar las salas. ' + error.message, 'error');
    }
  };

  container.innerHTML = `
    <div class="salas-page-container">
      <div class="salas-page-header">
        <h1>Salas Disponibles</h1>
        ${user.rol === 'admin' ? `<button id="crear-sala-btn" class="btn btn-primary">Crear Nueva Sala</button>` : ''}
      </div>
      <div id="salas-list-content" class="content-area">
        <p>Cargando salas...</p>
      </div>
    </div>
  `;

  const salasListContent = document.getElementById('salas-list-content');
  const crearSalaBtn = document.getElementById('crear-sala-btn');
  if (crearSalaBtn) {
    crearSalaBtn.addEventListener('click', () => router.navigate('/salas/crear'));
  }

  salasListContent.addEventListener('click', async (e) => {
    const card = e.target.closest('.sala-card');
    if (!card) return;
    const salaId = card.dataset.id;

    if (e.target.matches('.btn-reservar')) {
      router.navigate(`/reservas/crear/${salaId}`);
    } else if (e.target.matches('.btn-edit')) {
      router.navigate(`/salas/editar/${salaId}`);
    } 
    // --- LÓGICA MODIFICADA PARA DESACTIVAR ---
    else if (e.target.matches('.btn-deactivate')) {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "La sala se ocultará y no podrá ser reservada, pero no se eliminará permanentemente.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, ¡desactívala!',
        cancelButtonText: 'Cancelar'
      });
      if (result.isConfirmed) {
        try {
          // Se llama al nuevo método del servicio
          await salaService.deactivateById(salaId);
          Swal.fire({ 
            toast: true, 
            position: 'top-end', 
            icon: 'success', 
            title: 'Sala desactivada', 
            showConfirmButton: false, 
            timer: 2000 
          });
          // Se recarga la lista para que la sala desactivada desaparezca
          loadSalas();
        } catch (error) {
          Swal.fire('Error', error.message, 'error');
        }
      }
    }
  });
  
  loadSalas();
};