import { pool } from '../config/database.js';

export class Mantenimiento {

  /**
   * Verifica si ya existe una reserva o un mantenimiento para una sala en un intervalo de tiempo.
   * @param {number} sala_id - El ID de la sala a verificar.
   * @param {string} fecha_inicio - La fecha y hora de inicio del nuevo mantenimiento.
   * @param {string} fecha_fin - La fecha y hora de fin del nuevo mantenimiento.
   * @returns {boolean} - Devuelve true si hay conflicto, false si no lo hay.
   */
  static async verificarConflictos(sala_id, fecha_inicio, fecha_fin) {
    // Consulta para verificar conflictos con RESERVAS existentes
    const conflictoReservasQuery = `
      SELECT id FROM reservas
      WHERE sala_id = ?
      AND estado = 'confirmada'
      AND (fecha_inicio < ? AND fecha_fin > ?)
    `;
    const [reservasEnConflicto] = await pool.query(conflictoReservasQuery, [sala_id, fecha_fin, fecha_inicio]);

    // Consulta para verificar conflictos con OTROS MANTENIMIENTOS existentes
    const conflictoMantenimientosQuery = `
      SELECT id FROM mantenimientos
      WHERE sala_id = ?
      AND (fecha_inicio < ? AND fecha_fin > ?)
    `;
    const [mantenimientosEnConflicto] = await pool.query(conflictoMantenimientosQuery, [sala_id, fecha_fin, fecha_inicio]);

    // Si encontramos algún resultado en cualquiera de las dos consultas, hay un conflicto.
    return reservasEnConflicto.length > 0 || mantenimientosEnConflicto.length > 0;
  }

  /**
   * Crea un nuevo mantenimiento en la base de datos.
   * @param {object} mantenimientoData - Los datos del mantenimiento.
   * @returns {object} - El objeto del mantenimiento creado.
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
   * Obtiene todos los mantenimientos programados, uniendo el nombre de la sala.
   * @returns {Array} - Una lista de todos los mantenimientos.
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
   * @param {number} id - El ID del mantenimiento a eliminar.
   * @returns {number} - El número de filas afectadas.
   */
  static async deleteById(id) {
    const [result] = await pool.query('DELETE FROM mantenimientos WHERE id = ?', [id]);
    return result.affectedRows;
  }
}
