const createError = require('http-errors');
const sanitizeHtml = require('sanitize-html');
const Joi = require('joi').extend((joi) => {
  return {
    type: 'string',
    base: joi.string(),
    messages: {
      'string.escapeHTML': '{{#label}} must not include HTML'
    },
    rules: {
      escapeHTML: {
        validate(value, helpers) {
          const clean = sanitizeHtml(value, {
            allowedTags: [],
            allowedAttributes: {}
          });
          
          if (clean !== value) {
            return helpers.error('string.escapeHTML', { value });
          }

          return clean;
        }
      }
    }
  }
});

const schemas = {};

schemas.user = Joi.object({
  username: Joi.string().required().escapeHTML(),
  password: Joi.string().required().escapeHTML(),
  email: Joi.string().email().required()
});

schemas.campground = Joi.object({
  campground: Joi.object({
    title: Joi.string().required().escapeHTML(),
    description: Joi.string().required().escapeHTML(),
    price: Joi.number().min(0).precision(2).required(),
    location: Joi.string().required().escapeHTML()
  }).required(),
  imagesToDelete: Joi.array().items(Joi.string())
});

schemas.review = Joi.object({
  review: Joi.object({
    rating: Joi.number().integer().min(1).max(5).required(),
    text: Joi.string().allow('').escapeHTML()
  }).required()
});

module.exports = (schemaName) => {
  if (!Joi.isSchema(schemas[schemaName])) {
    throw Error(`A validation schema named ${schemaName} could not be found`);
  }

  return (req, res, next) => {
    const { error, value } = schemas[schemaName].validate(req.body, { abortEarly: false });

    if (error) {
      throw createError(400, error.details.map(prettyMessage).join('\n'));
    } else {
      req.body = value;
      next();
    }
  };
}

function prettyMessage(e) {
  const path = e.path.join(' ');
  return e.message.replace(/^"[^"]*"/, path[0].toUpperCase() + path.slice(1)) + '.';
}
