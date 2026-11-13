
import pool from '../config/database.js';

import {
  InvariantError,
  NotFoundError,
  AuthenticationError,
} from '../exceptions/index.js';

import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';


// ADD USER

export const addUser = async ({
  name,
  email,
  password,
  role = 'user',
}) => {
  // 1. Cek apakah email sudah terdaftar
  const existingUser = await pool.query(
    'SELECT id FROM users WHERE email = $1',
    [email]
  );

  if (existingUser.rowCount > 0) {
    throw new InvariantError('Email sudah terdaftar');
  }

  // 2. Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Generate ID
  const id = `user-${nanoid(16)}`;

  // 4. Insert user menggunakan parameterized query
  const query = {
    text: `
      INSERT INTO users (
        id,
        name,
        email,
        password,
        role
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `,
    values: [id, name, email, hashedPassword, role],
  };

  try {
    const result = await pool.query(query);
    return result.rows[0].id;
  } catch (error) {
    // Menangani unique violation akibat request bersamaan
    if (error.code === '23505') {
      throw new InvariantError('Email sudah terdaftar');
    }

    throw error;
  }
};


// VERIFY USER CREDENTIAL

export const verifyUserCredential = async (email, password) => {
  const result = await pool.query(
    `
      SELECT id, password
      FROM users
      WHERE email = $1
    `,
    [email]
  );

  const errorMessage = 'Email atau password salah';

  // Email tidak ditemukan
  if (result.rowCount === 0) {
    throw new AuthenticationError(errorMessage);
  }

  const user = result.rows[0];

  // Membandingkan password dengan hash bcrypt
  const isPasswordValid = await bcrypt.compare(
    password,
    user.password
  );

  // Password salah
  if (!isPasswordValid) {
    throw new AuthenticationError(errorMessage);
  }

  return user.id;
};


// GET USER BY ID

export const getUserById = async (id) => {
  const result = await pool.query(
    `
      SELECT
        id,
        name,
        email,
        role,
        created_at
      FROM users
      WHERE id = $1
    `,
    [id]
  );

  if (result.rowCount === 0) {
    throw new NotFoundError('User tidak ditemukan');
  }

  return result.rows[0];
};
