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

  // Custom
  height: "$8",
  px: "$2",
  fontFamily: "$untitled",
  fontSize: "$2",
  fontWeight: 500,
  fontVariantNumeric: "tabular-nums",

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
        lineHeight: "$sizes$7",
      },
    },
    variant: {
      gray: {
        backgroundColor: "$loContrast",
        boxShadow: "inset 0 0 0 1px $colors$slate7",
        color: "$hiContrast",
        "@hover": {
          "&:hover": {
            boxShadow: "inset 0 0 0 1px $colors$slate8",
          },
        },
        "&:active": {
          backgroundColor: "$slate2",
          boxShadow: "inset 0 0 0 1px $colors$slate8",
        },
        "&:focus": {
          boxShadow: "inset 0 0 0 1px $colors$slate8, 0 0 0 1px $colors$slate8",
        },
        '&[data-radix-popover-trigger][data-state="open"], &[data-radix-dropdown-menu-trigger][data-state="open"]':
          {
            backgroundColor: "$slate4",
            boxShadow: "inset 0 0 0 1px $colors$slate8",
          },
      },
      blue: {
        backgroundColor: "$blue11",
        color: "white",
        "@hover": {
          "&:hover": {
            boxShadow: "inset 0 0 0 1px $colors$blue8",
          },
        },
        "&:active": {
          backgroundColor: "$blue3",
          boxShadow: "inset 0 0 0 1px $colors$blue8",
        },
        "&:focus": {
          boxShadow: "inset 0 0 0 1px $colors$blue8, 0 0 0 1px $colors$blue8",
        },
        '&[data-radix-popover-trigger][data-state="open"], &[data-radix-dropdown-menu-trigger][data-state="open"]':
          {
            backgroundColor: "$blue4",
            boxShadow: "inset 0 0 0 1px $colors$blue8",
          },
      },
      transparentWhite: {
        backgroundColor: "hsla(0,100%,100%,.2)",
        color: "white",
        "@hover": {
          "&:hover": {
            backgroundColor: "hsla(0,100%,100%,.25)",
          },
        },
        "&:active": {
          backgroundColor: "hsla(0,100%,100%,.3)",
        },
        "&:focus": {
          boxShadow: "inset 0 0 0 1px hsla(0,100%,100%,.35), 0 0 0 1px hsla(0,100%,100%,.35)",
        },
      },
      transparentBlack: {
        backgroundColor: "hsla(0,0%,0%,.2)",
        color: "black",
        "@hover": {
          "&:hover": {
            backgroundColor: "hsla(0,0%,0%,.25)",
          },
        },
        "&:active": {
          backgroundColor: "hsla(0,0%,0%,.3)",
        },
        "&:focus": {
          boxShadow: "inset 0 0 0 1px hsla(0,0%,0%,.35), 0 0 0 1px hsla(0,0%,0%,.35)",
        },
      },
    },
    state: {
      active: {
        backgroundColor: "$slate4",
        boxShadow: "inset 0 0 0 1px $colors$slate8",
        color: "$slate11",
        "@hover": {
          "&:hover": {
            backgroundColor: "$slate5",
            boxShadow: "inset 0 0 0 1px $colors$slate8",
          },
        },
        "&:active": {
          backgroundColor: "$slate5",
        },
        "&:focus": {
          boxShadow: "inset 0 0 0 1px $colors$slate8, 0 0 0 1px $colors$slate8",
        },
      },
      waiting: {
        backgroundColor: "$slate4",
        boxShadow: "inset 0 0 0 1px $colors$slate8",
        color: "transparent",
        pointerEvents: "none",
        "@hover": {
          "&:hover": {
            backgroundColor: "$slate5",
            boxShadow: "inset 0 0 0 1px $colors$slate8",
          },
        },
        "&:active": {
          backgroundColor: "$slate5",
        },
        "&:focus": {
          boxShadow: "inset 0 0 0 1px $colors$slate8",
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
    variant: "gray",
  },
});

export default Button;
