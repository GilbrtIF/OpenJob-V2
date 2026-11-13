
import {
  verifyUserCredential,
} from '../services/usersService.js';

import {
  addRefreshToken,
  verifyRefreshTokenExists,
  deleteRefreshToken,
} from '../services/authenticationsService.js';

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/tokenManager.js';


// POST AUTHENTICATION (LOGIN)

export const postAuthentication = async (req, res) => {
  const { email, password } = req.body;

  // 1. Verifikasi email dan password
  const userId = await verifyUserCredential(email, password);

  // 2. Generate access token
  const accessToken = generateAccessToken({
    id: userId,
  });

  // 3. Generate refresh token
  const refreshToken = generateRefreshToken({
    id: userId,
  });

  // 4. Simpan refresh token ke database
  await addRefreshToken(refreshToken, userId);

  // 5. Kirim response
  return res.status(200).json({
    status: 'success',
    data: {
      accessToken,
      refreshToken,
    },
  });
};


// PUT AUTHENTICATION (REFRESH TOKEN)

export const putAuthentication = async (req, res) => {
  const { refreshToken } = req.body;

  // 1. Verifikasi signature dan payload JWT
  const payload = verifyRefreshToken(refreshToken);

  // 2. Pastikan token masih tersedia di database
  await verifyRefreshTokenExists(refreshToken);

  // 3. Generate access token baru
  const accessToken = generateAccessToken({
    id: payload.id,
  });

  // 4. Kirim access token baru
  return res.status(200).json({
    status: 'success',
    data: {
      accessToken,
    },
  });
};


// DELETE AUTHENTICATION (LOGOUT)

export const deleteAuthentication = async (req, res) => {
  const { refreshToken } = req.body;

  // Hapus refresh token dari database
  await deleteRefreshToken(refreshToken);

  // Kirim response
  return res.status(200).json({
    status: 'success',
    message: 'Refresh token berhasil dihapus',
  });
};
