import * as yup from "yup";

const schemaRegisterForm = yup
  .object()
  .shape({
    name: yup
      .string()
      .required("Please enter your name.")
      .min(2, "Your name must have more than 2 characters."),
    email: yup.string().required("Please insert your email.").email("This email is not valid."),
    password: yup
      .string()
      .required("Please enter your password.")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{7,})/,
        "Weak password, please check the info card."
      ),
    passwordConf: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match.")
      .required("Please enter a valid password."),
  })
  .required();

export default schemaRegisterForm;
