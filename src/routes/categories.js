
import express from 'express';

import authenticate from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';

import categorySchema from '../validators/categories.js';

import {
  postCategory,
  getAllCategories,
  getCategoryById,
  putCategory,
  deleteCategory,
} from '../controllers/categoriesController.js';

const router = express.Router();


// POST /categories
// CREATE CATEGORY

router.post(
  '/',
  authenticate,
  validate(categorySchema),
  postCategory
);


// GET /categories
// GET ALL CATEGORIES

router.get(
  '/',
  getAllCategories
);


// GET /categories/:id
// GET CATEGORY BY ID

router.get(
  '/:id',
  getCategoryById
);


// PUT /categories/:id
// UPDATE CATEGORY

router.put(
  '/:id',
  authenticate,
  validate(categorySchema),
  putCategory
);


// DELETE /categories/:id
// DELETE CATEGORY

router.delete(
  '/:id',
  authenticate,
  deleteCategory
);

export default router;
