import { pool } from '../config/database.js';

export const listarDepartamentos = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM departamentos');
    res.json(rows);
  } catch (error) {
    next(error);
  }
};