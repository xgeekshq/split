import Joi from 'joi';

const SchemaLoginForm = Joi.object({
  email: Joi.string()
    .required()
    .email({ tlds: { allow: false } })
    .messages({
      'any.required': 'Please insert your email.',
      'string.empty': 'Please insert your email.',
      'string.email': 'This email is not valid.',
    }),
  password: Joi.string()
    .pattern(/.*[A-Z].*/)
    .rule({ message: 'One uppercase character.' })
    .pattern(/.*[a-z].*/)
    .rule({ message: 'One lowercase character.' })
    .pattern(/.*\d.*/)
    .rule({ message: 'One number.' })
    .pattern(/.*[`~<>?,./!@#$%^&*()\-_+="'|{}[\];:\\].*/)
    .rule({ message: 'One special character' })
    .min(8)
    .required()
    .messages({
      'any.required': 'Please enter your password.',
      'string.empty': 'Please enter your password.',
      'string.min': 'Password must be at least 8 characters.',
    }),
});

export default SchemaLoginForm;
