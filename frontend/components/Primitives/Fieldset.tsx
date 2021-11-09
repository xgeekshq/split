import { styled } from "../../stitches.config";
import Flex from "./Flex";

const Fieldset = styled("fieldset", Flex, {
  all: "unset",
  marginBottom: 20,
  width: "100%",
  flexDirection: "column",
  justifyContent: "flex-start",
  gap: "$8",
});

export default Fieldset;
