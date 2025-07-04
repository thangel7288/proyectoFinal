import { pool } from '../config/database.js';

export class Role {
  static async findByName(name) {
    const [rows] = await pool.query('SELECT id FROM roles WHERE nombre = ?', [name]);
    return rows[0];
  }
}