
import Joi from 'joi';

const companySchema = Joi.object({
  name: Joi.string()
    .required(),

  location: Joi.string()
    .required(),

  description: Joi.string()
    .allow('', null)
    .default(null),
});

export default companySchema;
