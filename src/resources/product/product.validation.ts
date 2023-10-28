import Joi from 'joi';

const create = Joi.object({
  name: Joi.string().max(120).required(),
  unit_type: Joi.string().valid('qty', 'ltr', 'kg', 'meter').required(),
  category: Joi.string().hex().length(24).required(),
  assets: Joi.array().items(
    Joi.object({
      url: Joi.string().required(),
      type: Joi.string().valid('image', 'video', 'gif').required(),
    }),
  ),
  price: Joi.number().required(),
  discount_percentage: Joi.number().required(),
  discount_amount: Joi.number().required(),
  discount_range: Joi.object({
    from: Joi.date().required(),
    to: Joi.date().required(),
  }).required(),
  tax_percentage: Joi.number().required(),
  stock: Joi.object({
    total: Joi.number().required(),
    available: Joi.number().required(),
  }).required(),
});

export default { create };
