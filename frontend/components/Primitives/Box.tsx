import { styled } from "../../stitches.config";
import Flex from "./Flex";

const Box = styled("div", Flex, {
  boxShadow: "0 2px 8px rgb(62 62 82 / 10%)",
  variants: {
    clickable: {
      true: {
        "&:hover": {
          boxShadow: "0 2px 10px rgb(62 62 82 / 30%)",
        },
      },
    },
  },
});

export default Box;
