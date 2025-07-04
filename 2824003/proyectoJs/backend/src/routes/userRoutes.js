import express from 'express';
import { protect, authorize } from '../middlewares/auth.js';

// --- LÍNEA CORREGIDA ---
// Listamos explícitamente todas las funciones que vamos a usar.
import { 
    listarUsuarios, 
    crearUsuario, 
    obtenerUsuarioPorId, 
    actualizarUsuario, 
    eliminarUsuario 
} from '../controllers/userController.js';

const router = express.Router();

// Esta línea es perfecta. Aplica la seguridad a todas las rutas de este archivo.
router.use(protect, authorize('admin'));

// --- RUTAS (Sin cambios, ya estaban bien) ---
router.get('/', listarUsuarios);
router.post('/', crearUsuario);
router.get('/:id', obtenerUsuarioPorId);
router.put('/:id', actualizarUsuario);
router.delete('/:id', eliminarUsuario);

export default router;
