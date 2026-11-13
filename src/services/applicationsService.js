
import pool from '../config/database.js';
import { nanoid } from 'nanoid';

import {
  InvariantError,
  NotFoundError,
} from '../exceptions/index.js';


// ADD APPLICATION
export const addApplication = async (
  { job_id, status = 'pending' },
  authenticatedUserId
) => {
  const id = `application-${nanoid(16)}`;

  try {
    const result = await pool.query(
      `
        INSERT INTO applications (id, user_id, job_id, status)
        VALUES ($1, $2, $3, $4)
        RETURNING id, user_id, job_id, status
      `,
      [id, authenticatedUserId, job_id, status]
    );

    return result.rows[0]; // <-- Kembalikan baris utuh
  } catch (error) {
    if (error.code === '23505') {
      throw new InvariantError('Anda sudah melamar pekerjaan ini');
    }
    if (error.code === '23503') {
      throw new NotFoundError('User atau pekerjaan tidak ditemukan');
    }
    throw error;
  }
};


// GET ALL APPLICATIONS

export const getApplications = async () => {
  const result = await pool.query(
    `
      SELECT
        a.id, a.user_id, a.job_id, a.status, a.created_at, a.updated_at,
        u.name AS applicant_name, u.email AS applicant_email,
        j.title AS job_title, j.company_id, c.name AS company_name,
        j.job_type, j.location_type
      FROM applications AS a
      INNER JOIN users AS u ON u.id = a.user_id
      INNER JOIN jobs AS j ON j.id = a.job_id
      INNER JOIN companies AS c ON c.id = j.company_id
      ORDER BY a.created_at DESC
    `
  );

  return result.rows;
};


// GET APPLICATION BY ID
export const getApplicationById = async (id) => {
  const result = await pool.query(
    `
      SELECT *
      FROM applications
      WHERE id = $1
    `,
    [id]
  );

  if (result.rowCount === 0) {
    throw new NotFoundError(
      'Lamaran tidak ditemukan'
    );
  }

  return result.rows[0];
};


// GET APPLICATIONS BY USER ID

export const getApplicationsByUserId = async (userId) => {
  const result = await pool.query(
    `
      SELECT *
      FROM applications
      WHERE user_id = $1
      ORDER BY id ASC
    `,
    [userId]
  );

  // ID user yang tidak mempunyai lamaran
  // tetap menghasilkan array kosong.
  return result.rows;
};

// GET APPLICATIONS (DETAIL) BY USER ID — untuk /profile/applications
export const getProfileApplications = async (userId) => {
  const result = await pool.query(
    `
      SELECT
        a.id, a.user_id, a.job_id, a.status, a.created_at, a.updated_at,
        j.title AS job_title, j.job_type, j.experience_level,
        j.location_type, j.location_city,
        j.salary_min, j.salary_max,
        j.company_id, c.name AS company_name
      FROM applications AS a
      INNER JOIN jobs AS j ON j.id = a.job_id
      INNER JOIN companies AS c ON c.id = j.company_id
      WHERE a.user_id = $1
      ORDER BY a.created_at DESC
    `,
    [userId]
  );

  return result.rows;
};


// GET APPLICATIONS BY JOB ID

export const getApplicationsByJobId = async (jobId) => {
  const result = await pool.query(
    `
      SELECT *
      FROM applications
      WHERE job_id = $1
      ORDER BY id ASC
    `,
    [jobId]
  );

  // Job yang tidak mempunyai lamaran
  // tetap menghasilkan array kosong.
  return result.rows;
};


// UPDATE APPLICATION
export const updateApplication = async (id, { status }) => {
  const result = await pool.query(
    `
      UPDATE applications
      SET
        status = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING id, user_id, job_id
    `,
    [status, id]
  );

  if (result.rowCount === 0) {
    throw new NotFoundError(
      'Lamaran tidak ditemukan'
    );
  }

  return result.rows[0];
};

// DELETE APPLICATION
export const deleteApplication = async (id) => {
  const result = await pool.query(
    `
      DELETE FROM applications
      WHERE id = $1
      RETURNING id, user_id, job_id
    `,
    [id]
  );

  if (result.rowCount === 0) {
    throw new NotFoundError(
      'Lamaran tidak ditemukan'
    );
  }

  return result.rows[0];
};
