const Joi = require('joi');

const addLeadSchema = Joi.object({
  // user_id: Joi.number().integer().required(),

  first_name: Joi.string().trim().required(),
  last_name: Joi.string().trim().required(),
  email: Joi.string().email().required(),
  phone_number: Joi.string().pattern(/^[0-9]{10,15}$/).optional(),

  status: Joi.string().trim().allow('').optional(),
  source: Joi.string().trim().allow('').optional(),
  type: Joi.string().trim().allow('').optional(),
  notes: Joi.string().trim().allow('').allow('').optional(),

  property_type: Joi.string().trim().allow('').optional(),
  budget_range: Joi.string().trim().allow('').optional(),
  preferred_location: Joi.string().trim().allow('').optional(),

  bedrooms: Joi.number().integer().allow('').optional(),
  bathrooms: Joi.number().integer().allow('').optional(),

  timeline: Joi.string().trim().allow('').optional(),

  // NEW: validate social media array
  social_media: Joi.array().items(
    Joi.object({
      platform: Joi.string().required(),
      handle: Joi.string().required()
    })
  ).optional()
});

module.exports = {
  addLeadSchema
};