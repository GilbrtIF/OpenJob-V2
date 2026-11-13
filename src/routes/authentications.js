
import express from 'express';

import validate from '../middlewares/validate.js';
import authenticate from '../middlewares/auth.js';

import {
  loginSchema,
  refreshTokenSchema,
} from '../validators/authentications.js';

import {
  postAuthentication,
  putAuthentication,
  deleteAuthentication,
} from '../controllers/authenticationsController.js';

const router = express.Router();


// POST /authentications
// LOGIN
router.post(
  '/',
  validate(loginSchema),
  postAuthentication
);


// PUT /authentications
// REFRESH ACCESS TOKEN
router.put(
  '/',
  validate(refreshTokenSchema),
  putAuthentication
);

// DELETE /authentications
// LOGOUT
router.delete(
  '/',
  authenticate,
  validate(refreshTokenSchema),
  deleteAuthentication
);

export default router;
