import 'dotenv/config';
import express from 'express';
import { authRouter } from './routes/auth.js';
import { transactionsRouter } from './routes/transactions.js';

const app = express();
const port = process.env.PORT;

// For parsing application/json
app.use(express.json());

// Routers
app.use('/auth', authRouter);
app.use('/transactions', transactionsRouter);

// Default error handler
app.use((err, req, res, next) => {
  const errorCode = err.status || 500;
  const errorMessage = err.message;
  
  res.status(errorCode);
  res.json({
    "Error Code" : errorCode,
    "Error message" : errorMessage
  });
});

// Listening port
app.listen(port, () => {
  console.log(`Personal Budget App listening on port ${port}`);
});