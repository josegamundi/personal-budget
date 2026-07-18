import { pool } from "../config/db.js";

export const getAllTransactions = async (req, res, next) => {
  try {
    const response = await pool.query('SELECT * FROM users');
    res.json(response.rows);
  } catch(error) {
    next(error);
  }
};

export const createTransaction = async(req, res ,next) => {
  try {
    const transaction = req.body;
    const query = {
      text: `
        INSERT INTO transactions(title, type, amount, note) 
        VALUES($1, $2, $3, $4)
        RETURNING *
      `,
      values: [ 
        transaction.title, 
        transaction.type, 
        transaction.amount, 
        transaction.note
      ],
    };
    const response = await pool.query(query);
    res.json(response.rows);
  } catch(error) {
    next(error);
  }
};