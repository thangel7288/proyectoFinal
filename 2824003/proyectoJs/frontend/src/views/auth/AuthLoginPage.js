// 1. Importamos todo lo que necesitamos: el servicio, el router y ahora SweetAlert2
import { authService } from '../../services/apiServices.js';
import { router } from '../../router/index.js';
import Swal from 'sweetalert2';

export const AuthLoginPage = (app) => {
  // 2. Limpiamos el contenedor principal para evitar duplicar contenido
  app.innerHTML = '';

  // =================================================================
  // 3. Creación de todos los elementos con JavaScript Puro
  // =================================================================
  const container = document.createElement('div');
  container.className = 'login-container';

  const title = document.createElement('h2');
  title.textContent = 'Iniciar Sesión';

  const form = document.createElement('form');
  form.id = 'login-form';
  form.className = 'login-form';
  // Nota: quitamos el "novalidate" si lo tuviera para que nuestro JS se encargue

  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.id = 'email';
  emailInput.placeholder = 'Correo electrónico';
  // emailInput.value = 'andres.gomez@correo.com'; // Puedes dejar esto para pruebas rápidas

  const passwordInput = document.createElement('input');
  passwordInput.type = 'password';
  passwordInput.id = 'password';
  passwordInput.placeholder = 'Contraseña';
  // passwordInput.value = 'password123'; // Puedes dejar esto para pruebas rápidas

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.textContent = 'Entrar';
  
  // =================================================================
  // 4. Añadimos los elementos al DOM en el orden correcto
  // =================================================================
  form.appendChild(emailInput);
  form.appendChild(passwordInput);
  form.appendChild(submitButton);

  container.appendChild(title);
  container.appendChild(form);

  app.appendChild(container);
  
  // =================================================================
  // 5. Lógica del formulario (aquí está la mayor parte de la magia)
  // =================================================================
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim(); // Usamos .trim() para quitar espacios en blanco
    const password = passwordInput.value.trim();

    // --- NUEVA VALIDACIÓN CON SWEETALERT ---
    if (!email) {
      Swal.fire({
        title: '¡Campo Requerido!',
        text: 'Por favor, ingresa tu correo electrónico.',
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Entendido'
      });
      return; // Detenemos la ejecución si el campo está vacío
    }

    if (!password) {
      Swal.fire({
        title: '¡Campo Requerido!',
        text: 'Por favor, ingresa tu contraseña.',
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Entendido'
      });
      return; // Detenemos la ejecución
    }
    // --- FIN DE LA VALIDACIÓN ---


    // Si la validación pasa, intentamos el login (la lógica que ya tenías)
    try {
      await authService.login(email, password);
      router.navigate('salas');
    } catch (error) {
      // Usamos SweetAlert también para el error de login. ¡Mucho mejor!
      Swal.fire({
        title: 'Error en el inicio de sesión',
        text: error.message, // Mostramos el mensaje de error que viene del backend
        icon: 'error',
        confirmButtonText: 'Intentar de nuevo'
      });
      console.error(error);
    }
  });
}