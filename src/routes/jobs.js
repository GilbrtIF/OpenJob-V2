
import express from 'express';

import authenticate from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';

import jobSchema from '../validators/jobs.js';

import {
  postJob,
  getAllJobs,
  getJobById,
  getJobsByCompany,
  getJobsByCategory,
  putJob,
  deleteJob,
} from '../controllers/jobsController.js';

import {
  postBookmark,
  getBookmarkById,
  deleteBookmark,
} from '../controllers/bookmarksController.js';

const router = express.Router();


// POST /jobs
// CREATE JOB

router.post(
  '/',
  authenticate,
  validate(jobSchema),
  postJob
);


// GET /jobs
// GET ALL JOBS / SEARCH

router.get(
  '/',
  getAllJobs
);


// POST /jobs/:jobId/bookmark
// CREATE BOOKMARK

router.post(
  '/:jobId/bookmark',
  authenticate,
  postBookmark
);


// GET /jobs/:jobId/bookmark/:id
// GET BOOKMARK BY ID

router.get(
  '/:jobId/bookmark/:id',
  authenticate,
  getBookmarkById
);


// DELETE /jobs/:jobId/bookmark
// DELETE BOOKMARK

router.delete(
  '/:jobId/bookmark',
  authenticate,
  deleteBookmark
);


// GET /jobs/company/:companyId
// GET JOBS BY COMPANY

router.get(
  '/company/:companyId',
  getJobsByCompany
);


// GET /jobs/category/:categoryId
// GET JOBS BY CATEGORY

router.get(
  '/category/:categoryId',
  getJobsByCategory
);


// GET /jobs/:id
// GET JOB BY ID

router.get(
  '/:id',
  getJobById
);


// PUT /jobs/:id
// UPDATE JOB

router.put(
  '/:id',
  authenticate,
  validate(jobSchema),
  putJob
);


// DELETE /jobs/:id
// DELETE JOB

router.delete(
  '/:id',
  authenticate,
  deleteJob
);



export default router;
