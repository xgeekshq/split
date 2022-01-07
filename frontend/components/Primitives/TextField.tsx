import { styled } from "../../stitches.config";

const TextField = styled("input", {
  // Reset
  borderWidth: "1px",
  boxSizing: "border-box",
  fontFamily: "inherit",

  // Custom
  backgroundColor: "$loContrast",
  color: "$hiContrast",
  fontVariantNumeric: "tabular-nums",

  "&:-webkit-autofill": {
    boxShadow: "inset 0 0 0 1px $colors$blue6, inset 0 0 0 100px $colors$blue3",
  },

  "&:-webkit-autofill::first-line": {
    fontFamily: "$untitled",
    color: "$hiContrast",
  },

  "&:focus": {
    "&:-webkit-autofill": {
      boxShadow:
        "inset 0px 0px 0px 1px $colors$blue8, 0px 0px 0px 1px $colors$blue8, inset 0 0 0 100px $colors$blue3",
    },
  },
  "&::placeholder": {
    color: "$slate9",
  },
  "&:disabled": {
    pointerEvents: "none",
    backgroundColor: "$slate2",
    color: "$slate8",
    cursor: "not-allowed",
    "&::placeholder": {
      color: "$slate7",
    },
  },
  "&:read-only": {
    backgroundColor: "$slate2",
    "&:focus": {
      boxShadow: "inset 0px 0px 0px 1px $colors$slate7",
    },
  },

  variants: {
    size: {
      "1": {
        borderRadius: "$1",
        height: "$5",
        fontSize: "$1",
        px: "$1",
        lineHeight: "$sizes$5",
        "&:-webkit-autofill::first-line": {
          fontSize: "$1",
        },
      },
      "2": {
        borderRadius: "$2",
        fontSize: "$20",
        p: "$8",
        "&:-webkit-autofill::first-line": {
          fontSize: "$20",
        },
      },
      "3": {
        borderRadius: "$6",
        fontSize: "$18",
        p: "$8",
        "&:-webkit-autofill::first-line": {
          fontSize: "$18",
        },
      },
    },
    backgroundColor: {
      blueLight: {
        backgroundColor: "$blue4",
      },
    },
    textColor: {
      white: {
        color: "white",
      },
    },
    variant: {
      ghost: {
        boxShadow: "none",
        backgroundColor: "transparent",
        "@hover": {
          "&:hover": {
            boxShadow: "inset 0 0 0 1px $colors$slateA7",
          },
        },
        "&:focus": {
          backgroundColor: "$loContrast",
          boxShadow: "inset 0px 0px 0px 1px $colors$blue8, 0px 0px 0px 1px $colors$blue8",
        },
        "&:disabled": {
          backgroundColor: "transparent",
        },
        "&:read-only": {
          backgroundColor: "transparent",
        },
      },
    },
    state: {
      invalid: {
        borderColor: "$red7",
        boxShadow: "inset 0 0 0 1px $colors$red7",
        "&:focus": {
          boxShadow: "inset 0px 0px 0px 1px $colors$red8, 0px 0px 0px 1px $colors$red8",
        },
      },
      valid: {
        boxShadow: "inset 0 0 0 1px $colors$green7",
        "&:focus": {
          boxShadow: "inset 0px 0px 0px 1px $colors$green8, 0px 0px 0px 1px $colors$green8",
        },
      },
    },
    cursor: {
      default: {
        cursor: "default",
        "&:focus": {
          cursor: "text",
        },
      },
      text: {
        cursor: "text",
      },
    },
  },
  defaultVariants: {
    size: "1",
  },
});

export default TextField;
