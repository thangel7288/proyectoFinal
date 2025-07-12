import { userService } from '../../services/apiServices.js';
import { router } from '../../router/index.js';
import Swal from 'sweetalert2';

export const UserEditPage = (container, userId) => {
    container.innerHTML = `<div class="form-view-container"><p>Cargando datos del usuario...</p></div>`;

    const init = async () => {
        try {
            // Obtenemos los datos del usuario específico
            const user = await userService.getById(userId);
            
            // Renderizamos el formulario con los datos cargados
            renderForm(user);
        } catch (error) {
            Swal.fire('Error', 'No se pudieron cargar los datos del usuario.', 'error');
            router.navigate('/usuarios');
        }
    };

    const renderForm = (user) => {
        container.innerHTML = `
            <div class="form-view-container">
                <h2>Editando Usuario: ${user.nombre} ${user.apellido}</h2>
                <form id="edit-user-form" novalidate>
                    <div class="form-group">
                        <label for="nombre">Nombre:</label>
                        <input type="text" id="nombre" name="nombre" class="form-control" value="${user.nombre || ''}">
                    </div>
                    <div class="form-group">
                        <label for="apellido">Apellido:</label>
                        <input type="text" id="apellido" name="apellido" class="form-control" value="${user.apellido || ''}">
                    </div>
                    <div class="form-group">
                        <label for="email">Email:</label>
                        <input type="email" id="email" name="email" class="form-control" value="${user.email || ''}">
                    </div>
                    <div class="form-group">
                        <label for="rol_id">Rol:</label>
                        <div class="custom-select-wrapper">
                            <select id="rol_id" name="rol_id" class="form-control">
                                <option value="1" ${user.rol_id === 1 ? 'selected' : ''}>Admin</option>
                                <option value="2" ${user.rol_id === 2 ? 'selected' : ''}>Empleado</option>
                                <option value="3" ${user.rol_id === 3 ? 'selected' : ''}>Asistente</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-actions">
                        <button type="button" id="cancel-btn" class="btn btn-secondary">Cancelar</button>
                        <button type="submit" class="btn btn-primary">Guardar Cambios</button>
                    </div>
                </form>
            </div>
        `;

        const form = document.getElementById('edit-user-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const userData = Object.fromEntries(formData.entries());

            if (!userData.nombre || !userData.apellido || !userData.email || !userData.rol_id) {
                Swal.fire('Campos Incompletos', 'Por favor, complete todos los campos requeridos.', 'warning');
                return;
            }

            // Convertimos el rol_id a número para enviarlo correctamente
            userData.rol_id = parseInt(userData.rol_id, 10);

            try {
                await userService.updateById(userId, userData);
                Swal.fire({
                    title: '¡Actualizado!',
                    text: 'El usuario ha sido modificado exitosamente.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
                router.navigate('/usuarios');
            } catch (error) {
                Swal.fire('Error', 'No se pudo actualizar el usuario. ' + error.message, 'error');
            }
        });

        document.getElementById('cancel-btn').addEventListener('click', () => {
            router.navigate('/usuarios');
        });
    };

    init();
};