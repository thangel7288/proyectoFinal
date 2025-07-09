import { userService, authService } from '../../services/apiServices.js';
import { router } from '../../router/index.js';
import Swal from 'sweetalert2';

/**
 * Componente de página que renderiza la lista de usuarios en una tabla.
 * @param {HTMLElement} container - El elemento donde se inyectará el contenido.
 */
export const UsersListPage = (container) => {
  const currentUser = authService.getCurrentUser();

  container.innerHTML = `
    <div class="usuarios-page-container">
      <div class="usuarios-page-header">
        <h1>Gestión de Usuarios</h1>
        <button id="crear-usuario-btn" class="btn btn-primary">Crear Nuevo Usuario</button>
      </div>
      <div id="users-list-content" class="content-area">
        <p>Cargando usuarios...</p>
      </div>
    </div>
  `;

  const usersListContent = document.getElementById('users-list-content');
  document.getElementById('crear-usuario-btn').addEventListener('click', () => router.navigate('/usuarios/crear'));

  usersListContent.addEventListener('click', async (e) => {
    if (e.target.matches('.btn-delete')) {
      const row = e.target.closest('tr');
      const userId = row.dataset.id;

      if (userId == currentUser.id) {
        Swal.fire('Acción no permitida', 'No puedes eliminar tu propia cuenta de administrador.', 'warning');
        return;
      }

      const result = await Swal.fire({
        title: '¿Estás seguro?', text: "Esta acción eliminará al usuario permanentemente.", icon: 'warning',
        showCancelButton: true, confirmButtonText: 'Sí, ¡bórralo!'
      });

      if (result.isConfirmed) {
        try {
          await userService.deleteById(userId);
          row.remove();
          Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Usuario eliminado', showConfirmButton: false, timer: 2000 });
        } catch (error) {
          Swal.fire('Error', error.message, 'error');
        }
      }
    } else if (e.target.matches('.btn-edit')) {
      const row = e.target.closest('tr');
      const userId = row.dataset.id;
      router.navigate(`/usuarios/editar/${userId}`);
    }
  });

  const loadUsers = async () => {
    try {
      const users = await userService.getAll();
      if (!users || users.length === 0) {
        usersListContent.innerHTML = '<p>No hay usuarios registrados.</p>';
        return;
      }
      usersListContent.innerHTML = `
        <table class="usuarios-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Rol</th>
              <th>Fecha de Registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${users.map(user => `
              <tr data-id="${user.id}">
                <td>
                  <div class="user-info-cell">
                    <strong>${user.nombre} ${user.apellido}</strong>
                    <small>${user.email}</small>
                  </div>
                </td>
                <td>${user.rol_nombre}</td>
                <td>${new Date(user.fecha_registro).toLocaleDateString()}</td>
                <td class="actions-cell">
                  <button class="btn btn-secondary btn-edit">Editar</button>
                  <button class="btn btn-danger btn-delete">Eliminar</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } catch (error) {
      Swal.fire('Error', 'No se pudieron cargar los usuarios. ' + error.message, 'error');
    }
  };

  loadUsers();
};