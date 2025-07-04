import express from 'express';
import { 
    listarSalas, 
    getSalaById, 
    crearSala, 
    eliminarSala, 
    actualizarSala 
} from '../controllers/salasController.js'; 
// 1. Importamos 'authorize' en lugar de 'isAdmin'
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

// =================================================================
// RUTAS ACTUALIZADAS CON EL MIDDLEWARE 'authorize'
// =================================================================

// 2. Rutas de LECTURA (GET): Permitidas para todos los roles logueados.
router.get('/', 
    protect, 
    authorize('admin', 'asistente', 'empleado'), 
    listarSalas
);

router.get('/:id', 
    protect, 
    authorize('admin', 'asistente', 'empleado'), 
    getSalaById
); 

// 3. Rutas de ESCRITURA (POST, PUT, DELETE): Restringidas solo para el 'admin'.
router.post('/', 
    protect, 
    authorize('admin'), 
    crearSala
);

router.put('/:id', 
    protect, 
    authorize('admin'), 
    actualizarSala
);

router.delete('/:id', 
    protect, 
    authorize('admin'), 
    eliminarSala
);

export default router;
