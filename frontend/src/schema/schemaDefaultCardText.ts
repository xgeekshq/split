import Joi from 'joi';

const SchemaDefaultCardText = Joi.object({
  text: Joi.string().required().trim().messages({
    'any.required': 'Please write a text',
    'string.empty': 'Please write a text',
  }),
});

export { SchemaDefaultCardText };
