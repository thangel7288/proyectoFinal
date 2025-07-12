import { reservaService, authService, salaService } from '../../services/apiServices.js';
import { router } from '../../router/index.js';
import Swal from 'sweetalert2';

/**
 * Componente de página para crear una reserva, con validación de fechas.
 * @param {HTMLElement} container - El elemento donde se inyectará el contenido.
 * @param {string} salaId - El ID de la sala a reservar.
 */
export const ReservaCreatePage = (container, salaId) => {
  const currentUser = authService.getCurrentUser();
  if (!currentUser) {
    router.navigate('/login');
    return;
  }

  container.innerHTML = `<div class="form-view-container"><p>Cargando...</p></div>`;

  const loadSalaInfoAndRenderForm = async () => {
    try {
      const sala = await salaService.getById(salaId);

      // --- LÓGICA PARA LA FECHA MÍNIMA ---
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      const minDateTime = now.toISOString().slice(0, 16);

      // --- HTML SIN EL ATRIBUTO 'required' ---
      container.innerHTML = `
        <div class="form-view-container">
          <h2>Reservar Sala: ${sala.nombre}</h2>
          <p>Capacidad: ${sala.capacidad} | Ubicación: ${sala.ubicacion}</p>
          <hr>
          <form id="create-reserva-form" novalidate>
            <div class="form-group">
              <label for="motivo">Motivo de la Reserva:</label>
              <input type="text" id="motivo" name="motivo" class="form-control" placeholder="Ej: Reunión de equipo">
            </div>
            <div class="form-group">
              <label for="fecha_inicio">Fecha y Hora de Inicio:</label>
              <input type="datetime-local" id="fecha_inicio" name="fecha_inicio" class="form-control" min="${minDateTime}">
            </div>
            <div class="form-group">
              <label for="fecha_fin">Fecha y Hora de Fin:</label>
              <input type="datetime-local" id="fecha_fin" name="fecha_fin" class="form-control" min="${minDateTime}">
            </div>
            <div class="form-actions">
              <button type="button" id="cancel-btn" class="btn btn-secondary">Cancelar</button>
              <button type="submit" class="btn btn-primary">Confirmar Reserva</button>
            </div>
          </form>
        </div>
      `;

      const form = document.getElementById('create-reserva-form');
      const fechaInicioInput = document.getElementById('fecha_inicio');
      const fechaFinInput = document.getElementById('fecha_fin');

      fechaInicioInput.addEventListener('change', () => {
        if (fechaInicioInput.value) {
          fechaFinInput.min = fechaInicioInput.value;
        }
      });

      form.addEventListener('submit', handleFormSubmit);
      document.getElementById('cancel-btn').addEventListener('click', () => router.navigate('/salas'));

    } catch (error) {
      Swal.fire('Error', 'No se pudo cargar la información de la sala.', 'error');
      router.navigate('/salas');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    
    const formData = new FormData(form);
    const reservaData = Object.fromEntries(formData.entries());
    
    // --- VALIDACIÓN MANUAL DE CAMPOS ---
    if (!reservaData.motivo || !reservaData.fecha_inicio || !reservaData.fecha_fin) {
        Swal.fire('Campos Incompletos', 'Por favor, complete todos los campos requeridos.', 'warning');
        return;
    }

    if (new Date(reservaData.fecha_fin) <= new Date(reservaData.fecha_inicio)) {
        Swal.fire('Error de Fechas', 'La fecha de fin debe ser posterior a la fecha de inicio.', 'warning');
        return;
    }

    reservaData.sala_id = parseInt(salaId, 10);

    try {
      await reservaService.create(reservaData);
      Swal.fire({
        title: '¡Reserva Creada!',
        text: 'Tu reserva ha sido registrada exitosamente.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
      router.navigate('/reservas');
    } catch (error) {
      Swal.fire('Error', 'No se pudo crear la reserva. ' + error.message, 'error');
    }
  };

  loadSalaInfoAndRenderForm();
};