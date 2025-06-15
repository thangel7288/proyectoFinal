import { pool } from '../config/database.js'; // Import nombrado

class Sala {
  static async getAll() {
    const [rows] = await pool.query('SELECT * FROM salas');
    return rows;
  }
}

// Exportación por defecto
export default Sala;