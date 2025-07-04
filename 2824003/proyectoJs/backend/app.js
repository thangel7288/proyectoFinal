import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import { testConnection } from './src/config/database.js';
import authRouter from './src/routes/authRoutes.js';
import salasRouter from './src/routes/salasRoutes.js';
import { errorHandler } from './src/middlewares/errorHandler.js';
import userRoutes from './src/routes/userRoutes.js';
import reservaRoutes from './src/routes/reservaRoutes.js';
import dashboardRoutes from './src/routes/dashboardRoutes.js';
import mantenimientoRoutes from './src/routes/mantenimientoRoutes.js';
import notificacionRoutes from './src/routes/notificacionRoutes.js';




const app = express();
// --- CONFIGURACIÓN DE CORS A PRUEBA DE BALAS ---
// Lista de orígenes permitidos (whitelist).
// ¡SOLUCIÓN! Añadimos tanto localhost como 127.0.0.1
const allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];

const corsOptions = {
  origin: function (origin, callback) {
    // Permitir peticiones si el origen está en la lista blanca
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // Si el origen no está permitido, rechazar la petición
      console.error(`CORS Error: Origen no permitido: ${origin}`);
      callback(new Error('La política de CORS no permite este origen.'), false);
    }
  },
  credentials: true, // Permite que el navegador envíe cookies.
};
// --- ORDEN CORRECTO DE MIDDLEWARES ---
app.use(cors(corsOptions));
app.use(express.json());
app.use('/api/usuarios', userRoutes);
app.get('/', (req, res) => res.send('API de Reservas de Salas funcionando!'));
app.use('/api/auth', authRouter);
app.use('/api/salas', salasRouter);
app.use('/api/reservas', reservaRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/mantenimientos', mantenimientoRoutes);
app.use('/api/notificaciones', notificacionRoutes);



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