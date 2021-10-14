import { styled } from "../../stitches.config";

const Paragraph = styled("p", {
  variants: {
    variant: {
      red: {
        color: "$red10",
      },
    },
  },
});

export default Paragraph;
