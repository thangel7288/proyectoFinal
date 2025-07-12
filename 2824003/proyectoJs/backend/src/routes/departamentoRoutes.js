import { Router } from 'express';
import { listarDepartamentos } from '../controllers/departamentosController.js';
import { protect } from '../middlewares/auth.js';

const router = Router();

// Definimos la ruta GET para / que, al registrarse, se convertirá en /api/departamentos
router.get('/', protect, listarDepartamentos);

export default router;