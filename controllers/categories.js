import { pool } from "../config/db.js";

export const getCategories = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const query = {
      text: `
        SELECT * FROM categories
        WHERE user_id = $1
      `,
      values: [
        userId
      ]
    };
    const response = await pool.query(query);
    res.json(response.rows);
  } catch(error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const category = req.body;
    const query = {
      text: `
        INSERT INTO categories(name, user_id) 
        VALUES($1, $2)
        RETURNING *
      `,
      values: [ 
        category.name,
        userId
      ]
    };
    const response = await pool.query(query);
    res.status(201).json(response.rows);
  } catch(error) {
    switch (error.code) {
      case "23505":
        res.status(409).json({ "message": "The category already exists" });
        break;
      case "23502":
        res.status(400).json({ "message": "The category name is missing" });
        break;
      default:
        next(error);
    }
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const categoryId = Number(req.params.id);
    if (isNaN(categoryId)) {
      const error = new Error("Invalid data type for category id");
      error.status = 400;
      throw error;
    }
    const update = req.body;
    const query = {
      text: `
        UPDATE categories
        SET name = $1
        WHERE category_id = $2 AND user_id = $3
        RETURNING *
      `,
      values: [
        update.name,
        categoryId,
        userId
      ]
    };
    const response = await pool.query(query);
    if (response.rows.length) {
      res.json(response.rows);
    } else {
      res.status(404).json({ "message": "Category not found" });
    }
  } catch(error) {
    switch (error.code) {
      case "23505":
        res.status(409).json({ "message": "The category name already exists" });
        break;
      case "23502":
        res.status(400).json({ "message": "The category name is missing" });
        break;
      default:
        next(error);
    }
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const categoryId = Number(req.params.id);
    const query = {
      text: `
        DELETE FROM categories
        WHERE category_id = $1 AND user_id = $2
        RETURNING *
      `,
      values: [
        categoryId,
        userId
      ]
    };
    const response = await pool.query(query);
    if (response.rows.length) {
      res.json(response.rows);
    } else {
      res.status(404).json({ "message": "Category not found" });
    }
  } catch(error) {
    next(error);
  }
};