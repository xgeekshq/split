import Joi from 'joi';

const SchemaUpdateBoard = Joi.object({
	title: Joi.string().required().max(30).messages({
		'any.required': 'Please enter the board name',
		'string.empty': 'Please enter the board name',
		'string.max': 'Maximum of 30 characters'
	}),
	maxVotes: Joi.number().min(1).allow(null).optional().messages({
		'number.base': 'Max votes needs to be a number',
		'number.min': 'Please insert a number greater than zero.'
	})
});

export default SchemaUpdateBoard;
