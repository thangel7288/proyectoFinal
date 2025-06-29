import { authService } from '../../services/apiServices.js'; 
import { router } from '../../router/index.js';

// El nombre de la función ahora es AuthLoginPage
export const AuthLoginPage = (app) => {
  app.innerHTML = `
    <div class="login-container">
      <h2>Iniciar Sesión</h2>
      <form id="login-form" class="login-form">
        <input type="email" id="email" placeholder="Correo electrónico" required value="andres.gomez@correo.com" />
        <input type="password" id="password" placeholder="Contraseña" required value="password123" />
        <button type="submit">Entrar</button>
        <p id="error-message" class="error-message"></p>
      </form>
    </div>
  `;

  const form = document.getElementById('login-form');
  const errorMessage = document.getElementById('error-message');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    errorMessage.textContent = '';
    
    try {
      await authService.login(email, password);
      router.navigate('salas'); 
    } catch (error) {
      errorMessage.textContent = error.message;
      console.error(error);
    }
  });
};
