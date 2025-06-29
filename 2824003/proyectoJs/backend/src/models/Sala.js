import { pool } from '../config/database.js';

class Sala {
  // El método que ya tenías para listar las salas
  static async getAll() {
    const [rows] = await pool.query('SELECT * FROM salas');
    return rows;
  }

  // El nuevo método para crear una sala
  static async create({ nombre, capacidad, ubicacion, departamento_id, equipamiento }) {
    const [result] = await pool.query(
      'INSERT INTO salas (nombre, capacidad, ubicacion, departamento_id, equipamiento) VALUES (?, ?, ?, ?, ?)',
      [nombre, capacidad, ubicacion, departamento_id, JSON.stringify(equipamiento || {})]
    );
    return { id: result.insertId, nombre, capacidad };
  }
}

// Este archivo tiene solo UN export default.
export default Sala;