import Joi from 'joi';

const SchemaResetPasswordForm = Joi.object({
	newPassword: Joi.string()
		.required()
		.regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*\W)[A-Za-z\d\W]{8,}$/)
		.min(8)
		.messages({
			'string.min': 'Password must be at least 8 characters.',
			'any.required': 'Please insert your password',
			'string.empty': 'Please insert your password',
			'string.pattern.base':
				'Use at least 8 characters, upper and lower case letters, numbers and symbols like !“?$%^&).'
		}),
	newPasswordConf: Joi.any().valid(Joi.ref('newPassword')).required().messages({
		'any.required': 'Please enter a valid password.',
		'string.empty': 'Please enter a valid password.',
		'any.only': 'Confirm Password does not match'
	})
});
export default SchemaResetPasswordForm;
