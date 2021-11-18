import * as yup from "yup";

const SchemaCreateBoard = yup
  .object()
  .shape({
    title: yup.string().max(15, "Maximum of 15 characters").required(),
  })
  .required();

export default SchemaCreateBoard;
