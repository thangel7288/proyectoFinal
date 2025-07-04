import { pool } from '../config/database.js';

export class Notificacion {

  /**
   * Crea una nueva notificación en la base de datos.
   * @param {object} data - Los datos de la notificación { usuario_id, mensaje, tipo, reserva_id }
   * @returns {object} - El objeto de la notificación creada.
   */
  static async create(data) {
    const { usuario_id, mensaje, tipo = 'info_general', reserva_id = null } = data;
    const query = `
      INSERT INTO notificaciones (usuario_id, mensaje, tipo, reserva_id) 
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, [usuario_id, mensaje, tipo, reserva_id]);
    return { id: result.insertId, ...data };
  }

  /**
   * Encuentra todas las notificaciones para un usuario específico, ordenadas por fecha.
   * @param {number} userId - El ID del usuario.
   * @returns {Array} - Una lista de las notificaciones del usuario.
   */
  static async findByUserId(userId) {
    const query = `
      SELECT * FROM notificaciones 
      WHERE usuario_id = ? 
      ORDER BY fecha_creacion DESC
    `;
    const [rows] = await pool.query(query, [userId]);
    return rows;
  }

  /**
   * Cuenta el número de notificaciones no leídas para un usuario.
   * @param {number} userId - El ID del usuario.
   * @returns {number} - El total de notificaciones no leídas.
   */
  static async countUnreadByUserId(userId) {
    const query = "SELECT COUNT(*) as unreadCount FROM notificaciones WHERE usuario_id = ? AND leida = FALSE";
    const [rows] = await pool.query(query, [userId]);
    return rows[0].unreadCount;
  }

  /**
   * Marca una notificación específica como leída.
   * @param {number} notificationId - El ID de la notificación a marcar.
   * @returns {number} - El número de filas afectadas (debería ser 1).
   */
  static async markAsRead(notificationId) {
    const query = "UPDATE notificaciones SET leida = TRUE WHERE id = ?";
    const [result] = await pool.query(query, [notificationId]);
    return result.affectedRows;
  }

  /**
   * Marca todas las notificaciones de un usuario como leídas.
   * @param {number} userId - El ID del usuario.
   * @returns {number} - El número de filas afectadas.
   */
  static async markAllAsReadByUserId(userId) {
    const query = "UPDATE notificaciones SET leida = TRUE WHERE usuario_id = ? AND leida = FALSE";
    const [result] = await pool.query(query, [userId]);
    return result.affectedRows;
  }
}