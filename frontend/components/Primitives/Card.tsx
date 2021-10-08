import Flex from "./Flex";
import { styled } from "../../stitches.config";

const Card = styled("div", Flex, {
  borderRadius: "$40",
  justifyContent: "center",
  lineHeight: "$24",
  px: "$16",
  border: "2px solid $colors$blackA10",
  boxShadow: "0 2px 10px rgb(62 62 82 / 30%)",
  backgroundColor: "White",
});

export default Card;
