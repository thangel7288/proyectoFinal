import Swal from 'sweetalert2';
import { router } from '../../router/index.js';
import { salaService } from '../../services/apiServices.js';

export const SalaEditPage = (container, salaId) => {
    // Mostramos un mensaje de carga inicial
    container.innerHTML = `<div class="form-view-container"><p>Cargando datos de la sala...</p></div>`;

    // Función principal para inicializar la página
    const init = async () => {
        try {
            // 1. Buscamos los datos actuales de la sala por su ID
            const sala = await salaService.getById(salaId);

            // 2. Dibujamos el formulario con los valores de la sala y los estilos mejorados
            container.innerHTML = `
                <div class="form-view-container">
                    <h2>Editando Sala: ${sala.nombre}</h2>
                    <form id="edit-sala-form" novalidate>
                        <div class="form-group">
                            <label for="nombre">Nombre de la Sala:</label>
                            <input type="text" id="nombre" name="nombre" class="form-control" value="${sala.nombre || ''}">
                        </div>
                        <div class="form-group">
                            <label for="capacidad">Capacidad:</label>
                            <input type="number" id="capacidad" name="capacidad" class="form-control" min="1" value="${sala.capacidad || ''}">
                        </div>
                        <div class="form-group">
                            <label for="ubicacion">Ubicación:</label>
                            <input type="text" id="ubicacion" name="ubicacion" class="form-control" value="${sala.ubicacion || ''}">
                        </div>
                        <div class="form-actions">
                            <button type="button" id="cancel-btn" class="btn btn-secondary">Cancelar</button>
                            <button type="submit" class="btn btn-primary">Guardar Cambios</button>
                        </div>
                    </form>
                </div>
            `;

            // 3. Le damos vida al formulario DESPUÉS de haberlo dibujado
            setupFormEventListeners();

        } catch (error) {
            Swal.fire('Error', `No se pudieron cargar los datos de la sala: ${error.message}`, 'error');
            router.navigate('/salas');
        }
    };

    const setupFormEventListeners = () => {
        const form = document.getElementById('edit-sala-form');
        const cancelBtn = document.getElementById('cancel-btn');

        cancelBtn.addEventListener('click', () => router.navigate('/salas'));

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Lógica de envío refactorizada con FormData y validación manual
            const formData = new FormData(form);
            const salaData = Object.fromEntries(formData.entries());

            if (!salaData.nombre || !salaData.capacidad || !salaData.ubicacion) {
                Swal.fire('Campos Incompletos', 'Todos los campos son obligatorios.', 'warning');
                return;
            }

            try {
                await salaService.updateById(salaId, salaData);
                Swal.fire({
                  title: '¡Actualizado!', 
                  text: 'La sala ha sido modificada exitosamente.', 
                  icon: 'success',
                  timer: 2000,
                  showConfirmButton: false
                });
                router.navigate('/salas');
            } catch (error) {
                Swal.fire('Error', error.message, 'error');
            }
        });
    };

    init();
};