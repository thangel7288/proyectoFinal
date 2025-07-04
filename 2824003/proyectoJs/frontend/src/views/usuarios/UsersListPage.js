import { userService, authService } from '../../services/apiServices.js';
import { router } from '../../router/index.js';
import Swal from 'sweetalert2';

export const UsersListPage = (app) => {
  const currentUser = authService.getCurrentUser();

  // Doble capa de seguridad: el router ya debería proteger esto,
  // pero lo validamos de nuevo por si se accede de forma inesperada.
  if (!currentUser || currentUser.rol !== 'admin') {
    router.navigate('/salas'); // Redirigir si no es admin
    return;
  }

  app.innerHTML = `
    <div class="main-container users-container">
      <h2>Gestión de Usuarios</h2>
      <p>Aquí puedes administrar los usuarios del sistema.</p>
      <div class="user-actions">
        <button id="crear-usuario-btn" class="btn-primary">Crear Nuevo Usuario</button>
        <button id="volver-salas-btn" class="btn-secondary">Volver a Salas</button>
      </div>
      <hr>
      <h3>Lista de Usuarios</h3>
      <div id="users-list"><p>Cargando usuarios...</p></div>
    </div>
  `;

  // --- Lógica de los botones principales ---
  document.getElementById('crear-usuario-btn').addEventListener('click', () => {
    router.navigate('/usuarios/crear');
  });

  document.getElementById('volver-salas-btn').addEventListener('click', () => {
    router.navigate('/salas');
  });

  const usersListDiv = document.getElementById('users-list');

  // --- Lógica para Editar y Eliminar ---
  usersListDiv.addEventListener('click', async (e) => {
    // Botón Eliminar
    if (e.target.classList.contains('btn-delete')) {
      const userElement = e.target.closest('li');
      const userId = userElement.dataset.id;

      // Evitar que el admin se elimine a sí mismo
      if (userId == currentUser.id) {
        Swal.fire('Acción no permitida', 'No puedes eliminar tu propia cuenta de administrador.', 'warning');
        return;
      }

      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción eliminará al usuario permanentemente.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, ¡bórralo!'
      });

      if (result.isConfirmed) {
        try {
          await userService.deleteById(userId);
          userElement.remove();
          Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Usuario eliminado', showConfirmButton: false, timer: 2000 });
        } catch (error) {
          Swal.fire('Error', error.message, 'error');
        }
      }
    }

    // Botón Editar
    if (e.target.classList.contains('btn-edit')) {
      const userElement = e.target.closest('li');
      const userId = userElement.dataset.id;
      router.navigate(`/usuarios/editar/${userId}`);
    }
  });

  // --- Función para cargar y mostrar los usuarios ---
  const loadUsers = async () => {
    try {
      const users = await userService.getAll();
      if (users.length === 0) {
        usersListDiv.innerHTML = '<p>No hay usuarios registrados.</p>';
        return;
      }
      usersListDiv.innerHTML = `
        <ul class="lista-items">
          ${users.map(user => `
            <li data-id="${user.id}">
              <div class="item-info">
                <strong>${user.nombre} ${user.apellido}</strong>
                <span>Email: ${user.email} | Rol: ${user.rol_nombre}</span>
              </div>
              <div class="item-actions">
                <button class="btn-edit">Editar</button>
                <button class="btn-delete">Eliminar</button>
              </div>
            </li>
          `).join('')}
        </ul>
      `;
    } catch (error) {
      Swal.fire('Error', 'No se pudieron cargar los usuarios. ' + error.message, 'error');
    }
  };

  loadUsers();
};