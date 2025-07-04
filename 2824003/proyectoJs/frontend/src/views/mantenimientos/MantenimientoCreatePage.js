import { mantenimientoService, salaService, authService } from '../../services/apiServices.js';
import { router } from '../../router/index.js';
import Swal from 'sweetalert2';

export const MantenimientoCreatePage = (app) => {
  const currentUser = authService.getCurrentUser();
  if (!currentUser || currentUser.rol !== 'admin') {
    router.navigate('/salas');
    return;
  }

  // HTML inicial mientras se cargan las salas
  app.innerHTML = `<div class="main-container"><p>Cargando...</p></div>`;

  const loadSalasAndRenderForm = async () => {
    try {
      // Obtenemos todas las salas para el menú desplegable
      const salas = await salaService.getAll();

      app.innerHTML = `
        <div class="main-container form-container">
          <h2>Programar Nuevo Mantenimiento</h2>
          <form id="create-mantenimiento-form">
            <div class="form-group">
              <label for="sala_id">Seleccione la Sala:</label>
              <select id="sala_id" name="sala_id" required>
                <option value="" disabled selected>-- Elija una sala --</option>
                ${salas.map(sala => `<option value="${sala.id}">${sala.nombre}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label for="motivo">Motivo del Mantenimiento:</label>
              <input type="text" id="motivo" name="motivo" required placeholder="Ej: Limpieza profunda, Reparación proyector">
            </div>
            <div class="form-group">
              <label for="fecha_inicio">Fecha y Hora de Inicio:</label>
              <input type="datetime-local" id="fecha_inicio" name="fecha_inicio" required>
            </div>
            <div class="form-group">
              <label for="fecha_fin">Fecha y Hora de Fin:</label>
              <input type="datetime-local" id="fecha_fin" name="fecha_fin" required>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn-primary">Confirmar Mantenimiento</button>
              <button type="button" id="cancel-btn" class="btn-secondary">Cancelar</button>
            </div>
          </form>
        </div>
      `;

      // Añadir listeners después de renderizar el formulario
      document.getElementById('create-mantenimiento-form').addEventListener('submit', handleFormSubmit);
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
    mantenimientoData.sala_id = parseInt(mantenimientoData.sala_id, 10);

    try {
      await mantenimientoService.create(mantenimientoData);
      Swal.fire({
        title: '¡Éxito!',
        text: 'El mantenimiento ha sido programado correctamente.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
      setTimeout(() => router.navigate('/mantenimientos'), 1500);
    } catch (error) {
      Swal.fire('Error', 'No se pudo programar el mantenimiento. ' + error.message, 'error');
    }
  };

  loadSalasAndRenderForm();
};
