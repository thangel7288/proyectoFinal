import express from 'express';
import { pool } from './config/database.js'; // Import nombrado

const app = express();

// Middleware básico para parsear JSON en las solicitudes
app.use(express.json());

// ******************************************************
// ** SOLUCIÓN PARA EL 404 EN LA RUTA RAÍZ (/) **
// ******************************************************
app.get('/', (req, res) => {
  res.send('¡Bienvenido a la API de Reservas de Salas! Puedes probar /db-test para la conexión a la base de datos.');
});
// ******************************************************

// Ruta de prueba de conexión a DB
app.get('/db-test', async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT CURRENT_USER() AS user, DATABASE() AS db");
    res.json({
      status: "✅ Conexión exitosa",
      user: rows[0].user,
      database: rows[0].db
    });
  } catch (error) {
    console.error("Error en /db-test al conectar con DB:", error);
    res.status(500).json({
      status: "❌ Error de conexión",
      error: error.message,
      solution: "Asegúrate de que tu base de datos MySQL esté corriendo y las credenciales sean correctas." // Mensaje actualizado
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});