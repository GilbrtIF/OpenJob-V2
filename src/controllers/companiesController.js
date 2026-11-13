
import {
  addCompany,
  getCompanies,
  getCompanyById as findCompanyById,
  updateCompany,
  deleteCompany as removeCompany,
} from '../services/companiesService.js';

import {
  get as getCache,
  set as setCache,
  del as deleteCache,
} from '../services/cacheService.js';


// POST COMPANY

export const postCompany = async (req, res) => {
  const id = await addCompany(req.body);

  // Invalidasi setelah INSERT berhasil.
  await deleteCache(`companies:${id}`);

  return res.status(201).json({
    status: 'success',
    data: {
      id,
    },
  });
};


// GET ALL COMPANIES

export const getAllCompanies = async (req, res) => {
  const companies = await getCompanies();

  return res.status(200).json({
    status: 'success',
    data: {
      companies,
    },
  });
};


// GET COMPANY BY ID

export const getCompanyById = async (req, res) => {
  // Key Redis berdasarkan ID perusahaan.
  const cacheKey = `companies:${req.params.id}`;

  // 1. Periksa cache terlebih dahulu.
  const cachedResponse = await getCache(cacheKey);

  // 2. Cache HIT.
  if (cachedResponse !== null) {
    return res
      .set('X-Data-Source', 'cache')
      .status(200)
      .json(cachedResponse);
  }

  // 3. Cache MISS: ambil data dari PostgreSQL.
  // Jika company tidak ada, service akan melempar
  // NotFoundError. Error tersebut tidak disimpan ke cache.
  const company = await findCompanyById(req.params.id);

  // 4. Buat response dengan format yang sama
  // untuk cache dan database.
  const responseBody = {
    status: 'success',
    data: company,
  };

  // 5. Simpan response ke Redis.
  await setCache(cacheKey, responseBody);

  // 6. Kirim response dari database.
  return res
    .set('X-Data-Source', 'database')
    .status(200)
    .json(responseBody);
};


// PUT COMPANY

export const putCompany = async (req, res) => {
  await updateCompany(req.params.id, req.body);

  // Hapus cache setelah UPDATE berhasil.
  await deleteCache(`companies:${req.params.id}`);

  return res.status(200).json({
    status: 'success',
    message: 'Company berhasil diperbarui',
  });
};


// DELETE COMPANY

export const deleteCompany = async (req, res) => {
  await removeCompany(req.params.id);

  // Hapus cache setelah DELETE berhasil.
  await deleteCache(`companies:${req.params.id}`);

  return res.status(200).json({
    status: 'success',
  });
};
