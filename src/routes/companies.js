
import express from 'express';

import authenticate from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';

import companySchema from '../validators/companies.js';

import {
  postCompany,
  getAllCompanies,
  getCompanyById,
  putCompany,
  deleteCompany,
} from '../controllers/companiesController.js';

const router = express.Router();


// POST /companies
// CREATE COMPANY

router.post(
  '/',
  authenticate,
  validate(companySchema),
  postCompany
);


// GET /companies
// GET ALL COMPANIES

router.get(
  '/',
  getAllCompanies
);


// GET /companies/:id
// GET COMPANY BY ID

router.get(
  '/:id',
  getCompanyById
);


// PUT /companies/:id
// UPDATE COMPANY

router.put(
  '/:id',
  authenticate,
  validate(companySchema),
  putCompany
);


// DELETE /companies/:id
// DELETE COMPANY

router.delete(
  '/:id',
  authenticate,
  deleteCompany
);

export default router;
