
import pool from '../config/database.js';
import { nanoid } from 'nanoid';

import {
  InvariantError,
  NotFoundError,
} from '../exceptions/index.js';


// ADD BOOKMARK

export const addBookmark = async (jobId, userId) => {
  // Generate ID bookmark
  const id = `bookmark-${nanoid(16)}`;

  try {
    const result = await pool.query(
      `
        INSERT INTO bookmarks (
          id,
          user_id,
          job_id
        )
        VALUES ($1, $2, $3)
        RETURNING id
      `,
      [id, userId, jobId]
    );

    return result.rows[0].id;
  } catch (error) {
    // Bookmark duplikat
    if (error.code === '23505') {
      throw new InvariantError(
        'Pekerjaan sudah ditambahkan ke bookmark'
      );
    }

    // User atau job tidak ditemukan
    if (error.code === '23503') {
      throw new NotFoundError(
        'User atau pekerjaan tidak ditemukan'
      );
    }

    throw error;
  }
};


// GET BOOKMARKS BY USER

export const getBookmarks = async (userId) => {
  const result = await pool.query(
    `
      SELECT
        b.id, b.user_id, b.job_id, b.created_at,
        j.title AS job_title, j.description AS job_description,
        j.job_type, j.experience_level, j.location_type, j.location_city,
        j.salary_min, j.salary_max, j.is_salary_visible, j.status AS job_status,
        j.company_id, c.name AS company_name,
        j.category_id, cat.name AS category_name
      FROM bookmarks AS b
      INNER JOIN jobs AS j ON j.id = b.job_id
      INNER JOIN companies AS c ON c.id = j.company_id
      INNER JOIN categories AS cat ON cat.id = j.category_id
      WHERE b.user_id = $1
      ORDER BY b.created_at DESC
    `,
    [userId]
  );

  return result.rows;
};


// GET BOOKMARK BY ID

export const getBookmarkById = async (
  jobId,
  bookmarkId,
  userId
) => {
  const result = await pool.query(
    `
      SELECT *
      FROM bookmarks
      WHERE
        id = $1
        AND job_id = $2
        AND user_id = $3
    `,
    [bookmarkId, jobId, userId]
  );

  if (result.rowCount === 0) {
    throw new NotFoundError(
      'Bookmark tidak ditemukan'
    );
  }

  return result.rows[0];
};


// DELETE BOOKMARK

export const deleteBookmark = async (jobId, userId) => {
  const result = await pool.query(
    `
      DELETE FROM bookmarks
      WHERE
        user_id = $1
        AND job_id = $2
      RETURNING id
    `,
    [userId, jobId]
  );

  if (result.rowCount === 0) {
    throw new NotFoundError(
      'Bookmark tidak ditemukan'
    );
  }
};
