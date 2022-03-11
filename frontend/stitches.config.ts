import { createStitches } from "@stitches/react";
import type * as Stitches from "@stitches/react";
import dangerColors from "./styles/colors/danger.colors";
import highlight1Colors from "./styles/colors/highlight1.colors";
import highlight2Colors from "./styles/colors/highlight2.colors";
import highlight3Colors from "./styles/colors/highlight3.colors";
import highlight4Colors from "./styles/colors/highlight4.colors";
import infoColors from "./styles/colors/info.colors";
import primaryColors from "./styles/colors/primary.colors";
import secondaryColors from "./styles/colors/secondary.colors";
import successColors from "./styles/colors/success.colors";
import warningColors from "./styles/colors/warning.colors";

export const { styled, css, globalCss, keyframes, getCssText, theme, createTheme, config } =
  createStitches({
    theme: {
      colors: {
        background: "#F8F8F8",
        surface: "#FFFFFF",
        transparent: "#FFFFFF 0%",
        black: "#000000",
        white: "#FFFFFF",

        ...primaryColors,
        ...secondaryColors,
        ...highlight1Colors,
        ...highlight2Colors,
        ...highlight3Colors,
        ...highlight4Colors,
        ...dangerColors,
        ...successColors,
        ...warningColors,
        ...infoColors,
      },
      fontSizes: {
        8: "0.35rem",
        10: "0.50rem",
        12: "0.75rem",
        14: "0.875rem",
        16: "1rem",
        18: "1.125rem",
        20: "1.25rem",
        24: "1.5rem",
        28: "1.75rem",
        32: "2rem",
        48: "3rem",
        64: "4rem",
        72: "4.5rem",
      },
      fontWeights: {
        regular: "400",
        medium: "500",
        semiBold: "600",
        bold: "700",
        extrabold: "800",
      },
      letterSpacings: {
        "0-15": "-0.009375rem",
        "0-17": "-0.010625rem",
        "0-2": "-0.0125rem",
        "0-25": "-0.015625rem",
        "0-3": "-0.01875rem",
        "0-35": "-0.021875rem",
        "0-4": "-0.025rem",
        "-1": "-0.0625rem",
        "2": "-0.125rem",
        "3": "-0.1875rem",
        "1": "0.0625rem",
      },
      space: {
        2: "0.125rem",
        4: "0.250rem",
        6: "0.375rem",
        8: "0.5rem",
        10: "0.625rem",
        12: "0.750rem",
        14: "0.875rem",
        16: "1rem",
        17: "1.0625rem",
        18: "1.125rem",
        20: "1.25rem",
        24: "1.5rem",
        26: "1.625rem",
        28: "1.75rem",
        32: "2rem",
        40: "2.5rem",
        48: "3rem",
        50: "3.125rem",
        54: "3.375rem",
        56: "3.5rem",
        57: "3.5625rem",
        62: "3.875rem",
        74: "4.625rem",
        162: "10.125rem",
        202: "12.625rem",
      },
      sizes: {
        2: "0.125rem",
        4: "0.25rem",
        6: "0.375rem",
        8: "0.5rem",
        10: "0.625rem",
        12: "0.75rem",
        14: "0.875rem",
        16: "1rem",
        20: "1.25rem",
        24: "1.50rem",
        32: "2rem",
        36: "2.25rem",
        40: "2.5rem",
        48: "3rem",
        56: "3.5rem",
        60: "3.75rem",
        74: "4.625rem",
        130: "5rem",
        160: "10rem",
        220: "13.75rem",
        400: "25rem",
        500: "31.25rem",
      },
      lineHeights: {
        8: "0.5rem",
        12: "0.75rem",
        14: "0.875rem",
        16: "1rem",
        18: "1.1125rem",
        20: "1.25rem",
        22: "1.375rem",
        24: "1.50rem",
        28: "1.75rem",
        32: "2rem",
        36: "2.25rem",
        56: "3.5rem",
        72: "4.5rem",
        80: "5rem",
      },
      radii: {
        2: "0.125rem",
        4: "0.25rem",
        6: "0.375rem",
        8: "0.5rem",
        12: "0.75rem",
        16: "1rem",
        40: "2.5rem",
        80: "5rem",
        round: "50%",
        pill: "9999rem",
      },
    },
    media: {
      sm: "(max-width: 640px)",
      md: "(min-width: 768px)",
      lg: "(min-width: 1024px)",
      xl: "(min-width: 1280px)",
      motion: "(prefers-reduced-motion)",
      hover: "(any-hover: hover)",
    },
    utils: {
      p: (value: Stitches.PropertyValue<"padding">) => ({
        paddingTop: value,
        paddingBottom: value,
        paddingLeft: value,
        paddingRight: value,
      }),
      pt: (value: Stitches.PropertyValue<"padding">) => ({
        paddingTop: value,
      }),
      pr: (value: Stitches.PropertyValue<"padding">) => ({
        paddingRight: value,
      }),
      pb: (value: Stitches.PropertyValue<"padding">) => ({
        paddingBottom: value,
      }),
      pl: (value: Stitches.PropertyValue<"padding">) => ({
        paddingLeft: value,
      }),
      px: (value: Stitches.PropertyValue<"padding">) => ({
        paddingLeft: value,
        paddingRight: value,
      }),
      py: (value: Stitches.PropertyValue<"padding">) => ({
        paddingTop: value,
        paddingBottom: value,
      }),
      m: (value: Stitches.PropertyValue<"margin">) => ({
        marginTop: value,
        marginBottom: value,
        marginLeft: value,
        marginRight: value,
      }),
      mt: (value: Stitches.PropertyValue<"margin">) => ({
        marginTop: value,
      }),
      mr: (value: Stitches.PropertyValue<"margin">) => ({
        marginRight: value,
      }),
      mb: (value: Stitches.PropertyValue<"margin">) => ({
        marginBottom: value,
      }),
      ml: (value: Stitches.PropertyValue<"margin">) => ({
        marginLeft: value,
      }),
      mx: (value: Stitches.PropertyValue<"margin">) => ({
        marginLeft: value,
        marginRight: value,
      }),
      my: (value: Stitches.PropertyValue<"margin">) => ({
        marginTop: value,
        marginBottom: value,
      }),
      size: (value: Stitches.PropertyValue<"width">) => ({
        width: value,
        height: value,
      }),
      bc: (value: Stitches.PropertyValue<"backgroundColor">) => ({
        backgroundColor: value,
      }),
    },
  });

export type CSS = Stitches.CSS<typeof config>;
