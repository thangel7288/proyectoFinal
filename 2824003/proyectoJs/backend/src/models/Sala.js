import { pool } from '../config/database.js';

class Sala {
  static async deleteById(id) {
  const [result] = await pool.query('DELETE FROM salas WHERE id = ?', [id]);
  // El método devuelve el número de filas afectadas.
  // Será 1 si se borró exitosamente, 0 si no se encontró una sala con ese ID.
  return result.affectedRows;
}
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
  static async updateById(id, salaData) {
  // Extraemos los datos del objeto que recibimos
  const { nombre, capacidad, ubicacion, equipamiento } = salaData;

  // El campo JSON en la base de datos espera un string, así que lo convertimos.
  // Si no viene equipamiento, lo dejamos como un objeto vacío.
  const equipamientoString = JSON.stringify(equipamiento || {});

  const [result] = await pool.query(
    'UPDATE salas SET nombre = ?, capacidad = ?, ubicacion = ?, equipamiento = ? WHERE id = ?',
    [nombre, capacidad, ubicacion, equipamientoString, id]
  );
  
  return result.affectedRows; // Devolvemos 1 si se actualizó, 0 si no se encontró.
}
static async findById(id) {
  const [rows] = await pool.query('SELECT * FROM salas WHERE id = ?', [id]);
  return rows[0]; // Devuelve la sala encontrada o undefined
}
}

// Este archivo tiene solo UN export default.
export default Sala;
