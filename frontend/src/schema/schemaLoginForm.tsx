import * as z from 'zod';

const SchemaLoginForm = z.object({
	email: z.string().nonempty('Please insert your email.').email('This email is not valid.'),
	password: z
		.string()
		.nonempty('Please enter your password.')
		.regex(/.*[A-Z].*/, 'One uppercase character')
		.regex(/.*[a-z].*/, 'One lowercase character')
		.regex(/.*\d.*/, 'One number')
		.regex(/.*[`~<>?,.\/!@#$%^&*()\-_+="'|{}\[\];:\\].*/, 'One special character')
		.min(8, 'Password must be at least 8 characters.')
});

export default SchemaLoginForm;
