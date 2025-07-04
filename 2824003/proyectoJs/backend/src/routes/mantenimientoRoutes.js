import express from 'express';
import { protect, authorize } from '../middlewares/auth.js';
import {
  crearMantenimiento,
  listarMantenimientos,
  eliminarMantenimiento
} from '../controllers/mantenimientoController.js';

const router = express.Router();

// Todas las rutas de mantenimientos requieren que el usuario sea administrador.
router.use(protect, authorize('admin'));

/**
 * @route   GET /api/mantenimientos
 * @desc    Obtener todos los mantenimientos programados.
 * @access  Private (solo para admin)
 */
router.get('/', listarMantenimientos);

/**
 * @route   POST /api/mantenimientos
 * @desc    Programar un nuevo mantenimiento.
 * @access  Private (solo para admin)
 */
router.post('/', crearMantenimiento);

/**
 * @route   DELETE /api/mantenimientos/:id
 * @desc    Eliminar un mantenimiento programado.
 * @access  Private (solo para admin)
 */
router.delete('/:id', eliminarMantenimiento);

export default router;
