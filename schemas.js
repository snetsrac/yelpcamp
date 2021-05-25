const Joi = require('joi');

module.exports.campgroundSchema = Joi.object({
  campground: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().uri({ scheme: ['http', 'https'], domain: {} }).required(),
    price: Joi.number().min(0).precision(2).required(),
    location: Joi.string().required()
  }).required()
});
