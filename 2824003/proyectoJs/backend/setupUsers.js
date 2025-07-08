// Importamos las librerías necesarias
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs'; // Usamos bcryptjs, que es el que instalamos
import dotenv from 'dotenv';

// Cargamos las variables de entorno del archivo .env
dotenv.config();

// --- CONFIGURACIÓN DE USUARIOS A CREAR/ACTUALIZAR ---
// Aquí defines los usuarios que quieres que existan en el sistema.
// Puedes añadir o quitar los que necesites.
const usersToSetup = [
  { 
    nombre: 'Admin', 
    apellido: 'Principal', 
    email: 'admin@app.com', 
    password: 'password123', // La contraseña en texto plano
    rol_id: 1 // 1 = admin
  },
  { 
    nombre: 'Empleado', 
    apellido: 'Prueba', 
    email: 'empleado@app.com', 
    password: 'password123', 
    rol_id: 2 // 2 = empleado
  },
  { 
    nombre: 'Asistente', 
    apellido: 'Prueba', 
    email: 'asistente@app.com', 
    password: 'password123', 
    rol_id: 3 // 3 = asistente
  }
];

// --- CONFIGURACIÓN DE LA BASE DE DATOS ---
// Lee las credenciales desde tu archivo .env
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE // Corregido para usar DB_DATABASE
};

async function setupUsers() {
  let connection;
  console.log("Iniciando configuración de usuarios...");

  try {
    // Nos conectamos a la base de datos
    connection = await mysql.createConnection(dbConfig);
    console.log("Conexión a la base de datos exitosa.");

    // Iteramos sobre cada usuario que definimos arriba
    for (const user of usersToSetup) {
      console.log(`\nProcesando usuario: ${user.email}...`);

      // Encriptamos la contraseña
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(user.password, saltRounds);
      console.log(` -> Contraseña para ${user.email} encriptada.`);

      // Verificamos si el usuario ya existe usando su email
      const [rows] = await connection.execute(
        'SELECT id FROM usuarios WHERE email = ?',
        [user.email]
      );

      // Si el usuario ya existe, actualizamos su contraseña
      if (rows.length > 0) {
        await connection.execute(
          'UPDATE usuarios SET password_hash = ? WHERE email = ?',
          [hashedPassword, user.email]
        );
        console.log(` -> ✅ ¡Éxito! El usuario '${user.email}' fue actualizado.`);
      } else {
        // Si el usuario no existe, lo creamos
        await connection.execute(
          'INSERT INTO usuarios (nombre, apellido, email, password_hash, rol_id) VALUES (?, ?, ?, ?, ?)',
          [user.nombre, user.apellido, user.email, hashedPassword, user.rol_id]
        );
        console.log(` -> ✅ ¡Éxito! El usuario '${user.email}' fue creado.`);
      }
    }

  } catch (error) {
    console.error('❌ Error durante la configuración de usuarios:', error);
  } finally {
    // Cerramos la conexión a la base de datos al finalizar
    if (connection) {
      await connection.end();
      console.log('\nConfiguración de usuarios finalizada. Conexión cerrada.');
    }
  }
}

// Ejecutamos la función
setupUsers();