import Joi from 'joi';

const SchemaCreateBoard = Joi.object({
  text: Joi.string().required().trim().max(45).messages({
    'any.required': 'Please enter the board name',
    'string.empty': 'Please enter the board name',
    'string.max': 'Maximum of 45 characters',
  }),
  maxVotes: Joi.number().integer().min(1).optional().messages({
    'number.min': 'Please insert a number greater than zero.',
  }),
  slackEnable: Joi.boolean().required().messages({
    'boolean.required': 'Please enter the value for slack enable.',
  }),
  maxTeams: Joi.any(), // Dynamic validation inside QuickEditSubTeams
  maxUsers: Joi.any(), // Dynamic validation inside QuickEditSubTeams
});

export default SchemaCreateBoard;
