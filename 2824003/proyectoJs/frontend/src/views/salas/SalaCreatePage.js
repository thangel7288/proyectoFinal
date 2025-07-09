import { salaService } from '../../services/apiServices.js';
import { router } from '../../router/index.js';
import Swal from 'sweetalert2';

/**
 * Componente de página para crear una nueva sala, construido con JavaScript puro para mayor robustez.
 * @param {HTMLElement} container - El elemento donde se inyectará el contenido.
 */
export const SalaCreatePage = (container) => {
  // 1. Limpiamos el contenedor para asegurarnos de que no haya contenido antiguo.
  container.innerHTML = '';

  // 2. Creamos los elementos del DOM uno por uno.
  const formWrapper = document.createElement('div');
  formWrapper.className = 'form-view-container';

  const title = document.createElement('h2');
  title.textContent = 'Crear Nueva Sala';

  const form = document.createElement('form');
  form.id = 'create-sala-form';
  form.noValidate = true;

  // --- Helper para crear campos de formulario de forma consistente ---
  const createFormGroup = (labelText, inputType, inputId, options = {}) => {
    const group = document.createElement('div');
    group.className = 'form-group';

    const label = document.createElement('label');
    label.htmlFor = inputId;
    label.textContent = labelText;

    let input;
    if (inputType === 'textarea') {
      input = document.createElement('textarea');
      input.rows = options.rows || 3;
    } else {
      input = document.createElement('input');
      input.type = inputType;
    }

    input.id = inputId;
    input.name = inputId; // El 'name' debe coincidir con el 'id' para FormData
    input.className = 'form-control';
    if (options.required) input.required = true;
    if (options.min) input.min = options.min;
    if (options.placeholder) input.placeholder = options.placeholder;

    group.appendChild(label);
    group.appendChild(input);
    return group;
  };

  // --- Creamos y añadimos cada campo al formulario ---
  form.appendChild(createFormGroup('Nombre de la Sala:', 'text', 'nombre', { required: true }));
  form.appendChild(createFormGroup('Capacidad:', 'number', 'capacidad', { required: true, min: '1', placeholder: 'Ej: 10' }));
  form.appendChild(createFormGroup('Ubicación:', 'text', 'ubicacion', { required: true, placeholder: 'Ej: Piso 3, Ala Norte' }));
  

  // --- Creamos y añadimos los botones de acción ---
  const formActions = document.createElement('div');
  formActions.className = 'form-actions';

  const cancelButton = document.createElement('button');
  cancelButton.type = 'button';
  cancelButton.className = 'btn btn-secondary';
  cancelButton.textContent = 'Cancelar';

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.className = 'btn btn-primary';
  submitButton.textContent = 'Guardar Sala';

  formActions.appendChild(cancelButton);
  formActions.appendChild(submitButton);
  form.appendChild(formActions);

  // 3. Ensamblamos la estructura final y la añadimos al contenedor de la página.
  formWrapper.appendChild(title);
  formWrapper.appendChild(form);
  container.appendChild(formWrapper);

  // --- Lógica del formulario (sin cambios) ---
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const formData = new FormData(form);
    const salaData = Object.fromEntries(formData.entries());
    try {
      if (salaData.equipamiento) {
        salaData.equipamiento = JSON.parse(salaData.equipamiento);
      } else {
        delete salaData.equipamiento;
      }
    } catch (error) {
      Swal.fire('Error de Formato', 'El campo de equipamiento no es un JSON válido.', 'error');
      return;
    }
    try {
      await salaService.create(salaData);
      Swal.fire({
        title: '¡Éxito!', text: 'La sala ha sido creada correctamente.', icon: 'success',
        timer: 2000, showConfirmButton: false
      });
      router.navigate('/salas');
    } catch (error) {
      Swal.fire('Error', 'No se pudo crear la sala. ' + error.message, 'error');
    }
  });

  cancelButton.addEventListener('click', () => {
    router.navigate('/salas');
  });
};