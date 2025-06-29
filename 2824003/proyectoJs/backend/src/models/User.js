import { pool } from '../config/database.js';
import bcrypt from 'bcryptjs';

class User {
  static async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    return rows[0];
  }

  static async create(user) {
    const { email, password_hash, nombre, apellido, rol } = user;
    const [result] = await pool.query(
      'INSERT INTO usuarios (email, password_hash, nombre, apellido, rol) VALUES (?, ?, ?, ?, ?)',
      [email, password_hash, nombre, apellido, rol || 'empleado']
    );
    return { id: result.insertId, ...user };
  }

  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

// ESTA LÍNEA ES LA MÁS IMPORTANTE PARA CORREGIR EL ERROR
// Asegúrate de que tu archivo termine exactamente con esto.
export default User;