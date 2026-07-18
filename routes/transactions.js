import {
  getAllTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction 
} from '../controllers/transactions.js';
import express from 'express';

export const transactionsRouter = express.Router();

transactionsRouter.get('/', getAllTransactions);
transactionsRouter.post('/', createTransaction);
transactionsRouter.put('/:id', updateTransaction);
transactionsRouter.delete('/:id', deleteTransaction);