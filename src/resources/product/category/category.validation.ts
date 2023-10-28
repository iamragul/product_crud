import Joi from 'joi';

const createCategory = Joi.object({
  app: Joi.string().max(30).required(),
  name: Joi.string().max(30).required(),
  parentId: Joi.string().max(30),
});

export default { createCategory };
