const Joi = require('joi');

const updatePatientSchema = Joi.object({
age: Joi.number()
    .min(0)
    .max(150)
    .required()
    .messages({
        'number.base': 'Age must be a number',
        'number.min': 'Age must be at least 0',
        'number.max': 'Age must be at most 150',
        'any.required': 'Age is required',
    }),

treatment: Joi.array()
    .items(Joi.string().min(1))
    .min(1)
    .required()
    .messages({
        'array.base': 'Treatment must be an array of strings',
        'array.min': 'At least one treatment is required',
        'any.required': 'Treatment is required',
    }),

medicalHistory: Joi.array()
    .items(Joi.string().min(1))
    .optional(),

investigation: Joi.string()
    .max(1000)
    .optional()
    .allow('', null)
});

module.exports = { updatePatientSchema };
