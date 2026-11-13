
import Joi from 'joi';


// LOGIN VALIDATOR

export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),

  password: Joi.string()
    .required(),
});


// REFRESH TOKEN VALIDATOR
// Digunakan oleh PUT dan DELETE

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string()
    .required(),
});
