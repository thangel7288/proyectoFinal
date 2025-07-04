// frontend/src/views/salas/SalaCreatePage.js

import Swal from 'sweetalert2';
import { router } from '../../router/index.js';
import { salaService } from '../../services/apiServices.js';
import { isNotEmpty } from '../../helpers/validationHelpers.js';

export const SalaCreatePage = (app) => {
  // El HTML del formulario que ya tenías
  app.innerHTML = `
    <div class="form-container">
      <h2>Crear Nueva Sala</h2>
      <form id="create-sala-form" class="sala-form">
        <div class="form-group">
          <label for="nombre">Nombre de la Sala:</label>
          <input type="text" id="nombre" placeholder="Ej: Sala de Juntas VIP">
        </div>
        <div class="form-group">
          <label for="capacidad">Capacidad:</label>
          <input type="number" id="capacidad" placeholder="Ej: 12">
        </div>
        <div class="form-group">
          <label for="ubicacion">Ubicación:</label>
          <input type="text" id="ubicacion" placeholder="Ej: Piso 3, Ala Norte">
        </div>
        <div class="form-actions">
            <button type="submit" class="btn-primary">Guardar Sala</button>
            <button type="button" id="cancel-btn" class="btn-secondary">Cancelar</button>
        </div>
      </form>
    </div>
  `;

  // --- AHORA AÑADIMOS TODA LA LÓGICA ---

  // 1. Obtenemos referencias a los elementos del DOM
  const form = document.getElementById('create-sala-form');
  const nombreInput = document.getElementById('nombre');
  const capacidadInput = document.getElementById('capacidad');
  const ubicacionInput = document.getElementById('ubicacion');
  const cancelBtn = document.getElementById('cancel-btn');

  // 2. Lógica para el botón de Cancelar
  cancelBtn.addEventListener('click', () => {
    // Simplemente nos devuelve a la lista de salas
    router.navigate('/salas');
  });

  // 3. Lógica para cuando se envía el formulario
  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Evitamos que la página se recargue

    // Obtenemos los valores de los inputs
    const nombre = nombreInput.value;
    const capacidad = capacidadInput.value;
    const ubicacion = ubicacionInput.value;

    // Validamos los campos usando nuestro helper
    if (!isNotEmpty(nombre) || !isNotEmpty(capacidad) || !isNotEmpty(ubicacion)) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos Incompletos',
        text: 'Por favor, llena todos los campos para crear la sala.'
      });
      return; // Detenemos el proceso
    }

    // Creamos el objeto con los datos de la sala
    const salaData = {
      nombre,
      capacidad: parseInt(capacidad, 10), // Convertimos la capacidad a número
      ubicacion
    };

    // Usamos un try/catch para llamar al servicio
    try {
      // Llamamos a la función 'create' que ya habíamos añadido en apiServices.js
      await salaService.create(salaData);
      
      // Si todo sale bien, mostramos alerta de éxito
      await Swal.fire({
        icon: 'success',
        title: '¡Sala Creada!',
        text: 'La nueva sala ha sido registrada exitosamente.'
      });
      
      // Y redirigimos al usuario a la lista de salas
      router.navigate('/salas');

    } catch (error) {
      // Si algo falla, mostramos una alerta de error
      Swal.fire({
        icon: 'error',
        title: 'Error al crear la sala',
        text: error.message
      });
    }
  });
};