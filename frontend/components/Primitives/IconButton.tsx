import { styled } from "../../stitches.config";
import Button from "./Button";

const IconButton = styled(Button, {
  // Reset
  appearance: "none",
  borderWidth: "0",
  fontFamily: "inherit",
  fontSize: "$sm",
  outline: "none",
  padding: "0",
  textDecoration: "none",
  color: "$hiContrast",
  backgroundColor: "$loContrast",
  border: "1px solid $slate7",
  "@hover": {
    "&:hover": {
      borderColor: "$slate8",
    },
  },
  "&:active": {
    backgroundColor: "$slate2",
  },
  "&:focus": {
    borderColor: "$slate8",
    boxShadow: "0 0 0 1px $colors$slate8",
  },
  "&:disabled": {
    backgroundColor: "transparent",
    color: "$slate6",
  },

  variants: {
    size: {
      "20": {
        borderRadius: "$2",
        height: "$20",
        width: "$20",
      },
      "40": {
        borderRadius: "$2",
        height: "$40",
        width: "$40",
      },
    },
    variant: {
      ghost: {
        backgroundColor: "transparent",
        borderWidth: "0",
        "@hover": {
          "&:hover": {
            backgroundColor: "$slateA4",
          },
        },
        "&:focus": {
          boxShadow: "inset 0 0 0 1px $colors$slateA8, 0 0 0 1px $colors$slateA8",
        },
        "&:active": {
          backgroundColor: "$slateA4",
        },
        '&[data-radix-popover-trigger][data-state="open"], &[data-radix-dropdown-menu-trigger][data-state="open"]':
          {
            backgroundColor: "$slateA4",
          },
      },
      "filled-circle": {
        borderRadius: "50%",
        backgroundColor: "$slateA4",
        border: "none",
      },
    },
    state: {
      active: {
        backgroundColor: "$slate4",
        boxShadow: "inset 0 0 0 1px hsl(206,10%,76%)",
        "@hover": {
          "&:hover": {
            boxShadow: "inset 0 0 0 1px hsl(206,10%,76%)",
          },
        },
        "&:active": {
          backgroundColor: "$slate4",
        },
      },
    },
  },
  defaultVariants: {
    variant: "ghost",
  },
});

export default IconButton;
