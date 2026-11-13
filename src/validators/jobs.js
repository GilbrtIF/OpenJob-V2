
import Joi from 'joi';

const jobSchema = Joi.object({
  // Foreign Keys
  company_id: Joi.string()
    .max(50)
    .required(),

  category_id: Joi.string()
    .max(50)
    .required(),

  // Informasi pekerjaan
  title: Joi.string()
    .max(255)
    .required(),

  description: Joi.string()
    .required(),

  job_type: Joi.string()
    .max(50)
    .required(),

  experience_level: Joi.string()
    .max(50)
    .required(),

  location_type: Joi.string()
    .max(50)
    .required(),

  // Lokasi opsional
  location_city: Joi.string()
    .max(100)
    .allow('', null),

  // Informasi gaji opsional
  salary_min: Joi.number()
    .integer()
    .allow(null),

  salary_max: Joi.number()
    .integer()
    .allow(null),

  // Default true
  is_salary_visible: Joi.boolean()
    .default(true),

  // Default open
  status: Joi.string()
    .max(20)
    .default('open'),
});

export default jobSchema;
