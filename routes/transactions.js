import {
  getAllTransactions,
  getSummary, 
  createTransaction,
  updateTransaction,
  deleteTransaction
} from '../controllers/transactions.js';
import { tokenAuth } from '../middlewares/auth.js';
import express from 'express';

export const transactionsRouter = express.Router();

transactionsRouter.use('/', tokenAuth);

transactionsRouter.get('/', getAllTransactions);
transactionsRouter.get('/summary', getSummary);
transactionsRouter.post('/', createTransaction);
transactionsRouter.put('/:id', updateTransaction);
transactionsRouter.delete('/:id', deleteTransaction);