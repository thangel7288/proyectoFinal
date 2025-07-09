import { pool } from '../config/database.js';

export class Auditoria {
  /**
   * Crea un nuevo registro en la tabla de auditoría.
   * @param {object} auditoriaData - Los datos para el registro.
   * @param {number} auditoriaData.usuario_id - El ID del usuario que realiza la acción.
   * @param {string} auditoriaData.accion - La descripción de la acción.
   */
  static async create(auditoriaData) {
    const { usuario_id, accion } = auditoriaData;
    const query = 'INSERT INTO auditoria (usuario_id, accion) VALUES (?, ?)';
    await pool.query(query, [usuario_id, accion]);
  }
}
