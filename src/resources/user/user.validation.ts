import Joi from 'joi';

const register = Joi.object({
  name: Joi.string().max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('admin', 'user').required(),
});

const login = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

export default { register, login };
