import { styled } from "../../stitches.config";
import Flex from "./Flex";

const Fieldset = styled("fieldset", Flex, {
  all: "unset",
  width: "100%",
  flexDirection: "column",
  justifyContent: "flex-start",
});

export default Fieldset;
