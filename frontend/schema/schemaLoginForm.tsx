import * as yup from "yup";

const SchemaLoginForm = yup
  .object()
  .shape({
    email: yup.string().required("Please insert your email.").email("This email is not valid."),
    password: yup.string().required("Please enter your password."),
  })
  .required();

export default SchemaLoginForm;
