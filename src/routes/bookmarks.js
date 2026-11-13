
import express from 'express';

import authenticate from '../middlewares/auth.js';

import {
  getAllBookmarks,
} from '../controllers/bookmarksController.js';

const router = express.Router();


// GET /bookmarks
// GET BOOKMARKS MILIK USER LOGIN

router.get(
  '/',
  authenticate,
  getAllBookmarks
);

export default router;
