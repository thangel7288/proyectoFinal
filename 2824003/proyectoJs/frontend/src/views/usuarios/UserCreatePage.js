import { userService } from '../../services/apiServices.js';
import { router } from '../../router/index.js';
import Swal from 'sweetalert2';

export const UserCreatePage = (container) => {
  container.innerHTML = `
    <div class="form-view-container">
      <h2>Crear Nuevo Usuario</h2>
      <form id="create-user-form" novalidate>
        <div class="form-group">
          <label for="nombre">Nombre:</label>
          <input type="text" id="nombre" name="nombre" class="form-control">
        </div>
        <div class="form-group">
          <label for="apellido">Apellido:</label>
          <input type="text" id="apellido" name="apellido" class="form-control">
        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" name="email" class="form-control">
        </div>
        <div class="form-group">
          <label for="password">Contraseña:</label>
          <input type="password" id="password" name="password" class="form-control" minlength="6">
          <small>La contraseña debe tener al menos 6 caracteres.</small>
        </div>
        <div class="form-group">
          <label for="rol_id">Rol:</label>
          <div class="custom-select-wrapper">
            <select id="rol_id" name="rol_id" class="form-control">
              <option value="" disabled selected>Seleccione un rol...</option>
              <option value="1">Admin</option>
              <option value="2">Empleado</option>
              <option value="3">Asistente</option>
            </select>
          </div>
        </div>
        <div class="form-actions">
          <button type="button" id="cancel-btn" class="btn btn-secondary">Cancelar</button>
          <button type="submit" class="btn btn-primary">Guardar Usuario</button>
        </div>
      </form>
    </div>
  `;

  const form = document.getElementById('create-user-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const userData = Object.fromEntries(formData.entries());

    // --- VALIDACIÓN MANUAL DE TODOS LOS CAMPOS ---
    if (!userData.nombre || !userData.apellido || !userData.email || !userData.password || !userData.rol_id) {
        Swal.fire('Campos Incompletos', 'Por favor, complete todos los campos requeridos.', 'warning');
        return;
    }
    if (userData.password.length < 6) {
        Swal.fire('Contraseña Corta', 'La contraseña debe tener al menos 6 caracteres.', 'warning');
        return;
    }

    userData.rol_id = parseInt(userData.rol_id, 10);

    try {
      await userService.create(userData);
      Swal.fire('¡Éxito!', 'Usuario creado correctamente.', 'success');
      router.navigate('/usuarios');
    } catch (error) {
      Swal.fire('Error', 'No se pudo crear el usuario. ' + error.message, 'error');
    }
  });

  document.getElementById('cancel-btn').addEventListener('click', () => {
    router.navigate('/usuarios');
  });
};