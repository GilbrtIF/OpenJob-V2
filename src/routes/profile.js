
import express from 'express';

import authenticate from '../middlewares/auth.js';

import {
  getProfile,
  getProfileApplications,
  getProfileBookmarks,
} from '../controllers/profileController.js';

const router = express.Router();


// GET /profile
// GET USER PROFILE

router.get(
  '/',
  authenticate,
  getProfile
);


// GET /profile/applications
// GET USER APPLICATIONS

router.get(
  '/applications',
  authenticate,
  getProfileApplications
);


// GET /profile/bookmarks
// GET USER BOOKMARKS

router.get(
  '/bookmarks',
  authenticate,
  getProfileBookmarks
);

export default router;
