import * as z from "zod";

const schemaRegisterForm = z
  .object({
    name: z
      .string()
      .nonempty("Please enter your name.")
      .min(2, "Your name must have more than 2 characters."),
    email: z.string().nonempty("Please insert your email.").email("This email is not valid."),
    password: z
      .string()
      .nonempty("Please enter your password.")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{7,})/,
        "Weak password, please check the info card."
      ),
    passwordConf: z.string().nonempty("Please enter a valid password."),
  })
  .refine((data) => data.password === data.passwordConf, {
    message: "Passwords don't match",
    path: ["passwordConf"],
  });

export default schemaRegisterForm;
