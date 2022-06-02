import * as z from 'zod';

const SchemaResetPasswordForm = z
	.object({
		newPassword: z
			.string()
			.nonempty('Please enter your password.')
			.regex(/.*[A-Z].*/, 'One uppercase character')
			.regex(/.*[a-z].*/, 'One lowercase character')
			.regex(/.*\d.*/, 'One number')
			.regex(/.*[`~<>?,.\/!@#$%^&*()\-_+="'|{}\[\];:\\].*/, 'One special character')
			.min(8, 'Password must be at least 8 characters.'),
		newPasswordConf: z.string().nonempty('Please enter a valid password.')
	})
	.refine((data) => data.newPassword === data.newPasswordConf, {
		message: "Passwords don't match",
		path: ['newPasswordConf']
	});

export default SchemaResetPasswordForm;
