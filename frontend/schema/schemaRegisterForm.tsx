import * as z from 'zod';

const schemaRegisterForm = z
	.object({
		firstName: z
			.string()
			.nonempty('Please enter your name.')
			.min(2, 'Your name must have more than 2 characters.'),
		lastName: z
			.string()
			.nonempty('Please enter your name.')
			.min(2, 'Your name must have more than 2 characters.'),
		email: z.string().nonempty('Please insert your email.').email('This email is not valid.'),
		password: z
			.string()
			.regex(
				/^(?=.*[A-Za-z])(?=.*\d)(?=.*\W)[A-Za-z\d\W]{8,}$/,
				'Use at least 8 characters, upper and lower case letters, numbers and symbols like !”?$%^&).'
			),

		passwordConf: z.string().nonempty('Please enter a valid password.')
	})
	.refine((data) => data.password === data.passwordConf, {
		message: "Passwords don't match",
		path: ['passwordConf']
	});

export default schemaRegisterForm;
