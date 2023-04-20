import Joi from 'joi';

const SchemaCreateRegularBoard = Joi.object({
  text: Joi.string().allow('').optional().max(45).messages({
    'string.max': 'Maximum of 45 characters',
  }),
  maxVotes: Joi.number().integer().min(1).optional().messages({
    'number.min': 'Please insert a number greater than zero.',
  }),
});

export default SchemaCreateRegularBoard;
