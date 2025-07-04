import express from 'express';
import { protect, authorize } from '../middlewares/auth.js';
import { 
    crearReserva, 
    listarReservas, 
    cancelarReserva 
} from '../controllers/reservaController.js';

const router = express.Router();

// Todas las rutas de reservas requieren que el usuario esté autenticado.
router.use(protect);

// --- DEFINICIÓN DE RUTAS PARA RESERVAS ---

/**
 * @route   GET /api/reservas
 * @desc    Obtener las reservas (todas para admin/asistente, propias para empleado)
 * @access  Private (admin, asistente, empleado)
 */
router.get('/', 
    authorize('admin', 'asistente', 'empleado'), 
    listarReservas
);

/**
 * @route   POST /api/reservas
 * @desc    Crear una nueva reserva
 * @access  Private (admin, asistente, empleado)
 */
router.post('/', 
    authorize('admin', 'asistente', 'empleado'), 
    crearReserva
);

/**
 * @route   DELETE /api/reservas/:id
 * @desc    Cancelar una reserva
 * @access  Private (el controlador verifica si es admin, asistente o el dueño)
 */
router.delete('/:id', 
    authorize('admin', 'asistente', 'empleado'), 
    cancelarReserva
);

export default router;