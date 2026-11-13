import pool from '../config/database.js';
import { nanoid } from 'nanoid';
import { unlink } from 'node:fs/promises';
import { join } from 'node:path';

import { uploadDirectory } from '../middlewares/upload.js';

import {
  InvariantError,
  NotFoundError,
  AuthorizationError,
} from '../exceptions/index.js';

// ==================================
// CLEANUP UPLOADED FILE
// ==================================
const removeUploadedFile = async (filePath) => {
  try {
    await unlink(filePath);
  } catch (error) {
    // Jangan menutupi error database yang asli.
    console.error('Gagal menghapus file upload:', error);
  }
};

// ==================================
// ADD DOCUMENT
// ==================================
export const addDocument = async (file, userId) => {
  const id = `document-${nanoid(16)}`;

  if (Array.from(file.originalname).length > 255) {
    await removeUploadedFile(file.path);

    throw new InvariantError('Nama file maksimal 255 karakter');
  }

  try {
    const result = await pool.query(
      `
        INSERT INTO documents (
          id, user_id, original_name, filename, mime_type, size
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
      `,
      [
        id,
        userId,
        file.originalname,
        file.filename,
        file.mimetype,
        file.size,
      ]
    );

    return result.rows[0].id;
  } catch (error) {
    await removeUploadedFile(file.path);

    if (error.code === '23503') {
      throw new NotFoundError('Pengguna tidak ditemukan');
    }

    throw error;
  }
};

// ==================================
// GET ALL DOCUMENTS
// ==================================
export const getDocuments = async () => {
  const result = await pool.query(
    `
      SELECT id, user_id, original_name, filename,
             mime_type, size, created_at
      FROM documents
      ORDER BY created_at DESC
    `
  );

  return result.rows;
};

// ==================================
// GET DOCUMENT BY ID
// ==================================
export const getDocumentById = async (id) => {
  const result = await pool.query(
    `
      SELECT id, user_id, original_name, filename,
             mime_type, size, created_at
      FROM documents
      WHERE id = $1
    `,
    [id]
  );

  if (result.rowCount === 0) {
    throw new NotFoundError('Dokumen tidak ditemukan');
  }

  return result.rows[0];
};

// ==================================
// DELETE DOCUMENT
// ==================================
export const deleteDocument = async (id, userId) => {
  const result = await pool.query(
    `
      SELECT id, user_id, filename
      FROM documents
      WHERE id = $1
    `,
    [id]
  );

  if (result.rowCount === 0) {
    throw new NotFoundError('Dokumen tidak ditemukan');
  }

  const document = result.rows[0];

  if (document.user_id !== userId) {
    throw new AuthorizationError(
      'Anda tidak berhak menghapus dokumen ini'
    );
  }

  await pool.query('DELETE FROM documents WHERE id = $1', [id]);

  // removeUploadedFile menelan error (termasuk ENOENT), sesuai spesifikasi.
  await removeUploadedFile(
    join(uploadDirectory, document.filename)
  );
};