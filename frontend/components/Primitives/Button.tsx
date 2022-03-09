import React from "react";
import { styled } from "../../stitches.config";

const StyledButton = styled("button", {
  fontFamily: "DM Sans",
  borderRadius: "$12",
  height: "$56",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  border: "none",
  outline: "none",
  gap: "$8",
  "@hover": {
    "&:hover": {
      cursor: "pointer",
    },
  },
  variants: {
    variant: {
      primary: {
        color: "white",
        backgroundColor: "$primaryBase",
        "@hover": {
          "&:hover": {
            backgroundColor: "$primary600",
          },
        },
        "&:active": {
          backgroundColor: "$primary600",
          boxShadow: "inset 0px 2px 4px rgba(0, 0, 0, 0.8)",
        },

        "&:disabled": {
          backgroundColor: "$primary200",
        },
      },
      primaryOutline: {
        backgroundColor: "transparent",
        border: "2px solid $primaryBase",
        boxSizing: "border-box",
        "@hover": {
          "&:hover": {
            color: "white",
            border: "2px solid $primary600",
            backgroundColor: "$primary600",
          },
        },
        "&:active": {
          color: "white",
          backgroundColor: "$primary600",
          boxShadow: "inset 0px 2px 4px rgba(0, 0, 0, 0.5)",
        },
        "&:disabled": {
          backgroundColor: "2px solid $primary100",
        },
      },
      light: {
        backgroundColor: "$primary100",
        "@hover": {
          "&:hover": {
            backgroundColor: "$primary200",
          },
        },
        "&:active": {
          backgroundColor: "$primary200",
          boxShadow: "inset 0px 2px 4px rgba(0, 0, 0, 0.1)",
        },

        "&:disabled": {
          backgroundColor: "$primary50",
          opacity: 0.8,
        },
      },
      lightOutline: {
        backgroundColor: "transparent",
        border: "2px solid $primary200",
        boxSizing: "border-box",
        "@hover": {
          "&:hover": {
            backgroundColor: "$primary200",
          },
        },
        "&:active": {
          backgroundColor: "$primary200",
          boxShadow: "inset 0px 2px 4px rgba(0, 0, 0, 0.1)",
        },
        "&:disabled": {
          backgroundColor: "2px solid $primary100",
          opacity: 0.3,
        },
      },
      danger: {
        color: "white",
        backgroundColor: "$dangerBase",
        "@hover": {
          "&:hover": {
            backgroundColor: "$danger700",
          },
        },
        "&:active": {
          backgroundColor: "$danger700",
          boxShadow: "inset 0px 2px 4px rgba(0, 0, 0, 0.1)",
        },

        "&:disabled": {
          backgroundColor: "$danger400",
          opacity: 0.3,
        },
      },
      dangerOutline: {
        color: "$dangerBase",
        backgroundColor: "transparent",
        border: "2px solid $danger500",
        boxSizing: "border-box",
        "@hover": {
          "&:hover": {
            color: "white",
            border: "2px solid $danger700",
            backgroundColor: "$danger700",
          },
        },
        "&:active": {
          color: "white",
          backgroundColor: "$danger700",
          border: "2px solid $danger700",
          boxShadow: "inset 0px 2px 4px rgba(0, 0, 0, 0.1)",
        },
        "&:disabled": {
          backgroundColor: "1px solid $dangerBase",
          opacity: 0.3,
        },
      },
    },
    isIcon: {
      true: {},
    },
    textSize: {
      lg: {
        fontSize: "$18",
        lineHeight: "$24",
      },
      md: {
        fontSize: "$16",
        lineHeight: "$20",
      },
      sm: {
        fontSize: "$14",
        lineHeight: "$16",
      },
    },
    size: {
      lg: {
        height: "$56",
        fontWeight: "$bold",
        fontSize: "$18",
        lineHeight: "$24",
        px: "$24",
        py: "$16",
        "& svg": {
          height: "$24 !important",
          width: "$24 !important",
        },
        "& span": {
          height: "$24 !important",
          width: "$24 !important",
        },
      },
      md: {
        height: "$48",
        fontWeight: "$bold",
        fontSize: "$16",
        lineHeight: "$20",
        px: "$24",
        py: "$14",
        "& svg": {
          height: "$20 !important",
          width: "$20 !important",
        },
        "& span": {
          height: "$20 !important",
          width: "$20 !important",
        },
      },
      sm: {
        height: "$36",
        fontWeight: "$bold",
        fontSize: "$14",
        lineHeight: "$16",
        px: "$16",
        py: "$10",
        "& svg": {
          height: "$16 !important",
          width: "$16 !important",
        },
        "& span": {
          height: "$16 !important",
          width: "$16 !important",
        },
      },
    },
  },
  compoundVariants: [
    {
      size: "lg",
      isIcon: "true",
      css: {
        p: "$16",
      },
    },
    {
      size: "md",
      isIcon: "true",
      css: {
        p: "$14",
      },
    },
    {
      size: "sm",
      isIcon: "true",
      css: {
        p: "$10",
      },
    },
  ],
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

type ButtonProps = React.ComponentProps<typeof StyledButton>;

const Button: React.FC<ButtonProps> = ({ ...props }) => {
  return <StyledButton role="button" {...props} />;
};

export default Button;
