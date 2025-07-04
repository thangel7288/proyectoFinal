import { reservaService, authService, salaService } from '../../services/apiServices.js';
import { router } from '../../router/index.js';
import Swal from 'sweetalert2';

// El ID de la sala ahora se pasa como parámetro a la función
export const ReservaCreatePage = (app, salaId) => {
  const currentUser = authService.getCurrentUser();
  if (!currentUser) {
    router.navigate('/login');
    return;
  }

  // HTML inicial mientras se cargan los datos de la sala
  app.innerHTML = `<div class="main-container"><p>Cargando...</p></div>`;

  const loadSalaInfoAndRenderForm = async () => {
    try {
      // Obtenemos los detalles de la sala para mostrar su nombre
      const sala = await salaService.getById(salaId);

      app.innerHTML = `
        <div class="main-container form-container">
          <h2>Reservar Sala: ${sala.nombre}</h2>
          <p>Capacidad: ${sala.capacidad} | Ubicación: ${sala.ubicacion}</p>
          <hr>
          <form id="create-reserva-form">
            <div class="form-group">
              <label for="motivo">Motivo de la Reserva:</label>
              <input type="text" id="motivo" name="motivo" required placeholder="Ej: Reunión de equipo, Presentación cliente">
            </div>
            <div class="form-group">
              <label for="fecha_inicio">Fecha y Hora de Inicio:</label>
              <input type="datetime-local" id="fecha_inicio" name="fecha_inicio" required>
            </div>
            <div class="form-group">
              <label for="fecha_fin">Fecha y Hora de Fin:</label>
              <input type="datetime-local" id="fecha_fin" name="fecha_fin" required>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn-primary">Confirmar Reserva</button>
              <button type="button" id="cancel-btn" class="btn-secondary">Cancelar</button>
            </div>
          </form>
        </div>
      `;

      // Añadir listeners después de renderizar el formulario
      document.getElementById('create-reserva-form').addEventListener('submit', handleFormSubmit);
      document.getElementById('cancel-btn').addEventListener('click', () => router.navigate('/salas'));

    } catch (error) {
      Swal.fire('Error', 'No se pudo cargar la información de la sala.', 'error');
      router.navigate('/salas');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const reservaData = Object.fromEntries(formData.entries());
    
    // Añadimos el ID de la sala a los datos de la reserva
    reservaData.sala_id = parseInt(salaId, 10);

    try {
      await reservaService.create(reservaData);
      Swal.fire({
        title: '¡Reserva Creada!',
        text: 'Tu reserva ha sido registrada exitosamente.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
      // Redirigir a la lista de "Mis Reservas" después de crear
      setTimeout(() => router.navigate('/reservas'), 1500);
    } catch (error) {
      Swal.fire('Error', 'No se pudo crear la reserva. ' + error.message, 'error');
    }
  };

  loadSalaInfoAndRenderForm();
};