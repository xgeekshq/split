import { styled } from "../../stitches.config";

const Button = styled("button", {
  // Reset
  all: "unset",
  alignItems: "center",
  boxSizing: "border-box",
  userSelect: "none",
  "&::before": {
    boxSizing: "border-box",
  },
  "&::after": {
    boxSizing: "border-box",
  },

  // Custom reset?
  display: "inline-flex",
  flexShrink: 0,
  justifyContent: "center",
  lineHeight: "1",
  WebkitTapHighlightColor: "rgba(0,0,0,0)",

  "&:disabled": {
    backgroundColor: "$slate2",
    boxShadow: "inset 0 0 0 1px $colors$slate7",
    color: "$slate8",
    pointerEvents: "none",
  },

  variants: {
    size: {
      "1": {
        borderRadius: "$2",
        height: "$32",
        px: "$4",
        fontSize: "$4",
        lineHeight: "$8",
      },
      "2": {
        borderRadius: "$2",
        height: "$32",
        p: "$20",
        fontSize: "$20",
        lineHeight: "$8",
      },
      3: {
        borderRadius: "$8",
        height: "$32",
        p: "$20",
        fontSize: "$20",
        lineHeight: "$8",
        width: "100%",
        marginTop: "$8",
      },
    },
    color: {
      gray: {
        backgroundColor: "$loContrast",
        boxShadow: "inset 0 0 0 1px $slate7",
        color: "$hiContrast",
        "@hover": {
          "&:hover": {
            boxShadow: "inset 0 0 0 1px $slate8",
          },
        },
        "&:active": {
          backgroundColor: "$slate2",
          boxShadow: "inset 0 0 0 1px $slate8",
        },
        "&:focus": {
          boxShadow: "inset 0 0 0 1px $slate8, 0 0 0 1px $slate8",
        },
        '&[data-radix-popover-trigger][data-state="open"], &[data-radix-dropdown-menu-trigger][data-state="open"]':
          {
            backgroundColor: "$slate4",
            boxShadow: "inset 0 0 0 1px $slate8",
          },
      },
      blue: {
        backgroundColor: "$blue11",
        color: "white",
        "@hover": {
          "&:hover": {
            boxShadow: "inset 0 0 0 1px white",
          },
        },
        "&:active": {
          backgroundColor: "$blue5",
          boxShadow: "inset 0 0 0 1px $blue8",
        },
        "&:focus": {
          boxShadow: "inset 0 0 0 1px $blue8, 0 0 0 1px $blue8",
        },
        '&[data-radix-popover-trigger][data-state="open"], &[data-radix-dropdown-menu-trigger][data-state="open"]':
          {
            backgroundColor: "$blue5",
            boxShadow: "inset 0 0 0 1px $blue",
          },
      },
      green: {
        backgroundColor: "$green4",
        color: "$green11",
        "@hover": {
          "&:hover": { backgroundColor: "$green5" },
          "&:focus": { boxShadow: `0 0 0 2px $green7` },
        },
      },
      black: {
        backgroundColor: "black",
        color: "white",
        "@hover": {
          "&:hover": { backgroundColor: "$gray11" },
          "&:focus": { boxShadow: `0 0 0 2px $gray10` },
        },
      },
    },
    state: {
      active: {
        backgroundColor: "$slate4",
        boxShadow: "inset 0 0 0 1px $slate8",
        color: "$slate11",
        "@hover": {
          "&:hover": {
            backgroundColor: "$slate5",
            boxShadow: "inset 0 0 0 1px $slate8",
          },
        },
        "&:active": {
          backgroundColor: "$slate5",
        },
        "&:focus": {
          boxShadow: "inset 0 0 0 1px $slate8, 0 0 0 1px $slate8",
        },
      },
    },
    ghost: {
      true: {
        backgroundColor: "transparent",
        boxShadow: "none",
      },
    },
  },
  defaultVariants: {
    size: "1",
    color: "gray",
  },
});

export default Button;
