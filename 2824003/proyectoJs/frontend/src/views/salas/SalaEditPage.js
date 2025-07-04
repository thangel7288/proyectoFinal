import Swal from 'sweetalert2';
import { router } from '../../router/index.js';
import { salaService } from '../../services/apiServices.js';
import { isNotEmpty } from '../../helpers/validationHelpers.js';

export const SalaEditPage = (app, salaId) => {
  // Mostramos un mensaje de carga inicial
  app.innerHTML = '<p>Cargando datos de la sala...</p>';

  // Función principal para inicializar la página
  const init = async () => {
    try {
      // 1. Buscamos los datos actuales de la sala por su ID
      const sala = await salaService.getById(salaId);

      // 2. Dibujamos el formulario, pero ahora con los valores de la sala
      app.innerHTML = `
        <div class="main-container form-container">
          <h2>Editar Sala</h2>
          <form id="edit-sala-form" class="sala-form">
            <div class="form-group">
              <label for="nombre">Nombre de la Sala:</label>
              <input type="text" id="nombre" value="${sala.nombre}" required>
            </div>
            <div class="form-group">
              <label for="capacidad">Capacidad:</label>
              <input type="number" id="capacidad" value="${sala.capacidad}" required>
            </div>
            <div class="form-group">
              <label for="ubicacion">Ubicación:</label>
              <input type="text" id="ubicacion" value="${sala.ubicacion}" required>
            </div>
            <div class="form-actions">
                <button type="submit" class="btn-primary">Guardar Cambios</button>
                <button type="button" id="cancel-btn" class="btn-secondary">Cancelar</button>
            </div>
          </form>
        </div>
      `;

      // 3. Le damos vida al formulario DESPUÉS de haberlo dibujado
      setupFormEventListeners();

    } catch (error) {
      Swal.fire('Error', `No se pudieron cargar los datos de la sala: ${error.message}`, 'error');
      router.navigate('/salas'); // Si hay error, volvemos a la lista
    }
  };

  const setupFormEventListeners = () => {
    const form = document.getElementById('edit-sala-form');
    const cancelBtn = document.getElementById('cancel-btn');

    cancelBtn.addEventListener('click', () => router.navigate('/salas'));

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const salaData = {
        nombre: document.getElementById('nombre').value,
        capacidad: parseInt(document.getElementById('capacidad').value, 10),
        ubicacion: document.getElementById('ubicacion').value
      };

      if (!isNotEmpty(salaData.nombre) || !isNotEmpty(salaData.capacidad.toString()) || !isNotEmpty(salaData.ubicacion)) {
        Swal.fire('Campos incompletos', 'Todos los campos son obligatorios.', 'warning');
        return;
      }

      try {
        // 4. Llamamos al servicio de ACTUALIZACIÓN
        await salaService.updateById(salaId, salaData);
        await Swal.fire('¡Actualizado!', 'La sala ha sido modificada exitosamente.', 'success');
        router.navigate('/salas'); // Volvemos a la lista
      } catch (error) {
        Swal.fire('Error', error.message, 'error');
      }
    });
  };

  // ¡Llamamos a la función para que todo empiece!
  init();
};