
import express from 'express';

import usersSchema from '../validators/users.js';
import validate from '../middlewares/validate.js';

import {
  postUser,
  getUserById,
} from '../controllers/usersController.js';

const router = express.Router();

// POST /users
router.post(
  '/',
  validate(usersSchema),
  postUser
);

// GET /users/:id
router.get(
  '/:id',
  getUserById
);

export default router;
