import { styled } from "../../stitches.config";

const Text = styled("span", {
  margin: 0,
  fontWeight: "$normal",
  variants: {
    size: {
      base: {
        fontSize: "$base",
      },
      lg: {
        fontSize: "$lg",
      },
    },
    lineHeight: {
      20: {
        lineHeight: "$20",
      },
    },
    fontWeight: {
      bold: {
        fontWeight: "$bold",
      },
    },
  },

  defaultVariants: {
    size: "base",
  },
});

export default Text;
