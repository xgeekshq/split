import { createStitches } from "@stitches/react";
import type * as Stitches from "@stitches/react";
import { gray, violet, mauve, slate, blue, blackA, slateA, red, green } from "@radix-ui/colors";

export const { styled, css, globalCss, keyframes, getCssText, theme, createTheme, config } =
  createStitches({
    theme: {
      colors: {
        ...gray,
        ...green,
        ...violet,
        ...mauve,
        ...slate,
        ...slateA,
        ...blue,
        ...blackA,
        ...red,
        ...violet,

        hiContrast: "$slate12",
        loContrast: "white",
        body: "white",
      },
      fontSizes: {
        8: "0.35rem",
        10: "0.50rem",
        12: "0.75rem",
        14: "0.875rem",
        16: "1rem",
        18: "1.125rem",
        20: "1.25rem",
        36: "2rem",
      },
      fontWeights: {
        normal: "400",
        medium: "500",
        semiBold: "600",
        bold: "700",
        extrabold: "800",
      },
      space: {
        2: "0.125rem",
        4: "0.250rem",
        6: "0.375rem",
        8: "0.5rem",
        10: "0.625rem",
        12: "0.750rem",
        16: "1rem",
        18: "1.125rem",
        20: "1.25rem",
        24: "1.5rem",
        26: "1.625rem",
        40: "2.5rem",
        50: "3.125rem",
      },
      sizes: {
        2: "0.125rem",
        4: "0.25rem",
        6: "0.375rem",
        8: "0.5rem",
        10: "0.625rem",
        16: "1rem",
        20: "1.25rem",
        24: "1.50rem",
        32: "2rem",
        40: "2.5rem",
        130: "5rem",
        160: "10rem",
        220: "13.75rem",
        400: "25rem",
      },
      lineHeights: {
        8: "0.5rem",
        20: "1.25rem",
        24: "1.50rem",
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
