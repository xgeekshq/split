import Joi from 'joi';

const SchemaCreateRegularBoard = Joi.object({
  text: Joi.string().allow('').optional().max(30).messages({
    'string.max': 'Maximum of 30 characters',
  }),
  maxVotes: Joi.number().integer().min(1).optional().messages({
    'number.min': 'Please insert a number greater than zero.',
  }),
  slackEnable: Joi.boolean().required().messages({
    'boolean.required': 'Please enter the value for slack enable.',
  }),
});

export default SchemaCreateRegularBoard;
