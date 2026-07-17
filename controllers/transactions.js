import { pool } from "../config/db.js";

export const getAllTransactions = async (req, res, next) => {
  try {
    const response = await pool.query('SELECT * FROM users');
    res.json(response.rows);
  } catch(error) {
    next(error);
  }
};