import Joi from 'joi';

const SchemaDuplicateBoard = Joi.object({
  title: Joi.string().required().trim().max(45).messages({
    'any.required': 'Please enter the board name',
    'string.empty': 'Please enter the board name',
    'string.max': 'Maximum of 45 characters',
  }),
});

export default SchemaDuplicateBoard;
