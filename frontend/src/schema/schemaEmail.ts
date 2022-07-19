import Joi from 'joi';

const SchemaEmail = Joi.object({
	email: Joi.string()
		.email({ tlds: { allow: false } })
		.required()
		.messages({
			'any.required': 'Please insert your email.',
			'string.empty': 'Please insert your email.',
			'string.email': 'This email is not valid.'
		})
});

export default SchemaEmail;
