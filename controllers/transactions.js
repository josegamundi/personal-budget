import { pool } from "../config/db.js";

export const getAllTransactions = async (req, res, next) => {
  try {
    const response = await pool.query('SELECT * FROM transactions');
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
      ]
    };
    const response = await pool.query(query);
    res.json(response.rows);
  } catch(error) {
    next(error);
  }
};

export const updateTransaction = async(req, res ,next) => {
  try {
    const transactionId = Number(req.params.id);
    const update = req.body;
    const query = {
      text: `
        UPDATE transactions
        SET (title, type, amount, note) = ($1, $2, $3, $4)
        WHERE transaction_id = $5
        RETURNING *
      `,
      values: [ 
        update.title, 
        update.type, 
        update.amount, 
        update.note,
        transactionId
      ]
    };
    const response = await pool.query(query);
    res.json(response.rows);
  } catch(error) {
    next(error);
  }
};

export const deleteTransaction = async(req, res ,next) => {
  try {
    const transactionId = Number(req.params.id);
    const query = {
      text: `
        DELETE FROM transactions
        WHERE transaction_id = $1
        RETURNING *
      `,
      values: [
        transactionId
      ]
    };
    const response = await pool.query(query);
    res.json(response.rows);
  } catch(error) {
    next(error);
  }
};