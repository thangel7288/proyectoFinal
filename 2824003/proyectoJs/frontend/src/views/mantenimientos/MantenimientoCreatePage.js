import { mantenimientoService, salaService, authService } from '../../services/apiServices.js';
import { router } from '../../router/index.js';
import Swal from 'sweetalert2';

/**
 * Componente de página para programar un nuevo mantenimiento, con validación de fechas.
 * @param {HTMLElement} container - El elemento donde se inyectará el contenido.
 */
export const MantenimientoCreatePage = (container) => {
  const currentUser = authService.getCurrentUser();
  if (!currentUser || currentUser.rol !== 'admin') {
    router.navigate('/salas');
    return;
  }

  container.innerHTML = `<div class="form-view-container"><p>Cargando...</p></div>`;

  const loadSalasAndRenderForm = async () => {
    try {
      const salas = await salaService.getAll();

      // --- LÓGICA PARA LA FECHA MÍNIMA ---
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      const minDateTime = now.toISOString().slice(0, 16);

      // --- HTML SIN EL ATRIBUTO 'required' ---
      container.innerHTML = `
        <div class="form-view-container">
          <h2>Programar Nuevo Mantenimiento</h2>
          <form id="create-mantenimiento-form" novalidate>
            <div class="form-group">
              <label for="sala_id">Seleccione la Sala:</label>
              <div class="custom-select-wrapper">
                <select id="sala_id" name="sala_id" class="form-control">
                  <option value="" disabled selected>-- Elija una sala --</option>
                  ${salas.map(sala => `<option value="${sala.id}">${sala.nombre}</option>`).join('')}
                </select>
              </div>
            </div>
            <div class="form-group">
              <label for="motivo">Motivo del Mantenimiento:</label>
              <input type="text" id="motivo" name="motivo" class="form-control" placeholder="Ej: Limpieza profunda, Reparación proyector">
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
              <button type="submit" class="btn btn-primary">Confirmar Mantenimiento</button>
            </div>
          </form>
        </div>
      `;

      const form = document.getElementById('create-mantenimiento-form');
      const fechaInicioInput = document.getElementById('fecha_inicio');
      const fechaFinInput = document.getElementById('fecha_fin');

      fechaInicioInput.addEventListener('change', () => {
        if (fechaInicioInput.value) {
          fechaFinInput.min = fechaInicioInput.value;
        }
      });

      form.addEventListener('submit', handleFormSubmit);
      document.getElementById('cancel-btn').addEventListener('click', () => router.navigate('/mantenimientos'));

    } catch (error) {
      Swal.fire('Error', 'No se pudo cargar la lista de salas.', 'error');
      router.navigate('/mantenimientos');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    
    const formData = new FormData(form);
    const mantenimientoData = Object.fromEntries(formData.entries());
    
    // --- VALIDACIÓN MANUAL DE CAMPOS ---
    if (!mantenimientoData.sala_id || !mantenimientoData.motivo || !mantenimientoData.fecha_inicio || !mantenimientoData.fecha_fin) {
        Swal.fire('Campos Incompletos', 'Por favor, complete todos los campos requeridos.', 'warning');
        return;
    }

    if (new Date(mantenimientoData.fecha_fin) <= new Date(mantenimientoData.fecha_inicio)) {
        Swal.fire('Error de Fechas', 'La fecha de fin debe ser posterior a la fecha de inicio.', 'warning');
        return;
    }
    
    mantenimientoData.sala_id = parseInt(mantenimientoData.sala_id, 10);

    try {
      await mantenimientoService.create(mantenimientoData);
      Swal.fire({
        title: '¡Éxito!', text: 'El mantenimiento ha sido programado correctamente.', icon: 'success',
        timer: 2000, showConfirmButton: false
      });
      router.navigate('/mantenimientos');
    } catch (error) {
      Swal.fire('Error', 'No se pudo programar el mantenimiento. ' + error.message, 'error');
    }
  };

  loadSalasAndRenderForm();
};