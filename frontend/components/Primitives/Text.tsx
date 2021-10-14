import { styled } from "../../stitches.config";

const Text = styled("span", {
  fontWeight: "$normal",
  variants: {
    noMargin: {
      true: {
        margin: 0,
      },
      false: {
        my: "$16",
      },
    },
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
    color: {
      red: {
        color: "$red10",
      },
    },
  },

  defaultVariants: {
    size: "base",
    noMargin: "true",
  },
});

export default Text;
