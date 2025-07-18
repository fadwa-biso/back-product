const Joi = require('joi');

const createUserProfileSchema = Joi.object({
    user: Joi.string().required().messages({
        'any.required': 'User ID is required'
    }),
    fullName: Joi.string().min(3).max(100).required(),
    phone: Joi.string().min(10).max(15),
    address: Joi.string().max(200),
});

module.exports = { createUserProfileSchema };
