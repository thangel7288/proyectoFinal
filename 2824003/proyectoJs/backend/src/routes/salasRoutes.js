import { Router } from 'express';
// Importamos las dos funciones (listar y crear) del controlador
import { listarSalas, crearSala } from '../controllers/salasController.js'; 
import { protect, admin } from '../middlewares/auth.js';

const router = Router();

// Ruta para obtener la lista de salas
router.get('/', protect, listarSalas);

// Ruta para crear una nueva sala (solo para admins)
router.post('/', protect, admin, crearSala); 

// Este archivo tiene solo UN export default.
export default router;