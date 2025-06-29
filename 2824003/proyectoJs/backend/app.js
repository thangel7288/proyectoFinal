import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';

import salasRouter from './src/routes/salasRoutes.js';
import authRouter from './src/routes/authRoutes.js';
import { errorHandler } from './src/middlewares/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('¡API de Reservas de Salas funcionando!');
});

// ===================================================================
// RUTA DE PRUEBA: Vamos a ver si el servidor responde a esto.
// ===================================================================
app.get('/test-ruta', (req, res) => {
  res.send('¡La ruta de prueba en app.js funciona!');
});
// ===================================================================

// Usamos los routers importados
app.use('/api/salas', salasRouter);
app.use('/api/auth', authRouter);


// Middlewares de Manejo de Errores
app.use((req, res, next) => {
  res.status(404).json({ message: 'La ruta solicitada no existe.' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo exitosamente en http://localhost:${PORT}`);
});