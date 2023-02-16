import Joi from 'joi';

const SchemaLoginGuestForm = Joi.object({
  username: Joi.string().required().min(3).messages({
    'any.required': 'Please insert your name.',
    'string.empty': 'Please insert your name.',
  }),
});
export default SchemaLoginGuestForm;
