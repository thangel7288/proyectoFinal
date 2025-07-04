import { pool } from '../config/database.js';

export class Reserva {

  /**
   * Verifica si ya existe una reserva para una sala en un intervalo de tiempo.
   * La lógica clave es: un nuevo intervalo (inicio1, fin1) se superpone con uno existente (inicio2, fin2)
   * si (inicio1 < fin2) Y (fin1 > inicio2).
   * @param {number} sala_id - El ID de la sala a verificar.
   * @param {string} fecha_inicio - La fecha y hora de inicio de la nueva reserva.
   * @param {string} fecha_fin - La fecha y hora de fin de la nueva reserva.
   * @returns {Array} - Un array con las reservas en conflicto. Si está vacío, el horario está libre.
   */
  static async verificarConflictos(sala_id, fecha_inicio, fecha_fin) {
    const query = `
      SELECT * FROM reservas
      WHERE sala_id = ?
      AND estado = 'confirmada'
      AND (fecha_inicio < ? AND fecha_fin > ?)
    `;
    const [conflictos] = await pool.query(query, [sala_id, fecha_fin, fecha_inicio]);
    return conflictos;
  }

  /**
   * Crea una nueva reserva en la base de datos.
   * @param {object} reservaData - Los datos de la reserva.
   * @returns {object} - El objeto de la reserva creada.
   */
  static async create(reservaData) {
    const { motivo, sala_id, usuario_id, fecha_inicio, fecha_fin } = reservaData;
    const [result] = await pool.query(
      'INSERT INTO reservas (motivo, sala_id, usuario_id, fecha_inicio, fecha_fin) VALUES (?, ?, ?, ?, ?)',
      [motivo, sala_id, usuario_id, fecha_inicio, fecha_fin]
    );
    return { id: result.insertId, ...reservaData };
  }

  /**
   * Obtiene todas las reservas del sistema, uniendo los nombres de sala y usuario.
   * Ideal para la vista de admin/asistente.
   * @returns {Array} - Una lista de todas las reservas.
   */
  static async findAll() {
    const query = `
      SELECT 
        r.id, r.motivo, r.fecha_inicio, r.fecha_fin, r.estado,
        s.nombre AS sala_nombre,
        CONCAT(u.nombre, ' ', u.apellido) AS usuario_nombre
      FROM reservas r
      JOIN salas s ON r.sala_id = s.id
      JOIN usuarios u ON r.usuario_id = u.id
      ORDER BY r.fecha_inicio DESC
    `;
    const [rows] = await pool.query(query);
    return rows;
  }

  /**
   * Obtiene todas las reservas de un usuario específico.
   * @param {number} userId - El ID del usuario.
   * @returns {Array} - Una lista de las reservas del usuario.
   */
  static async findByUserId(userId) {
    const query = `
      SELECT 
        r.id, r.motivo, r.fecha_inicio, r.fecha_fin, r.estado,
        s.nombre AS sala_nombre
      FROM reservas r
      JOIN salas s ON r.sala_id = s.id
      WHERE r.usuario_id = ?
      ORDER BY r.fecha_inicio DESC
    `;
    const [rows] = await pool.query(query, [userId]);
    return rows;
  }

  /**
   * Encuentra una reserva por su ID.
   * @param {number} id - El ID de la reserva.
   * @returns {object} - El objeto de la reserva.
   */
  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM reservas WHERE id = ?', [id]);
    return rows[0];
  }

  /**
   * Cancela una reserva actualizando su estado a 'cancelada'.
   * @param {number} id - El ID de la reserva a cancelar.
   * @returns {number} - El número de filas afectadas.
   */
  static async cancelById(id) {
    const [result] = await pool.query(
      "UPDATE reservas SET estado = 'cancelada' WHERE id = ?",
      [id]
    );
    return result.affectedRows;
  }
}
