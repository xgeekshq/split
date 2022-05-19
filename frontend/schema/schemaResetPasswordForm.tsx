import * as z from "zod";

const SchemaResetPasswordForm = z
  .object({
    newPassword: z
      .string()
      .nonempty("Please enter your password.")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{7,})/,
        "Weak password, please check the info card."
      ),
    newPasswordConf: z.string().nonempty("Please enter a valid password."),
  })
  .refine((data) => data.newPassword === data.newPasswordConf, {
    message: "Passwords don't match",
    path: ["newPasswordConf"],
  });

export default SchemaResetPasswordForm;
