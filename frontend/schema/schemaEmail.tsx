import * as z from "zod";

const SchemaEmail = z.object({
  email: z.string().nonempty("Please insert your email.").email("This email is not valid."),
});

export default SchemaEmail;
