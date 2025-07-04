import { userService, authService } from '../../services/apiServices.js';
import { router } from '../../router/index.js';
import Swal from 'sweetalert2';

export const UserCreatePage = (app) => {
  const currentUser = authService.getCurrentUser();
  // Verificación de seguridad
  if (!currentUser || currentUser.rol !== 'admin') {
    router.navigate('/salas');
    return;
  }

  app.innerHTML = `
    <div class="main-container form-container">
      <h2>Crear Nuevo Usuario</h2>
      <form id="create-user-form">
        <div class="form-group">
          <label for="nombre">Nombre:</label>
          <input type="text" id="nombre" name="nombre" required>
        </div>
        <div class="form-group">
          <label for="apellido">Apellido:</label>
          <input type="text" id="apellido" name="apellido" required>
        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" name="email" required>
        </div>
        <div class="form-group">
          <label for="password">Contraseña:</label>
          <input type="password" id="password" name="password" required>
        </div>
        <div class="form-group">
          <label for="rol_id">Rol:</label>
          <select id="rol_id" name="rol_id" required>
            <option value="" disabled selected>Seleccione un rol...</option>
            <option value="1">Admin</option>
            <option value="2">Empleado</option>
            <option value="3">Asistente</option>
          </select>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn-primary">Guardar Usuario</button>
          <button type="button" id="cancel-btn" class="btn-secondary">Cancelar</button>
        </div>
      </form>
    </div>
  `;

  const form = document.getElementById('create-user-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const userData = Object.fromEntries(formData.entries());

    // Asegurarse de que el rol_id se envíe como número
    userData.rol_id = parseInt(userData.rol_id, 10);

    try {
      await userService.create(userData);
      Swal.fire({
        title: '¡Éxito!',
        text: 'Usuario creado correctamente.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
      // Redirigir a la lista de usuarios después de crear
      setTimeout(() => router.navigate('/usuarios'), 1500);
    } catch (error) {
      Swal.fire('Error', 'No se pudo crear el usuario. ' + error.message, 'error');
    }
  });

  document.getElementById('cancel-btn').addEventListener('click', () => {
    router.navigate('/usuarios');
  });
};
