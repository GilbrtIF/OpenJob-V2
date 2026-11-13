
import express from 'express';

import authenticate from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';

import {
  applicationSchema,
  updateApplicationSchema,
} from '../validators/applications.js';

import {
  postApplication,
  getAllApplications,
  getApplicationById,
  getApplicationsByUser,
  getApplicationsByJob,
  putApplication,
  deleteApplication,
} from '../controllers/applicationsController.js';

const router = express.Router();


// POST /applications
// CREATE APPLICATION

router.post(
  '/',
  authenticate,
  validate(applicationSchema),
  postApplication
);


// GET /applications
// GET ALL APPLICATIONS

router.get(
  '/',
  authenticate,
  getAllApplications
);


// GET /applications/user/:userId
// GET APPLICATIONS BY USER

router.get(
  '/user/:userId',
  authenticate,
  getApplicationsByUser
);


// GET /applications/job/:jobId
// GET APPLICATIONS BY JOB

router.get(
  '/job/:jobId',
  authenticate,
  getApplicationsByJob
);


// GET /applications/:id
// GET APPLICATION BY ID

router.get(
  '/:id',
  authenticate,
  getApplicationById
);


// PUT /applications/:id
// UPDATE APPLICATION

router.put(
  '/:id',
  authenticate,
  validate(updateApplicationSchema),
  putApplication
);


// DELETE /applications/:id
// DELETE APPLICATION

router.delete(
  '/:id',
  authenticate,
  deleteApplication
);

export default router;
