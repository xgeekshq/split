import Joi from 'joi';

const SchemaAddMemberForm = Joi.object({
  search: Joi.string().optional().trim().max(30).messages({
    'string.max': 'Maximum of 30 characters',
  }),
});

export default SchemaAddMemberForm;
