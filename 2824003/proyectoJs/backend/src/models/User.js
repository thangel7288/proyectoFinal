import { pool } from '../config/database.js';

// Usamos una clase para agrupar todas las funciones relacionadas con el modelo User
export class User {

  // --- NUEVA FUNCIÓN AÑADIDA ---
  // Obtiene todos los usuarios y une la tabla de roles para obtener el nombre del rol
  static async getAllWithRole() {
    const query = `
      SELECT u.id, u.nombre, u.apellido, u.email, u.activo, u.fecha_registro, r.nombre AS rol_nombre
      FROM usuarios u
      JOIN roles r ON u.rol_id = r.id
    `;
    const [rows] = await pool.query(query);
    return rows;
  }

  // --- OTRAS FUNCIONES CRUD ---

  // Encuentra un usuario por su ID
  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);
    return rows[0];
  }

  // --- FUNCIÓN CORREGIDA ---
  // Ahora también obtiene el nombre del rol para usarlo en el JWT del login.
  static async findByEmail(email) {
    const query = `
      SELECT u.*, r.nombre AS rol
      FROM usuarios u
      JOIN roles r ON u.rol_id = r.id
      WHERE u.email = ?
    `;
    const [rows] = await pool.query(query, [email]);
    return rows[0];
  }

  // Crea un nuevo usuario
  static async create(userData) {
    const { nombre, apellido, email, password_hash, rol_id } = userData;
    const [result] = await pool.query(
      'INSERT INTO usuarios (nombre, apellido, email, password_hash, rol_id) VALUES (?, ?, ?, ?, ?)',
      [nombre, apellido, email, password_hash, rol_id]
    );
    return { id: result.insertId, ...userData };
  }

  // Actualiza un usuario por su ID
  static async updateById(id, userData) {
    const { nombre, apellido, email, rol_id } = userData;
    const [result] = await pool.query(
      'UPDATE usuarios SET nombre = ?, apellido = ?, email = ?, rol_id = ? WHERE id = ?',
      [nombre, apellido, email, rol_id, id]
    );
    return result.affectedRows;
  }

  // Elimina un usuario por su ID
  static async deleteById(id) {
    const [result] = await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
    return result.affectedRows;
  }
}
