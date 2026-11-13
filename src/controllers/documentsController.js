import { join } from 'node:path';

import {
  addDocument,
  getDocuments,
  getDocumentById as getDocumentByIdService,
  deleteDocument as deleteDocumentService,
} from '../services/documentsService.js';

import { uploadDirectory } from '../middlewares/upload.js';

import {
  InvariantError,
  NotFoundError,
} from '../exceptions/index.js';

// ==================================
// HELPER: MAP ROW -> CAMELCASE
// ==================================
const mapDocument = (row) => ({
  id: row.id,
  userId: row.user_id,
  originalName: row.original_name,
  filename: row.filename,
  mimeType: row.mime_type,
  size: row.size,
  createdAt: row.created_at,
});

// ==================================
// POST DOCUMENT
// ==================================
export const postDocument = async (req, res) => {
  if (!req.file) {
    throw new InvariantError('File is required');
  }

  const id = await addDocument(req.file, req.auth.id);

  return res.status(201).json({
    status: 'success',
    data: {
      documentId: id,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
    },
  });
};

// ==================================
// GET ALL DOCUMENTS
// ==================================
export const getAllDocuments = async (req, res) => {
  const documents = await getDocuments();

  return res.status(200).json({
    status: 'success',
    data: {
      documents: documents.map(mapDocument),
    },
  });
};

// ==================================
// GET DOCUMENT BY ID (DOWNLOAD)
// ==================================
export const getDocumentById = async (req, res, next) => {
  const doc = await getDocumentByIdService(req.params.id);

  return res.download(
    join(uploadDirectory, doc.filename),
    doc.original_name,
    (err) => {
      // Baris DB ada tapi berkas fisiknya hilang (ENOENT, dsb.)
      if (err && !res.headersSent) {
        return next(new NotFoundError('Dokumen tidak ditemukan'));
      }
    }
  );
};

// ==================================
// DELETE DOCUMENT
// ==================================
export const deleteDocument = async (req, res) => {
  await deleteDocumentService(req.params.id, req.auth.id);

  return res.status(200).json({
    status: 'success',
    message: 'Dokumen berhasil dihapus',
  });
};