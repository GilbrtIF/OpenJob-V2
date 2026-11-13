
import pool from '../config/database.js';
import { nanoid } from 'nanoid';

import {
  InvariantError,
  NotFoundError,
} from '../exceptions/index.js';


// ADD CATEGORY

export const addCategory = async ({ name }) => {
  // Generate ID kategori
  const id = `category-${nanoid(16)}`;

  try {
    const result = await pool.query(
      `
        INSERT INTO categories (
          id,
          name
        )
        VALUES ($1, $2)
        RETURNING id
      `,
      [id, name]
    );

    return result.rows[0].id;
  } catch (error) {
    // Menangani kategori dengan nama duplikat
    if (error.code === '23505') {
      throw new InvariantError('Kategori sudah ada');
    }

    throw error;
  }
};


// GET ALL CATEGORIES

export const getCategories = async () => {
  const result = await pool.query(
    `
      SELECT *
      FROM categories
      ORDER BY created_at DESC
    `
  );

  return result.rows;
};


// GET CATEGORY BY ID

export const getCategoryById = async (id) => {
  const result = await pool.query(
    `
      SELECT *
      FROM categories
      WHERE id = $1
    `,
    [id]
  );

  if (result.rowCount === 0) {
    throw new NotFoundError('Kategori tidak ditemukan');
  }

  return result.rows[0];
};


// UPDATE CATEGORY

export const updateCategory = async (id, { name }) => {
  try {
    const result = await pool.query(
      `
        UPDATE categories
        SET
          name = $1,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING id
      `,
      [name, id]
    );

    if (result.rowCount === 0) {
      throw new NotFoundError('Kategori tidak ditemukan');
    }
  } catch (error) {
    // Menangani nama kategori duplikat
    if (error.code === '23505') {
      throw new InvariantError('Kategori sudah ada');
    }

    throw error;
  }
};


// DELETE CATEGORY

export const deleteCategory = async (id) => {
  const result = await pool.query(
    `
      DELETE FROM categories
      WHERE id = $1
      RETURNING id
    `,
    [id]
  );

  if (result.rowCount === 0) {
    throw new NotFoundError('Kategori tidak ditemukan');
  }
};
