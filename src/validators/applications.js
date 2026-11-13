
import Joi from 'joi';

// Validator untuk membuat application
export const applicationSchema = Joi.object({
  // Opsional agar payload Postman diterima.
  // Identitas user sebenarnya diambil dari access token.
  user_id: Joi.string()
    .max(50)
    .optional(),

  job_id: Joi.string()
    .max(50)
    .required(),

  status: Joi.string()
    .max(20)
    .default('pending'),
});

// Validator untuk mengubah status application
export const updateApplicationSchema = Joi.object({
  status: Joi.string()
    .max(20)
    .required(),
});
