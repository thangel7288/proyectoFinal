import { authService } from '../../services/apiServices.js';
import { router } from '../../router/index.js';
import Swal from 'sweetalert2';

export const AuthLoginPage = (app) => {
  // --- Iconos SVG para el botón de ver/ocultar contraseña ---
  const eyeIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
  const eyeOffIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;

  // --- Estilos CSS para el formulario y el nuevo botón ---
  const styles = `
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f4f7f6;
    }
    .login-form-wrapper {
      padding: 2.5rem;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
    }
    .login-form-wrapper h2 {
      text-align: center;
      margin-bottom: 2rem;
      color: #333;
    }
    .form-group {
      margin-bottom: 1.5rem;
    }
    .password-wrapper {
      position: relative;
    }
    #toggle-password {
      position: absolute;
      top: 50%;
      right: 10px;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      color: #888;
    }
  `;

  // --- Estructura HTML del Formulario ---
  app.innerHTML = `
    <style>${styles}</style>
    <div class="login-container">
      <div class="login-form-wrapper">
        <h2>Iniciar Sesión</h2>
        <form id="login-form">
          <div class="form-group">
            <label for="email">Correo electrónico:</label>
            <input type="email" id="email" name="email" class="form-control" required>
          </div>
          <div class="form-group">
            <label for="password">Contraseña:</label>
            <div class="password-wrapper">
              <input type="password" id="password" name="password" class="form-control" required>
              <button type="button" id="toggle-password">${eyeIcon}</button>
            </div>
          </div>
          <button type="submit" class="btn btn-primary btn-block">ENTRAR</button>
        </form>
      </div>
    </div>
  `;

  // --- Lógica del Formulario ---
  const form = document.getElementById('login-form');
  const passwordInput = document.getElementById('password');
  const togglePasswordBtn = document.getElementById('toggle-password');

  // Lógica para el botón de ver/ocultar contraseña
  togglePasswordBtn.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    // Cambiar el icono
    togglePasswordBtn.innerHTML = type === 'password' ? eyeIcon : eyeOffIcon;
  });

  // --- LÓGICA DE ENVÍO ACTUALIZADA ---
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = form.email.value;
    const password = form.password.value;

    try {
      // Obtenemos los datos del usuario para personalizar el saludo
      const { user } = await authService.login(email, password);
      
      // Mostramos la alerta de éxito
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `¡Bienvenido de nuevo, ${user.nombre}!`,
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true
      });

      // Esperamos a que la alerta sea visible antes de navegar
      setTimeout(() => {
        router.navigate('/'); 
      }, 1500);

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error de Autenticación',
        text: error.message || 'Hubo un problema al iniciar sesión.',
      });
    }
  });
};
