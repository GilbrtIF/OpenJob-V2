import express from 'express';

import authenticate from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';

import {
  postDocument,
  getAllDocuments,
  getDocumentById,
  deleteDocument,
} from '../controllers/documentsController.js';

const router = express.Router();

// POST /documents — upload PDF (auth)
router.post(
  '/',
  authenticate,
  upload.single('document'),
  postDocument
);

// GET /documents — publik
router.get('/', getAllDocuments);

// GET /documents/:id — publik (unduh PDF)
router.get('/:id', getDocumentById);

// DELETE /documents/:id — auth
router.delete('/:id', authenticate, deleteDocument);

export default router;