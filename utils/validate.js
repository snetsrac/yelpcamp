const createError = require('http-errors');
const Joi = require('joi');
const schemas = {};

schemas.user = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  email: Joi.string().email().required()
});

schemas.campground = Joi.object({
  campground: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().uri({ scheme: ['http', 'https'], domain: {} }).required(),
    price: Joi.number().min(0).precision(2).required(),
    location: Joi.string().required()
  }).required()
});

schemas.review = Joi.object({
  review: Joi.object({
    rating: Joi.number().integer().min(1).max(5).required(),
    text: Joi.string().allow('')
  }).required()
});

module.exports = (schemaName) => {
  if (!Joi.isSchema(schemas[schemaName])) {
    throw Error(`A validation schema named ${schemaName} could not be found`);
  }

  return (req, res, next) => {
    const { error, value } = schemas[schemaName].validate(req.body, { abortEarly: false });

    if (error) {
      throw createError(400, error.details.map((e) => e.message).join('\n'));
    } else {
      req.body = value;
      next();
    }
  };
}
