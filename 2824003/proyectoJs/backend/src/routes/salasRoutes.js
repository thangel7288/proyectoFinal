import express from 'express';
import { protect, authorize } from '../middlewares/auth.js';

// --- IMPORTACIÓN CORREGIDA ---
// Importamos la nueva función 'desactivarSala' en lugar de 'eliminarSala'.
import {
  listarSalas,
  getSalaById,
  crearSala,
  actualizarSala,
  desactivarSala 
} from '../controllers/salasController.js';

const router = express.Router();

// --- Definición de Rutas ---

// Rutas de LECTURA (GET): Permitidas para todos los roles logueados.
router.get('/', protect, authorize('admin', 'asistente', 'empleado'), listarSalas);
router.get('/:id', protect, authorize('admin', 'asistente', 'empleado'), getSalaById);

// Rutas de ESCRITURA (POST, PUT): Restringidas solo para el 'admin'.
router.post('/', protect, authorize('admin'), crearSala);
router.put('/:id', protect, authorize('admin'), actualizarSala);

// --- RUTA DE ELIMINACIÓN ACTUALIZADA ---
// Ahora, el método DELETE llama a la nueva función 'desactivarSala'.
router.delete('/:id', protect, authorize('admin'), desactivarSala);

export default router;
