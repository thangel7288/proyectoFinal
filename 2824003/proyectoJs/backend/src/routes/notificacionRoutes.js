import express from 'express';
import { protect } from '../middlewares/auth.js';
import {
  listarNotificaciones,
  contarNoLeidas,
  marcarComoLeida,
  marcarTodasComoLeidas
} from '../controllers/notificacionController.js';

const router = express.Router();

// Todas las rutas de notificaciones requieren que el usuario esté autenticado.
router.use(protect);

/**
 * @route   GET /api/notificaciones
 * @desc    Obtener las notificaciones del usuario logueado.
 * @access  Private
 */
router.get('/', listarNotificaciones);

/**
 * @route   GET /api/notificaciones/unread-count
 * @desc    Contar las notificaciones no leídas del usuario.
 * @access  Private
 */
router.get('/unread-count', contarNoLeidas);

/**
 * @route   PUT /api/notificaciones/read-all
 * @desc    Marcar todas las notificaciones del usuario como leídas.
 * @access  Private
 */
router.put('/read-all', marcarTodasComoLeidas);

/**
 * @route   PUT /api/notificaciones/:id/read
 * @desc    Marcar una notificación específica como leída.
 * @access  Private
 */
router.put('/:id/read', marcarComoLeida);

export default router;
