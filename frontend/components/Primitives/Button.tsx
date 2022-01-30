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
        fontSize: "$20",
        lineHeight: "$8",
      },
      "20": {
        borderRadius: "$2",
        height: "$20",
        width: "$20",
      },
      inputSize: {
        height: "$5",
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
          "&:hover": { backgroundColor: "$blue5" },
          "&:focus": { boxShadow: `0 0 0 2px $blue7` },
        },
      },
      green: {
        backgroundColor: "$green7",
        color: "$green11",
        "@hover": {
          "&:hover": { backgroundColor: "$green5" },
          "&:focus": { boxShadow: `0 0 0 2px $green7` },
        },
      },
      red: {
        backgroundColor: "$red11",
        color: "white",
        "@hover": {
          "&:hover": { backgroundColor: "$red5" },
          "&:focus": { boxShadow: `0 0 0 2px $red7` },
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
    },
  },
});

export default Button;

export const StyledIconButton = styled(Button, { cursor: "pointer" });
