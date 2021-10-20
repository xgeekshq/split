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
      16: {
        fontSize: "$16",
      },
      18: {
        fontSize: "$18",
      },
      20: {
        fontSize: "$20",
      },
      36: {
        fontSize: "$36",
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
  compoundVariants: [
    {
      size: "36",
      fontWeight: "bold",
      css: {
        my: "$24",
      },
    },
  ],
  defaultVariants: {
    size: "base",
    noMargin: "true",
  },
});

export default Text;
