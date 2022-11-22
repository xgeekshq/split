import Joi from 'joi';

const SchemaCreateTeam = Joi.object({
	text: Joi.string().required().trim().max(40).messages({
		'any.required': 'Please enter the team name',
		'string.empty': 'Please enter the team name',
		'string.max': 'Maximum of 40 characters'
	})
});

export default SchemaCreateTeam;
