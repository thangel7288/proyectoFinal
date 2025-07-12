import { pool } from '../config/database.js';

export class Sala {
  /**
   * Obtiene todas las salas que están marcadas como activas.
   */
  static async getAll() {
    const [rows] = await pool.query('SELECT * FROM salas WHERE activa = TRUE');
    return rows;
  }

  /**
   * Obtiene todas las salas que están marcadas como INACTIVAS.
   */
  static async getAllInactive() {
    const [rows] = await pool.query('SELECT * FROM salas WHERE activa = FALSE');
    return rows;
  }

  /**
   * Encuentra una sala por su ID, sin importar si está activa o no.
   */
  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM salas WHERE id = ?', [id]);
    return rows[0];
  }

  /**
   * Crea una nueva sala en la base de datos.
   */
  static async create(salaData) {
    const { nombre, capacidad, ubicacion } = salaData;
    const [result] = await pool.query(
      'INSERT INTO salas (nombre, capacidad, ubicacion) VALUES (?, ?, ?)',
      [nombre, capacidad, ubicacion]
    );
    return { id: result.insertId, ...salaData };
  }

  /**
   * Actualiza los datos de una sala por su ID.
   */
  static async updateById(id, salaData) {
    const { nombre, capacidad, ubicacion } = salaData;
    const [result] = await pool.query(
      'UPDATE salas SET nombre = ?, capacidad = ?, ubicacion = ? WHERE id = ?',
      [nombre, capacidad, ubicacion, id]
    );
    return result.affectedRows;
  }

  /**
   * Desactiva una sala (soft delete) cambiando su estado a inactivo.
   */
  static async deactivateById(id) {
    const [result] = await pool.query('UPDATE salas SET activa = FALSE WHERE id = ?', [id]);
    return result.affectedRows;
  }

  /**
   * Reactiva una sala cambiando su estado a activo.
   */
  static async reactivateById(id) {
    const [result] = await pool.query('UPDATE salas SET activa = TRUE WHERE id = ?', [id]);
    return result.affectedRows;
  }

  /**
   * Verifica si una sala tiene reservas activas a futuro.
   */
  static async tieneReservasActivas(salaId) {
    const query = "SELECT id FROM reservas WHERE sala_id = ? AND estado = 'confirmada' AND fecha_fin > NOW() LIMIT 1";
    const [rows] = await pool.query(query, [salaId]);
    return rows.length > 0;
  }

  /**
   * Verifica si una sala tiene mantenimientos programados a futuro.
   */
  static async tieneMantenimientosActivos(salaId) {
    const query = "SELECT id FROM mantenimientos WHERE sala_id = ? AND fecha_fin > NOW() LIMIT 1";
    const [rows] = await pool.query(query, [salaId]);
    return rows.length > 0;
  }
}