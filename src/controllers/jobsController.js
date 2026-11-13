
import {
  addJob,
  getJobs,
  getJobById as findJobById,
  getJobsByCompanyId,
  getJobsByCategoryId,
  updateJob,
  deleteJob as removeJob,
} from '../services/jobsService.js';


// POST JOB

export const postJob = async (req, res) => {
  const id = await addJob(req.body, req.auth.id); // <-- Kirim req.auth.id
  return res.status(201).json({
    status: 'success',
    data: { id },
  });
};


// GET ALL JOBS / SEARCH JOBS

export const getAllJobs = async (req, res) => {
  const jobs = await getJobs({
    title: req.query.title,
    companyName: req.query['company-name'],
  });

  return res.status(200).json({
    status: 'success',
    data: {
      jobs,
    },
  });
};


// GET JOB BY ID

export const getJobById = async (req, res) => {
  const job = await findJobById(req.params.id);

  return res.status(200).json({
    status: 'success',
    data: job,
  });
};


// GET JOBS BY COMPANY

export const getJobsByCompany = async (req, res) => {
  const jobs = await getJobsByCompanyId(
    req.params.companyId
  );

  return res.status(200).json({
    status: 'success',
    data: {
      jobs,
    },
  });
};


// GET JOBS BY CATEGORY

export const getJobsByCategory = async (req, res) => {
  const jobs = await getJobsByCategoryId(
    req.params.categoryId
  );

  return res.status(200).json({
    status: 'success',
    data: {
      jobs,
    },
  });
};


// UPDATE JOB

export const putJob = async (req, res) => {
  await updateJob(req.params.id, req.body);

  return res.status(200).json({
    status: 'success',
    message: 'Job berhasil diperbarui',
  });
};


// DELETE JOB

export const deleteJob = async (req, res) => {
  await removeJob(req.params.id);

  return res.status(200).json({
    status: 'success',
  });
};
