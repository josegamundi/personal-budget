import { pool } from "../config/db.js";

export const getTransactions = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const filter = req.query;
    const query = {
      text: `
        SELECT * FROM transactions
        WHERE user_id = $1
          AND ($2::timestamp IS NULL OR created_at >= $2::timestamp)
          AND ($3::timestamp IS NULL OR created_at < ($3::date + INTERVAL '1 day')::timestamp)
          AND ($4::transaction_type IS NULL OR type = $4)
          AND ($5::integer IS NULL OR category_id = $5)
        ORDER BY created_at DESC;
      `,
      values: [
        userId,
        filter.start_time,
        filter.end_time,
        filter.transaction_type,
        filter.category_id
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
        INSERT INTO transactions(title, type, amount, note, category_id, user_id) 
        VALUES($1, $2, $3, $4, $5, $6)
        RETURNING *
      `,
      values: [ 
        transaction.title, 
        transaction.type, 
        transaction.amount, 
        transaction.note,
        transaction.categoryId,
        userId
      ]
    };
    const response = await pool.query(query);
    res.status(201).json(response.rows);
  } catch(error) {
    switch (error.code) {
      case "23502":
        res.status(400).json({ "message": "A required field is missing" });
        break;
      case "23503":
        res.status(409).json({ "message": "The chosen category does not exist" });
        break;
      default:
        next(error);
    }
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
        SET (title, type, amount, note, category_id) = ($1, $2, $3, $4, $5)
        WHERE transaction_id = $6 AND user_id = $7
        RETURNING *
      `,
      values: [ 
        update.title, 
        update.type, 
        update.amount, 
        update.note,
        update.categoryId,
        transactionId,
        userId
      ]
    };
    const response = await pool.query(query);
    if (response.rows.length) {
      res.json(response.rows);
    } else {
      res.status(404).json({ "message": "Transaction not found" });
    }
  } catch(error) {
    switch (error.code) {
      case "23502":
        res.status(400).json({ "message": "A required field is missing" });
        break;
      case "23503":
        res.status(409).json({ "message": "The chosen category does not exist" });
        break;
      default:
        next(error);
    }
  }
};

export const deleteTransaction = async(req, res ,next) => {
  try {
    const userId = req.user.user_id;
    const transactionId = Number(req.params.id);
    const query = {
      text: `
        DELETE FROM transactions
        WHERE transaction_id = $1 AND user_id = $2
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
      res.status(404).json({ "message": "Transaction not found" });
    }
  } catch(error) {
    next(error);
  }
};