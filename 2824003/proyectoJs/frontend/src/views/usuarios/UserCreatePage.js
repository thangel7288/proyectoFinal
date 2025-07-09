import { userService } from '../../services/apiServices.js';
import { router } from '../../router/index.js';
import Swal from 'sweetalert2';

/**
 * Componente de página para crear un nuevo usuario, con validaciones en el frontend.
 * @param {HTMLElement} container - El elemento donde se inyectará el contenido.
 */
export const UserCreatePage = (container) => {
  container.innerHTML = `
    <div class="form-view-container">
      <h2>Crear Nuevo Usuario</h2>
      <form id="create-user-form" novalidate>
        <div class="form-group">
          <label for="nombre">Nombre:</label>
          <input type="text" id="nombre" name="nombre" class="form-control" required>
        </div>
        <div class="form-group">
          <label for="apellido">Apellido:</label>
          <input type="text" id="apellido" name="apellido" class="form-control" required>
        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" name="email" class="form-control" required>
        </div>
        <div class="form-group">
          <label for="password">Contraseña:</label>
          <input type="password" id="password" name="password" class="form-control" required minlength="6">
          <small>La contraseña debe tener al menos 6 caracteres.</small>
        </div>
        <div class="form-group">
          <label for="rol_id">Rol:</label>
          <select id="rol_id" name="rol_id" class="form-control" required>
            <option value="" disabled selected>Seleccione un rol...</option>
            <option value="1">Admin</option>
            <option value="2">Empleado</option>
            <option value="3">Asistente</option>
          </select>
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

    // --- VALIDACIÓN DEL LADO DEL CLIENTE ---
    if (!form.checkValidity()) {
      // Si el formulario no es válido, muestra las validaciones del navegador
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    const userData = Object.fromEntries(formData.entries());
    userData.rol_id = parseInt(userData.rol_id, 10);

    try {
      await userService.create(userData);
      Swal.fire({
        title: '¡Éxito!', text: 'Usuario creado correctamente.', icon: 'success',
        timer: 2000, showConfirmButton: false
      });
      router.navigate('/usuarios');
    } catch (error) {
      Swal.fire('Error', 'No se pudo crear el usuario. ' + error.message, 'error');
    }
  });

  document.getElementById('cancel-btn').addEventListener('click', () => {
    router.navigate('/usuarios');
  });
};
