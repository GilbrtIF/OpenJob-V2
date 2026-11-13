
import { InvariantError } from '../exceptions/index.js';

const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body ?? {});

    if (error) {
      throw new InvariantError(error.message);
    }

    req.body = value;

    next();
  };
};

export default validate;
