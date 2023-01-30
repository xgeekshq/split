import Joi from 'joi';

const SchemaUpdateBoard = Joi.object({
  title: Joi.string().required().trim().max(30).messages({
    'any.required': 'Please enter the board name',
    'string.empty': 'Please enter the board name',
    'string.max': 'Maximum of 30 characters',
  }),
  maxVotes: Joi.number().min(1).allow(null).optional().messages({
    'number.base': 'Max votes needs to be a number',
    'number.min': 'Please insert a number greater than zero.',
  }),
  column1title: Joi.string().trim().max(15).messages({
    'any.required': 'Please enter the Column 1 name',
    'string.empty': 'Please enter the Column 1 name',
    'string.max': 'Maximum of 15 characters',
  }),
  column2title: Joi.string().trim().max(15).messages({
    'string.empty': 'Please enter the Column 2 name',
    'string.max': 'Maximum of 15 characters',
  }),
  column3title: Joi.string().trim().max(15).messages({
    'string.empty': 'Please enter the Column 3 name',
    'string.max': 'Maximum of 15 characters',
  }),
  column4title: Joi.string().trim().max(15).messages({
    'string.empty': 'Please enter the Column 4 name',
    'string.max': 'Maximum of 15 characters',
  }),
});

export default SchemaUpdateBoard;
