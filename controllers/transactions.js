import { pool } from "../config/db.js";

export const getTransactions = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const query = {
      text: `
        SELECT * FROM transactions
        WHERE user_id = $1
      `,
      values: [
        userId
      ]
    };
    const response = await pool.query(query);
    res.json(response.rows);
  } catch(error) {
    next(error);
  }
};

export const getSummary = async(req, res, next) => {
  try {
    const userId = req.user.user_id;
    const query = {
      text: `
        SELECT type, SUM(amount) AS total FROM transactions
        WHERE user_id = $1
        GROUP BY type
      `,
      values: [
        userId
      ]
    };
    const response = await pool.query(query);
    
    let incomes = response.rows.find((row) => row.type === "income");
    incomes = incomes ? Number(incomes.total) : 0;
    let expenses = response.rows.find((row) => row.type === "expense");
    expenses = expenses ? Number(expenses.total) : 0;
    const balance = incomes - expenses;

    res.json({
      "incomes": incomes,
      "expenses": expenses,
      "balance": balance
    });
  } catch(error) {
    next(error);
  }
};

export const createTransaction = async(req, res ,next) => {
  try {
    const userId = req.user.user_id;
    const transaction = req.body;
    const query = {
      text: `
        INSERT INTO transactions(title, type, amount, note, user_id) 
        VALUES($1, $2, $3, $4, $5)
        RETURNING *
      `,
      values: [ 
        transaction.title, 
        transaction.type, 
        transaction.amount, 
        transaction.note,
        userId
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
    const userId = req.user.user_id;
    const transactionId = Number(req.params.id);
    const update = req.body;
    const query = {
      text: `
        UPDATE transactions
        SET (title, type, amount, note) = ($1, $2, $3, $4)
        WHERE transaction_id = $5 and user_id = $6
        RETURNING *
      `,
      values: [ 
        update.title, 
        update.type, 
        update.amount, 
        update.note,
        transactionId,
        userId
      ]
    };
    const response = await pool.query(query);
    if (response.rows.length) {
      res.json(response.rows);
    } else {
      res.status(403).json({ "message": "You are not authorized to update the transaction" });
    }
  } catch(error) {
    next(error);
  }
};

export const deleteTransaction = async(req, res ,next) => {
  try {
    const userId = req.user.user_id;
    const transactionId = Number(req.params.id);
    const query = {
      text: `
        DELETE FROM transactions
        WHERE transaction_id = $1 and user_id = $2
        RETURNING *
      `,
      values: [
        transactionId,
        userId
      ]
    };
    const response = await pool.query(query);
    if (response.rows.length) {
      res.json(response.rows);
    } else {
      res.status(403).json({ "message": "You are not authorized to delete the transaction" });
    }
  } catch(error) {
    next(error);
  }
};