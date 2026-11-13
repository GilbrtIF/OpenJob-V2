
import { AuthenticationError } from '../exceptions/index.js';

import {
  verifyAccessToken,
} from '../utils/tokenManager.js';


// AUTHENTICATE MIDDLEWARE

const authenticate = (req, res, next) => {
  // 1. Mengambil Authorization header
  const authorization = req.headers.authorization;

  if (!authorization) {
    throw new AuthenticationError(
      'Authorization header tidak ditemukan'
    );
  }

  // 2. Memastikan format Bearer Token
  const parts = authorization.trim().split(/\s+/);

  if (
    parts.length !== 2 ||
    parts[0].toLowerCase() !== 'bearer' ||
    !parts[1]
  ) {
    throw new AuthenticationError(
      'Format Authorization header tidak valid'
    );
  }

  const token = parts[1];

  // 3. Verifikasi access token
  const payload = verifyAccessToken(token);

  // 4. Simpan identitas pengguna ke request
  req.auth = {
    id: payload.id,
  };

  // 5. Lanjutkan ke middleware berikutnya
  next();
};

export default authenticate;
