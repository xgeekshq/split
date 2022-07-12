import * as z from 'zod';

const SchemaResetPasswordForm = z
	.object({
		newPassword: z
			.string()
			.nonempty('Please enter your password.')
			.regex(
				/^(?=.*[A-Z])(?=.*\d)(?=.*\W)[A-Za-z\d\W]{8,}$/,
				'Use at least 8 characters, upper and lower case letters, numbers and symbols like !”?$%^&).'
			),
		newPasswordConf: z.string().nonempty('Please enter a valid password.')
	})
	.refine((data) => data.newPassword === data.newPasswordConf, {
		message: "Passwords don't match",
		path: ['newPasswordConf']
	});

export default SchemaResetPasswordForm;
