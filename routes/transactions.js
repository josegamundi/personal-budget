import {
  getAllTransactions,
  createTransaction 
} from '../controllers/transactions.js';
import express from 'express';

export const transactionsRouter = express.Router();

transactionsRouter.get('/', getAllTransactions);
transactionsRouter.post('/', createTransaction);