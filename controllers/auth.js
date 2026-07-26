import { pool } from "../config/db.js";
import bcrypt from "bcrypt";

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

};