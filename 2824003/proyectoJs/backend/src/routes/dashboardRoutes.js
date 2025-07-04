import express from 'express';
import { protect, authorize } from '../middlewares/auth.js';
import { getDashboardStats } from '../controllers/dashboardController.js';

const router = express.Router();

/**
 * @route   GET /api/dashboard/stats
 * @desc    Obtiene todas las estadísticas para el panel de administrador.
 * @access  Private (solo para admin)
 */
router.get(
  '/stats',
  protect,
  authorize('admin'),
  getDashboardStats
);

export default router;
