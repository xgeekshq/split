import Joi from 'joi';

const SchemaChangeColumnName = Joi.object({
  title: Joi.string().required().trim().max(30).messages({
    'any.required': 'Please write a name',
    'string.empty': 'Please write a name',
    'string.max': 'Maximum of 30 characters',
  }),
  text: Joi.string().required().trim().messages({
    'any.required': 'Please write a text',
    'string.empty': 'Please write a text',
  }),
});

export { SchemaChangeColumnName };
