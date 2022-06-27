import Joi from 'joi';

const SchemaCreateBoard = Joi.object({
	title: Joi.string().required().max(30).messages({
		'any.required': 'Please enter the board name',
		'string.empty': 'Please enter the board name',
		'string.max': 'Maximum of 30 characters'
	}),
	maxVotes: Joi.string()
		.pattern(/^([1-9]\d*)|(undefined)$/)
		.optional()
		.messages({
			'string.pattern.base': 'Please insert a number greater than zero.'
		})
});

export default SchemaCreateBoard;
