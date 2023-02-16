import Joi from 'joi';

// TODO: columns messages.
const SchemaUpdateBoard = Joi.object({
  title: Joi.string().required().trim().max(45).messages({
    'any.required': 'Please enter the board name',
    'string.empty': 'Please enter the board name',
    'string.max': 'Maximum of 45 characters',
  }),
  maxVotes: Joi.number().min(1).allow(null).optional().messages({
    'number.base': 'Max votes needs to be a number',
    'number.min': 'Please insert a number greater than zero.',
  }),
  formColumns: Joi.array().min(1).max(4),
});

export default SchemaUpdateBoard;
