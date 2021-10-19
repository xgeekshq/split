import Flex from "./Flex";
import { styled } from "../../stitches.config";

const Card = styled("div", Flex, {
  borderRadius: "$40",
  justifyContent: "center",
  lineHeight: "$24",
  px: "$16",
  border: "1px solid $colors$blackA10",
  backgroundColor: "White",
});

export default Card;
