import * as z from 'zod';

const schemaRegisterForm = z
	.object({
		firstName: z
			.string()
			.nonempty('Please enter your name.')
			.min(1, 'Your name must have more than 1 character.'),
		lastName: z
			.string()
			.nonempty('Please enter your name.')
			.min(1, 'Your name must have more than 1 character.'),
		email: z.string().nonempty('Please insert your email.').email('This email is not valid.'),
		password: z
			.string()
			.regex(/.*[A-Z].*/, 'One uppercase character')
			.regex(/.*[a-z].*/, 'One lowercase character')
			.regex(/.*\d.*/, 'One number')
			.regex(/.*[`~<>?,.\/!@#$%^&*()\-_+="'|{}\[\];:\\].*/, 'One special character')
			.min(8, 'Password must be at least 8 characters.'),

		passwordConf: z.string().nonempty('Please enter a valid password.')
	})
	.refine((data) => data.password === data.passwordConf, {
		message: "Passwords don't match",
		path: ['passwordConf']
	});

export default schemaRegisterForm;
