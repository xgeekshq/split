import Joi from 'joi';

const SchemaCreateBoard = Joi.object({
  text: Joi.string().required().trim().max(30).messages({
    'any.required': 'Please enter the board name',
    'string.empty': 'Please enter the board name',
    'string.max': 'Maximum of 30 characters',
  }),
  maxVotes: Joi.number().min(1).optional().messages({
    'number.min': 'Please insert a number greater than zero.',
  }),
  slackEnable: Joi.boolean().required().messages({
    'boolean.required': 'Please enterm the value for slack enable.',
  }),
});

export default SchemaCreateBoard;
