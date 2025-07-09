import { pool } from '../config/database.js';

export class Mantenimiento {

  /**
   * Verifica si ya existe una reserva o un mantenimiento para una sala en un intervalo de tiempo.
   */
  static async verificarConflictos(sala_id, fecha_inicio, fecha_fin) {
    const conflictoReservasQuery = `
      SELECT id FROM reservas
      WHERE sala_id = ? AND estado = 'confirmada' AND (fecha_inicio < ? AND fecha_fin > ?)
    `;
    const [reservasEnConflicto] = await pool.query(conflictoReservasQuery, [sala_id, fecha_fin, fecha_inicio]);

    if (reservasEnConflicto.length > 0) return true;

    const conflictoMantenimientosQuery = `
      SELECT id FROM mantenimientos
      WHERE sala_id = ? AND (fecha_inicio < ? AND fecha_fin > ?)
    `;
    const [mantenimientosEnConflicto] = await pool.query(conflictoMantenimientosQuery, [sala_id, fecha_fin, fecha_inicio]);

    return mantenimientosEnConflicto.length > 0;
  }

  /**
   * Crea un nuevo mantenimiento.
   */
  static async create(mantenimientoData) {
    const { sala_id, motivo, fecha_inicio, fecha_fin, creado_por_usuario_id } = mantenimientoData;
    const [result] = await pool.query(
      'INSERT INTO mantenimientos (sala_id, motivo, fecha_inicio, fecha_fin, creado_por_usuario_id) VALUES (?, ?, ?, ?, ?)',
      [sala_id, motivo, fecha_inicio, fecha_fin, creado_por_usuario_id]
    );
    return { id: result.insertId, ...mantenimientoData };
  }

  /**
   * Obtiene todos los mantenimientos programados.
   */
  static async findAll() {
    const query = `
      SELECT 
        m.id, m.motivo, m.fecha_inicio, m.fecha_fin,
        s.nombre AS sala_nombre
      FROM mantenimientos m
      JOIN salas s ON m.sala_id = s.id
      ORDER BY m.fecha_inicio DESC
    `;
    const [rows] = await pool.query(query);
    return rows;
  }

  /**
   * Elimina un mantenimiento por su ID.
   */
  static async deleteById(id) {
    const [result] = await pool.query('DELETE FROM mantenimientos WHERE id = ?', [id]);
    return result.affectedRows;
  }
}
