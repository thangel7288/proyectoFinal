// backend/src/config/database.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// 1. Exportamos el pool de conexiones para que los modelos lo puedan usar
export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  // --- LÍNEA CORREGIDA ---
  // La variable en tu archivo .env se llama DB_DATABASE, no DB_NAME.
  database: process.env.DB_DATABASE, 
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 2. Exportamos la función de prueba para que app.js la pueda usar
export const testConnection = async () => {
  try {
    console.log('🟡 Intentando conectar a la base de datos...');
    const connection = await pool.getConnection();
    console.log('✅ ¡Conexión exitosa a la base de datos!');
    connection.release(); // Liberamos la conexión
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error.message);
    process.exit(1); // Detenemos la aplicación si no se puede conectar a la BD
  }
};
