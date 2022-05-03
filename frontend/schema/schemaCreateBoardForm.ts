import * as z from "zod";

const SchemaCreateBoard = z.object({
  text: z.string().nonempty("Please enter the board name.").max(30, "Maximum of 30 characters"),
  maxVotes: z.string().min(1, "Please set the maximum number of votes.").optional(),
});

export default SchemaCreateBoard;
