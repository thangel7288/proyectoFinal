import express from 'express';
import { protect, authorize } from '../middlewares/auth.js';

// --- IMPORTACIONES COMPLETAS ---
import {
  listarSalas,
  getSalaById,
  crearSala,
  actualizarSala,
  desactivarSala,
  reactivarSala,
  listarSalasInactivas // <-- Se añade la nueva función
} from '../controllers/salasController.js';

const router = express.Router();

// --- Definición de Rutas ---

// RUTA NUEVA: para obtener las salas inactivas (solo para admin).
// Es importante colocarla antes de la ruta '/:id' para que no haya conflictos.
router.get('/inactivas', protect, authorize('admin'), listarSalasInactivas);

// Rutas de LECTURA (GET): Permitidas para roles logueados.
router.get('/', protect, authorize('admin', 'asistente', 'empleado'), listarSalas);
router.get('/:id', protect, authorize('admin', 'asistente', 'empleado'), getSalaById);

// Rutas de ESCRITURA (POST, PUT, DELETE): Restringidas solo para el 'admin'.
router.post('/', protect, authorize('admin'), crearSala);
router.put('/:id', protect, authorize('admin'), actualizarSala);
router.delete('/:id', protect, authorize('admin'), desactivarSala);
router.put('/:id/reactivate', protect, authorize('admin'), reactivarSala);

export default router;