
import Joi from 'joi';

const usersSchema = Joi.object({
  name: Joi.string().required(),

  email: Joi.string()
    .email()
    .required(),

  password: Joi.string()
    .min(6)
    .required(),

  role: Joi.string()
    .max(20)
    .default('user'),
});

export default usersSchema;
