import express from 'express';
import { tokenAuth } from '../middlewares/auth.js';
import { transactionBody } from '../schemas/transactions.js';
import {
  validateRequiredFields,
  validateIdParam
} from '../middlewares/validation.js';
import {
  getTransactions,
  getSummary, 
  createTransaction,
  updateTransaction,
  deleteTransaction
} from '../controllers/transactions.js';

export const transactionsRouter = express.Router();

transactionsRouter.use('/', tokenAuth);

transactionsRouter.get('/',
  getTransactions
);
transactionsRouter.get('/summary',
  getSummary
);
transactionsRouter.post('/',
  validateRequiredFields(transactionBody, 'body'),
  createTransaction
);
transactionsRouter.put('/:id',
  validateIdParam,
  validateRequiredFields(transactionBody, 'body'),
  updateTransaction
);
transactionsRouter.delete('/:id',
  validateIdParam,
  deleteTransaction
);