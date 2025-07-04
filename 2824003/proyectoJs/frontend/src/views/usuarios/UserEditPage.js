import { userService, authService } from '../../services/apiServices.js';
import { router } from '../../router/index.js';
import Swal from 'sweetalert2';

export const UserEditPage = (app, userId) => {
  const currentUser = authService.getCurrentUser();
  if (!currentUser || currentUser.rol !== 'admin') {
    router.navigate('/salas');
    return;
  }

  // Pre-carga un HTML básico mientras se obtienen los datos
  app.innerHTML = `
    <div class="main-container form-container">
      <h2>Editar Usuario</h2>
      <p>Cargando datos del usuario...</p>
    </div>
  `;

  const loadUserData = async () => {
    try {
      const user = await userService.getById(userId);

      // Una vez que tenemos los datos, renderizamos el formulario completo
      app.innerHTML = `
        <div class="main-container form-container">
          <h2>Editar Usuario</h2>
          <form id="edit-user-form">
            <div class="form-group">
              <label for="nombre">Nombre:</label>
              <input type="text" id="nombre" name="nombre" value="${user.nombre}" required>
            </div>
            <div class="form-group">
              <label for="apellido">Apellido:</label>
              <input type="text" id="apellido" name="apellido" value="${user.apellido}" required>
            </div>
            <div class="form-group">
              <label for="email">Email:</label>
              <input type="email" id="email" name="email" value="${user.email}" required>
            </div>
            <div class="form-group">
              <label for="rol_id">Rol:</label>
              <select id="rol_id" name="rol_id" required>
                <option value="1" ${user.rol_id === 1 ? 'selected' : ''}>Admin</option>
                <option value="2" ${user.rol_id === 2 ? 'selected' : ''}>Empleado</option>
                <option value="3" ${user.rol_id === 3 ? 'selected' : ''}>Asistente</option>
              </select>
            </div>
            <p class="form-note">Nota: La contraseña no se puede editar desde aquí. Se requiere un flujo de "restablecer contraseña" por seguridad.</p>
            <div class="form-actions">
              <button type="submit" class="btn-primary">Guardar Cambios</button>
              <button type="button" id="cancel-btn" class="btn-secondary">Cancelar</button>
            </div>
          </form>
        </div>
      `;

      // Añadimos los event listeners después de renderizar el formulario
      const form = document.getElementById('edit-user-form');
      form.addEventListener('submit', handleFormSubmit);

      document.getElementById('cancel-btn').addEventListener('click', () => {
        router.navigate('/usuarios');
      });

    } catch (error) {
      Swal.fire('Error', 'No se pudieron cargar los datos del usuario. ' + error.message, 'error');
      router.navigate('/usuarios');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const userData = Object.fromEntries(formData.entries());
    userData.rol_id = parseInt(userData.rol_id, 10);

    try {
      await userService.updateById(userId, userData);
      Swal.fire({
        title: '¡Actualizado!',
        text: 'Los datos del usuario se han guardado correctamente.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
      setTimeout(() => router.navigate('/usuarios'), 2000);
    } catch (error) {
      Swal.fire('Error', 'No se pudieron guardar los cambios. ' + error.message, 'error');
    }
  };

  loadUserData();
};