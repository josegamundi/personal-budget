import { pool } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res, next) => {
  try {
    const user = req.body;
    user.password = await bcrypt.hash(user.password, 10);
    const query = {
      text: `
        INSERT INTO users(email, password)
        VALUES($1, $2)
        RETURNING user_id, email, created_at
      `,
      values: [ 
        user.email, 
        user.password
      ]
    };
    const response = await pool.query(query);
    res.json(response.rows);
  } catch(error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const user = req.body;
    const query = {
      text: `
        SELECT * FROM users
        WHERE email = $1
      `,
      values: [ 
        user.email
      ]
    };
    const response = await pool.query(query);
    
    if (response.rows.length) {
      const isThePassword = await bcrypt.compare(user.password, response.rows[0].password);
      if (!isThePassword) {
        res.status(401).json({ message: 'Invalid password, access denied' });
      } else {
        const token = jwt.sign({ "user_id": response.rows[0].user_id }, process.env.JWT_SECRET, { "expiresIn": "1h" });
        res.json({ token });
      };
    } else {
      res.status(401).json({ message: 'Invalid email, access denied' });
    }
  } catch(error) {
    next(error);
  }
};