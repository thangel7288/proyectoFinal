import { salaService } from '../../services/apiServices.js';
import { router } from '../../router/index.js';
import Swal from 'sweetalert2';

export const SalaCreatePage = (container) => {
    // Renderiza el formulario directamente
    container.innerHTML = `
        <div class="form-view-container">
            <h2>Crear Nueva Sala</h2>
            <form id="create-sala-form" novalidate>
                <div class="form-group">
                    <label for="nombre">Nombre de la Sala:</label>
                    <input type="text" id="nombre" name="nombre" class="form-control">
                </div>
                <div class="form-group">
                    <label for="capacidad">Capacidad:</label>
                    <input type="number" id="capacidad" name="capacidad" class="form-control" min="1">
                </div>
                <div class="form-group">
                    <label for="ubicacion">Ubicación:</label>
                    <input type="text" id="ubicacion" name="ubicacion" class="form-control">
                </div>
                <div class="form-actions">
                    <button type="button" id="cancel-btn" class="btn btn-secondary">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Guardar Sala</button>
                </div>
            </form>
        </div>
    `;

    const form = document.getElementById('create-sala-form');

    // Lógica de envío del formulario
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const salaData = Object.fromEntries(formData.entries());

        // --- VALIDACIÓN MANUAL DE CAMPOS ---
        if (!salaData.nombre || !salaData.capacidad || !salaData.ubicacion) {
            Swal.fire('Campos Incompletos', 'Por favor, complete todos los campos requeridos.', 'warning');
            return;
        }

        try {
            await salaService.create(salaData);
            Swal.fire({
                title: '¡Éxito!',
                text: 'La sala ha sido creada correctamente.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
            router.navigate('/salas');
        } catch (error) {
            Swal.fire('Error', 'No se pudo crear la sala. ' + error.message, 'error');
        }
    });

    document.getElementById('cancel-btn').addEventListener('click', () => {
        router.navigate('/salas');
    });
};