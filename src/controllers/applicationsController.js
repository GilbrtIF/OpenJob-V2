import {
  addApplication,
  getApplications,
  getApplicationById as findApplicationById,
  getApplicationsByUserId,
  getApplicationsByJobId,
  updateApplication,
  deleteApplication as removeApplication,
} from '../services/applicationsService.js';

import {
  get as getCache,
  set as setCache,
  del as deleteCache,
} from '../services/cacheService.js';

// Tambahkan import ini
import { publishApplicationNotification } from '../services/messageService.js';

// POST APPLICATION
export const postApplication = async (req, res) => {
  // 1. Simpan ke database (mengembalikan objek utuh)
  const application = await addApplication(req.body, req.auth.id);

  // 2. Invalidasi cache
  await deleteCache(
    `applications:user:${req.auth.id}`,
    `applications:job:${application.job_id}`
  );

  // 3. Kirim pesan ke RabbitMQ (hanya jika INSERT berhasil)
  // Karena kita menggunakan async/await, pastikan fungsi ini tidak menggagalkan API
  await publishApplicationNotification(application.id);

  // 4. Kembalikan respons
  return res.status(201).json({
    status: 'success',
    data: application,
  });
};

// GET ALL APPLICATIONS
export const getAllApplications = async (req, res) => {
  const applications = await getApplications();

  return res.status(200).json({
    status: 'success',
    data: {
      applications,
    },
  });
};

// GET APPLICATION BY ID
export const getApplicationById = async (req, res) => {
  const cacheKey = `applications:${req.params.id}`;

  const cachedResponse = await getCache(cacheKey);

  if (cachedResponse !== null) {
    return res
      .set('X-Data-Source', 'cache')
      .status(200)
      .json(cachedResponse);
  }

  const application = await findApplicationById(
    req.params.id
  );

  const responseBody = {
    status: 'success',
    data: application,
  };

  await setCache(cacheKey, responseBody);

  return res
    .set('X-Data-Source', 'database')
    .status(200)
    .json(responseBody);
};

// GET APPLICATIONS BY USER
export const getApplicationsByUser = async (req, res) => {
  const cacheKey = `applications:user:${req.params.userId}`;

  const cachedResponse = await getCache(cacheKey);

  if (cachedResponse !== null) {
    return res
      .set('X-Data-Source', 'cache')
      .status(200)
      .json(cachedResponse);
  }

  const applications = await getApplicationsByUserId(
    req.params.userId
  );

  // List kosong tetap sah untuk di-cache.
  // Invalidasi di POST/PUT/DELETE yang menjaga kebenarannya.
  const responseBody = {
    status: 'success',
    data: {
      applications,
    },
  };

  await setCache(cacheKey, responseBody);

  return res
    .set('X-Data-Source', 'database')
    .status(200)
    .json(responseBody);
};

// GET APPLICATIONS BY JOB
export const getApplicationsByJob = async (req, res) => {
  const cacheKey = `applications:job:${req.params.jobId}`;

  const cachedResponse = await getCache(cacheKey);

  if (cachedResponse !== null) {
    return res
      .set('X-Data-Source', 'cache')
      .status(200)
      .json(cachedResponse);
  }

  const applications = await getApplicationsByJobId(
    req.params.jobId
  );

  const responseBody = {
    status: 'success',
    data: {
      applications,
    },
  };

  await setCache(cacheKey, responseBody);

  return res
    .set('X-Data-Source', 'database')
    .status(200)
    .json(responseBody);
};

// UPDATE APPLICATION
export const putApplication = async (req, res) => {
  const application = await updateApplication(
    req.params.id,
    req.body
  );

  // updateApplication sekarang mengembalikan
  // { id, user_id, job_id } agar controller bisa invalidasi.
  await deleteCache(
    `applications:${application.id}`,
    `applications:user:${application.user_id}`,
    `applications:job:${application.job_id}`
  );

  return res.status(200).json({
    status: 'success',
    message: 'Lamaran berhasil diperbarui',
  });
};

// DELETE APPLICATION
export const deleteApplication = async (req, res) => {
  const application = await removeApplication(req.params.id);

  await deleteCache(
    `applications:${application.id}`,
    `applications:user:${application.user_id}`,
    `applications:job:${application.job_id}`
  );

  return res.status(200).json({
    status: 'success',
  });
};