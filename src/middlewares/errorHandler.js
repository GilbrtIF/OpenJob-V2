
import multer from 'multer';
import { ClientError } from '../exceptions/index.js';

const errorHandler = (err, req, res, next) => {
  // Jika response sudah dikirim
  if (res.headersSent) {
    return next(err);
  }

  // Custom application errors
  if (err instanceof ClientError) {
    return res.status(err.statusCode).json({
      status: 'failed',
      message: err.message,
    });
  }

  // Invalid JSON
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      status: 'failed',
      message: 'Invalid JSON format',
    });
  }

  // Multer errors
  if (err instanceof multer.MulterError) {
    const isTooLarge = err.code === 'LIMIT_FILE_SIZE';

    return res.status(isTooLarge ? 413 : 400).json({
      status: 'failed',
      message: isTooLarge
        ? 'File size must not exceed 5 MB'
        : 'Invalid file upload',
    });
  }

  // Internal server error
  console.error(err);

  return res.status(500).json({
    status: 'failed',
    message: 'Terjadi kegagalan pada server kami',
  });
};

export default errorHandler;
