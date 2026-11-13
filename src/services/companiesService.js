
import pool from '../config/database.js';
import { nanoid } from 'nanoid';

import {
  NotFoundError,
} from '../exceptions/index.js';


// ADD COMPANY

export const addCompany = async ({
  name,
  location,
  description,
}) => {
  // Generate ID perusahaan
  const id = `company-${nanoid(16)}`;

  const result = await pool.query(
    `
      INSERT INTO companies (
        id,
        name,
        location,
        description
      )
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `,
    [
      id,
      name,
      location,
      description,
    ]
  );

  return result.rows[0].id;
};


// GET ALL COMPANIES

export const getCompanies = async () => {
  const result = await pool.query(
    `
      SELECT
        id,
        name,
        location,
        description,
        created_at,
        updated_at
      FROM companies
      ORDER BY created_at DESC
    `
  );

  return result.rows;
};


// GET COMPANY BY ID

export const getCompanyById = async (id) => {
  const result = await pool.query(
    `
      SELECT
        id,
        name,
        location,
        description,
        created_at,
        updated_at
      FROM companies
      WHERE id = $1
    `,
    [id]
  );

  if (result.rowCount === 0) {
    throw new NotFoundError('Company tidak ditemukan');
  }

  return result.rows[0];
};


// UPDATE COMPANY

export const updateCompany = async (
  id,
  { name, location, description }
) => {
  const result = await pool.query(
    `
      UPDATE companies
      SET
        name = $1,
        location = $2,
        description = $3,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING id
    `,
    [
      name,
      location,
      description,
      id,
    ]
  );

  // Periksa apakah perusahaan ditemukan
  if (result.rowCount === 0) {
    throw new NotFoundError('Company tidak ditemukan');
  }
};


// DELETE COMPANY

export const deleteCompany = async (id) => {
  const result = await pool.query(
    `
      DELETE FROM companies
      WHERE id = $1
      RETURNING id
    `,
    [id]
  );

  // Periksa apakah perusahaan ditemukan
  if (result.rowCount === 0) {
    throw new NotFoundError('Company tidak ditemukan');
  }
};
