import { nanoid } from 'nanoid';
import pool from '../config/database.js';
import { InvariantError } from '../exceptions/index.js';


// ADD REFRESH TOKEN

export const addRefreshToken = async (token, userId) => {
  await pool.query(
    `
      INSERT INTO authentications (id, token, user_id)
      VALUES ($1, $2, $3)
    `,
    [`auth-${nanoid(16)}`, token, userId]
  );
};


// VERIFY REFRESH TOKEN EXISTS

export const verifyRefreshTokenExists = async (token) => {
  const result = await pool.query(
    `
      SELECT token
      FROM authentications
      WHERE token = $1
    `,
    [token]
  );

  if (result.rowCount === 0) {
    throw new InvariantError('Refresh token tidak ditemukan');
  }

  return true;
};


// DELETE REFRESH TOKEN

export const deleteRefreshToken = async (token) => {
  const result = await pool.query(
    `
      DELETE FROM authentications
      WHERE token = $1
      RETURNING token
    `,
    [token]
  );

  if (result.rowCount === 0) {
    throw new InvariantError('Refresh token tidak ditemukan');
  }
};
