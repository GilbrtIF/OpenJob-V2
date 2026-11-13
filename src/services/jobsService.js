
import pool from '../config/database.js';
import { nanoid } from 'nanoid';

import {
  NotFoundError,
} from '../exceptions/index.js';


// ADD JOB

export const addJob = async (
  {
    company_id, category_id, title, description, job_type,
    experience_level, location_type, location_city = null,
    salary_min = null, salary_max = null, is_salary_visible = true,
    status = 'open',
  },
  ownerId // <-- Parameter baru
) => {
  const id = `job-${nanoid(16)}`;

  try {
    const result = await pool.query(
      `
        INSERT INTO jobs (
          id, company_id, category_id, title, description,
          job_type, experience_level, location_type, location_city,
          salary_min, salary_max, is_salary_visible, status, owner_id
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7,
          $8, $9, $10, $11, $12, $13, $14
        )
        RETURNING id
      `,
      [
        id, company_id, category_id, title, description, job_type,
        experience_level, location_type, location_city, salary_min,
        salary_max, is_salary_visible, status, ownerId // <-- Nilai ownerId
      ]
    );

    return result.rows[0].id;
  } catch (error) {
    if (error.code === '23503') {
      throw new NotFoundError('Company atau kategori tidak ditemukan');
    }
    throw error;
  }
};


// GET ALL JOBS / SEARCH JOBS

export const getJobs = async ({
  title,
  companyName,
} = {}) => {
  const conditions = [];
  const values = [];

  // Filter berdasarkan judul pekerjaan
  if (typeof title === 'string' && title.trim() !== '') {
    values.push(`%${title.trim()}%`);

    conditions.push(
      `j.title ILIKE $${values.length}`
    );
  }

  // Filter berdasarkan nama perusahaan
  if (
    typeof companyName === 'string' &&
    companyName.trim() !== ''
  ) {
    values.push(`%${companyName.trim()}%`);

    conditions.push(
      `c.name ILIKE $${values.length}`
    );
  }

  // Query pencarian
  const query = `
    SELECT
      j.id, j.company_id, c.name AS company_name, j.category_id, j.title,
      j.job_type, j.experience_level, j.location_type, j.location_city,
      j.salary_min, j.salary_max, j.is_salary_visible, j.status
    FROM jobs AS j
    INNER JOIN companies AS c
      ON c.id = j.company_id
    ${
  conditions.length > 0
    ? `WHERE ${conditions.join(' AND ')}`
    : ''
}
    ORDER BY j.created_at DESC
  `;

  const result = await pool.query(query, values);

  return result.rows;
};


// GET JOB BY ID

export const getJobById = async (id) => {
  const result = await pool.query(
    `
      SELECT *
      FROM jobs
      WHERE id = $1
    `,
    [id]
  );

  if (result.rowCount === 0) {
    throw new NotFoundError('Job tidak ditemukan');
  }

  return result.rows[0];
};


// GET JOBS BY COMPANY ID

export const getJobsByCompanyId = async (companyId) => {
  const result = await pool.query(
    `
      SELECT *
      FROM jobs
      WHERE company_id = $1
    `,
    [companyId]
  );

  // Tidak melempar NotFoundError.
  // Jika companyId tidak mempunyai pekerjaan,
  // hasilnya tetap array kosong.
  return result.rows;
};


// GET JOBS BY CATEGORY ID

export const getJobsByCategoryId = async (categoryId) => {
  const result = await pool.query(
    `
      SELECT *
      FROM jobs
      WHERE category_id = $1
    `,
    [categoryId]
  );

  // Tidak melempar NotFoundError.
  return result.rows;
};


// UPDATE JOB

export const updateJob = async (
  id,
  {
    company_id,
    category_id,
    title,
    description,
    job_type,
    experience_level,
    location_type,
    location_city = null,
    salary_min = null,
    salary_max = null,
    is_salary_visible = true,
    status = 'open',
  }
) => {
  try {
    const result = await pool.query(
      `
        UPDATE jobs
            SET
            company_id = $1,
            category_id = $2,
            title = $3,
            description = $4,
            job_type = $5,
            experience_level = $6,
            location_type = $7,
            location_city = $8,
            salary_min = $9,
            salary_max = $10,
            is_salary_visible = $11,
            status = $12,
            updated_at = CURRENT_TIMESTAMP
            WHERE id = $13
            RETURNING id
      `,
      [
        company_id,
        category_id,
        title,
        description,
        job_type,
        experience_level,
        location_type,
        location_city,
        salary_min,
        salary_max,
        is_salary_visible,
        status,
        id,
      ]
    );

    if (result.rowCount === 0) {
      throw new NotFoundError('Job tidak ditemukan');
    }
  } catch (error) {
    // Foreign Key violation
    if (error.code === '23503') {
      throw new NotFoundError(
        'Company atau kategori tidak ditemukan'
      );
    }

    throw error;
  }
};


// DELETE JOB

export const deleteJob = async (id) => {
  const result = await pool.query(
    `
      DELETE FROM jobs
      WHERE id = $1
      RETURNING id
    `,
    [id]
  );

  if (result.rowCount === 0) {
    throw new NotFoundError('Job tidak ditemukan');
  }
};
