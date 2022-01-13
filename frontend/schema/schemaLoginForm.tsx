import * as z from "zod";

const SchemaLoginForm = z.object({
  email: z.string().nonempty("Please insert your email.").email("This email is not valid."),
  password: z.string().nonempty("Please enter your password."),
});

export default SchemaLoginForm;
