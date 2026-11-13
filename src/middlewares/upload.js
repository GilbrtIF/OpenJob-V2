
import multer from 'multer';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { nanoid } from 'nanoid';
import { InvariantError } from '../exceptions/index.js';

// UPLOAD DIRECTORY
const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = dirname(currentFile);

// Lokasi folder uploads di root proyek
export const uploadDirectory = resolve(
  currentDirectory,
  '../../uploads'
);

// Membuat folder otomatis jika belum tersedia
mkdirSync(uploadDirectory, {
  recursive: true,
});

// DISK STORAGE
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, uploadDirectory);
  },

  filename: (req, file, callback) => {
    // Jangan pernah menggunakan originalname
    // sebagai nama file di disk.
    const filename = `${nanoid(16)}.pdf`;

    callback(null, filename);
  },
});

// FILE FILTER
const fileFilter = (req, file, callback) => {
  if (file.mimetype !== 'application/pdf') {
    return callback(
      new InvariantError('Hanya file PDF yang diperbolehkan')
    );
  }

  callback(null, true);
};

// MULTER CONFIGURATION
const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
    files: 1,
  },

  fileFilter,
});

export default upload;
