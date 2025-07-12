import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import { testConnection } from './src/config/database.js';

// --- IMPORTACIÓN DE RUTAS ---
import authRouter from './src/routes/authRoutes.js';
import salasRouter from './src/routes/salasRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import reservaRoutes from './src/routes/reservaRoutes.js';
import dashboardRoutes from './src/routes/dashboardRoutes.js';
import mantenimientoRoutes from './src/routes/mantenimientoRoutes.js';
import notificacionRoutes from './src/routes/notificacionRoutes.js';
// --- 1. IMPORTACIÓN NUEVA ---
import departamentoRoutes from './src/routes/departamentoRoutes.js';

import { errorHandler } from './src/middlewares/errorHandler.js';

const app = express();
// --- CONFIGURACIÓN DE CORS ---
const allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.error(`CORS Error: Origen no permitido: ${origin}`);
      callback(new Error('La política de CORS no permite este origen.'), false);
    }
  },
  credentials: true,
};

// --- ORDEN CORRECTO DE MIDDLEWARES ---
app.use(cors(corsOptions));
app.use(express.json());

// --- REGISTRO DE RUTAS ---
app.get('/', (req, res) => res.send('API de Reservas de Salas funcionando!'));
app.use('/api/auth', authRouter);
app.use('/api/salas', salasRouter);
app.use('/api/usuarios', userRoutes);
app.use('/api/reservas', reservaRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/mantenimientos', mantenimientoRoutes);
app.use('/api/notificaciones', notificacionRoutes);
// --- 2. LÍNEA NUEVA PARA REGISTRAR LA RUTA ---
app.use('/api/departamentos', departamentoRoutes);

// --- MANEJADORES DE ERRORES (SIEMPRE AL FINAL) ---
app.use((req, res, next) => {
  res.status(404).json({ message: 'La ruta solicitada no existe.' });
});
app.use(errorHandler);

const PORT = process.env.PORT || 3006;

const startServer = async () => {
  try {
    await testConnection();
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo exitosamente en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('No se pudo iniciar el servidor.', error);
  }
};

startServer();