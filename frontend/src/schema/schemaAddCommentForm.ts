import Joi from 'joi';

const SchemaAddCommentForm = Joi.object({
  text: Joi.string().min(1).required().messages({
    'any.required': 'Please write your comment',
    'string.empty': 'Please write your comment',
    'string.min': 'Your comment needs at least 1 characters',
  }),
});

export { SchemaAddCommentForm };
