import mysql from 'mysql2/promise';
// 1. Importamos y configuramos dotenv AQUÍ MISMO.
// Esto garantiza que las variables de entorno se carguen antes de crear la conexión.
import dotenv from 'dotenv';
dotenv.config();

// 2. Creamos el pool de conexiones usando las variables de process.env
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER, // Ya no necesita un valor por defecto
  password: process.env.DB_PASSWORD, // Ya no necesita un valor por defecto
  database: process.env.DB_NAME, // Ya no necesita un valor por defecto
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 3. (Opcional pero recomendado) Añadimos un pequeño test de conexión
pool.getConnection()
    .then(connection => {
        console.log('✅ Conexión a la base de datos exitosa.');
        connection.release(); // Libera la conexión
    })
    .catch(err => {
        console.error('❌ Error al conectar con la base de datos:', err.message);
    });

export { pool };