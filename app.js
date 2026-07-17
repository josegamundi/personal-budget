import 'dotenv/config'
import express from 'express';

import { transactionsRouter } from './routes/transactions.js';

const app = express();
const port = process.env.PORT;

app.use('/transactions', transactionsRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});