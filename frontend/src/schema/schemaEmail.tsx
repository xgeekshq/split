import Joi from 'joi';

const SchemaEmail = Joi.object({
	email: Joi.string()
		.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
		.required()
		.messages({
			'any.required': 'Please insert your email.',
			'string.empty': 'Please insert your email.',
			'string.pattern.base': 'This email is not valid.'
		})
});

export default SchemaEmail;
