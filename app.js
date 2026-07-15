import 'dotenv/config'
import { pool } from './config/db.js';

async function connection_test() {
  const res = await pool.query('SELECT * FROM users');
  console.log('user:', res.rows[0]);
}
connection_test();