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
      xl: {
        fontSize: "$xl",
      },
    },
    lineHeight: {
      20: {
        lineHeight: "$20",
      },
    },
    fontWeight: {
      medium: {
        fontWeight: "$medium",
      },
      semiBold: {
        fontWeight: "$semiBold",
      },
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
