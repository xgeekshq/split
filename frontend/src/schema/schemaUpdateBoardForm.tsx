import * as z from 'zod';

const SchemaUpdateBoard = z.object({
	title: z.string().min(1, 'Please enter the board name.').max(30, 'Maximum of 30 characters'),
	maxVotes: z
		.string()
		.regex(/^([1-9]\d*)|(undefined)$/, 'Please insert a number greater than zero.')
		.optional()
});

export default SchemaUpdateBoard;
