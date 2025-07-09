import { pool } from '../config/database.js';

export class User {
  // --- OTRAS FUNCIONES CRUD (sin cambios) ---
  static async getAllWithRole() {
    const query = `
      SELECT u.id, u.nombre, u.apellido, u.email, u.activo, u.fecha_registro, r.nombre AS rol_nombre
      FROM usuarios u
      JOIN roles r ON u.rol_id = r.id
    `;
    const [rows] = await pool.query(query);
    return rows;
  }
  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);
    return rows[0];
  }
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
  static async create(userData) {
    const { nombre, apellido, email, password_hash, rol_id } = userData;
    const [result] = await pool.query(
      'INSERT INTO usuarios (nombre, apellido, email, password_hash, rol_id) VALUES (?, ?, ?, ?, ?)',
      [nombre, apellido, email, password_hash, rol_id]
    );
    return { id: result.insertId, ...userData };
  }
  static async updateById(id, userData) {
    const { nombre, apellido, email, rol_id } = userData;
    const [result] = await pool.query(
      'UPDATE usuarios SET nombre = ?, apellido = ?, email = ?, rol_id = ? WHERE id = ?',
      [nombre, apellido, email, rol_id, id]
    );
    return result.affectedRows;
  }
  static async deleteById(id) {
    const [result] = await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
    return result.affectedRows;
  }

  // --- NUEVO MÉTODO AÑADIDO ---
  /**
   * Verifica si un usuario tiene registros asociados en otras tablas.
   * @param {number} userId - El ID del usuario a verificar.
   * @returns {boolean} - Devuelve true si encuentra alguna dependencia, false si no.
   */
  static async tieneDependencias(userId) {
    // Lista de tablas y columnas que dependen de 'usuarios.id'
    const dependencias = [
      { tabla: 'reservas', columna: 'usuario_id' },
      { tabla: 'mantenimientos', columna: 'creado_por_usuario_id' },
      { tabla: 'notificaciones', columna: 'usuario_id' }
    ];

    for (const dep of dependencias) {
      const query = `SELECT id FROM ${dep.tabla} WHERE ${dep.columna} = ? LIMIT 1`;
      const [rows] = await pool.query(query, [userId]);
      if (rows.length > 0) {
        // Si encontramos al menos un registro en cualquiera de las tablas, paramos y devolvemos true.
        console.log(`[DEBUG] Dependencia encontrada para usuario ${userId} en tabla ${dep.tabla}`);
        return true; 
      }
    }

    // Si el bucle termina sin encontrar nada, no hay dependencias.
    return false;
  }
}