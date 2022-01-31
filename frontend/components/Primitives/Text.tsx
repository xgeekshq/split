import { styled } from "../../stitches.config";

const Text = styled("span", {
  fontWeight: "$normal",
  width: "fit-content",
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
      12: {
        fontSize: "$12",
      },
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
      white: {
        color: "white",
      },
      gray: {
        color: "gray",
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
    {
      size: "18",
      fontWeight: "bold",
      css: {
        my: "$16",
      },
    },
  ],
  defaultVariants: {
    size: "16",
    noMargin: "true",
  },
});

export default Text;
