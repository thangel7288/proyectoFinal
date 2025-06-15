import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306, // ¡Usa DB_PORT del .env!
  user: process.env.DB_USER || 'root',        // ¡Usa DB_USER del .env!
  password: process.env.DB_PASSWORD || '',    // ¡Usa DB_PASSWORD del .env!
  database: process.env.DB_NAME || 'reservas_salas' // ¡Usa DB_NAME del .env!
});

export { pool };