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

// GET /api/mantenimientos -> Llama a la función para LISTAR
router.get('/', listarMantenimientos);

// POST /api/mantenimientos -> Llama a la función para CREAR
router.post('/', crearMantenimiento);

// DELETE /api/mantenimientos/:id -> Llama a la función para ELIMINAR
router.delete('/:id', eliminarMantenimiento);

export default router;
