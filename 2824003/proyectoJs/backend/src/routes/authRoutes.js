import express from 'express';
// --- CORRECCIÓN ---
// Solo importamos la función 'login', que es la que existe en el controlador.
import { login } from '../controllers/authController.js';

const router = express.Router();

// La única ruta que necesitamos aquí es la de login.
router.post('/login', login);

// Si tenías una ruta para '/register', la hemos eliminado porque el controlador ya no la maneja.
// La creación de usuarios ahora la hace el admin desde el 'userController'.

export default router;
