import { Router } from 'express';
import { listarSalas, crearSala } from '../controllers/salasController.js';

const router = Router();

router.get('/', listarSalas);       // GET /api/salas
router.post('/', crearSala);        // POST /api/salas

export default router;