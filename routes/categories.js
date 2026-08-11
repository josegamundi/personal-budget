import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categories.js';
import { tokenAuth } from '../middlewares/auth.js';
import express from 'express';

export const categoriesRouter = express.Router();

categoriesRouter.use('/', tokenAuth);

categoriesRouter.get('/', getCategories);
categoriesRouter.post('/', createCategory);
categoriesRouter.put('/:id', updateCategory);
categoriesRouter.delete('/:id', deleteCategory);