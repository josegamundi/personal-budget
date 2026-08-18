import express from 'express';
import { tokenAuth } from '../middlewares/auth.js';
import { categoryBody } from '../schemas/categories.js'
import { 
  validateRequiredFields,
  validateIdParam
} from '../middlewares/validation.js';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categories.js';

export const categoriesRouter = express.Router();

categoriesRouter.use('/', tokenAuth);

categoriesRouter.get('/',
  getCategories
);
categoriesRouter.post('/', 
  validateRequiredFields(categoryBody, 'body'), 
  createCategory
);
categoriesRouter.put('/:id',
  validateIdParam,
  validateRequiredFields(categoryBody, 'body'),
  updateCategory
);
categoriesRouter.delete('/:id',
  validateIdParam,
  deleteCategory
);