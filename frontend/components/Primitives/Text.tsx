import { styled } from "../../stitches.config";

const Text = styled("span", {
  fontWeight: "$regular",
  color: "$primaryBase",
  fontFamily: "$body",
  fontSize: "$16",
  lineHeight: "$24",
  height: "fit-content",
  variants: {
    display: {
      1: {
        fontWeight: "$bold",
        fontSize: "$72",
        letterSpacing: "$-3",
        lineHeight: "$80",
      },
      2: {
        fontWeight: "$bold",
        fontSize: "$64",
        letterSpacing: "$2",
        lineHeight: "$72",
      },
      3: {
        fontWeight: "$bold",
        fontSize: "$48",
        letterSpacing: "$-1",
        lineHeight: "$56",
      },
    },
    heading: {
      1: {
        fontWeight: "$bold",
        fontSize: "$32",
        letterSpacing: "$0-4",
        lineHeight: "$36",
      },
      2: {
        fontWeight: "$bold",
        fontSize: "$28",
        letterSpacing: "$-0.35",
        lineHeight: "$32",
      },
      3: {
        fontWeight: "$bold",
        fontSize: "$24",
        letterSpacing: "$0-3",
        lineHeight: "$28",
      },
      4: {
        fontWeight: "$bold",
        fontSize: "$20",
        letterSpacing: "$0-25",
        lineHeight: "$24",
      },
      5: {
        fontWeight: "$bold",
        fontSize: "$16",
        letterSpacing: "$0-2",
        lineHeight: "$20",
      },
      6: {
        fontWeight: "$bold",
        fontSize: "$14",
        letterSpacing: "$0-17",
        lineHeight: "$18",
      },
      7: {
        fontWeight: "$bold",
        fontSize: "$12",
        letterSpacing: "$0-15",
        lineHeight: "$16",
      },
    },
    overline: {
      1: {
        fontWeight: "$bold",
        fontSize: "$14",
        letterSpacing: "$1",
        lineHeight: "$16",
      },
      2: {
        fontWeight: "$bold",
        fontSize: "$12",
        letterSpacing: "$1",
        lineHeight: "$14",
      },
    },
    weight: {
      medium: {
        fontWeight: "$medium",
      },
    },
    size: {
      xl: {
        fontSize: "$24",
        lineHeight: "$32",
      },
      lg: {
        fontSize: "$20",
        lineHeight: "$28",
      },
      md: {
        fontSize: "$16",
        lineHeight: "$24",
      },
      sm: {
        fontSize: "$14",
        lineHeight: "$20",
      },
      xs: {
        fontSize: "$12",
        lineHeight: "$16",
      },
      xxs: {
        fontSize: "$10",
        lineHeight: "$12",
      },
    },
    underline: {
      true: {
        textDecoration: "underline",
      },
    },
    label: {
      true: {
        fontSize: "$14",
        lineHeight: "$16",
        color: "$primary300",
        userSelect: "none",
      },
    },
    hint: {
      true: {
        fontSize: "$12",
        lineHeight: "$16",
        color: "$primary300",
      },
    },
    color: {
      white: {
        color: "$white",
      },
      primary300: {
        color: "$primary300",
      },
      primary400: {
        color: "$primary400",
      },
      primary800: {
        color: "$primary800",
      },
    },
  },
});

export default Text;
