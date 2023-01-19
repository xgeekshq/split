import Joi from 'joi';

const SchemaChangeColumnName = Joi.object({
  title: Joi.string().required().trim().max(15).messages({
    'any.required': 'Please write a name',
    'string.empty': 'Please write a name',
    'string.max': 'Maximum of 30 characters',
  }),
});

export { SchemaChangeColumnName };
