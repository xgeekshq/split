import * as z from "zod";

const SchemaCreateBoard = z.object({
  title: z.string().max(15, "Maximum of 15 characters").nonempty("Please enter a title."),
});

export default SchemaCreateBoard;
