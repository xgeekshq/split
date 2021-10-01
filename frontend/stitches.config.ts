import { createStitches } from "@stitches/react";
import type * as Stitches from "@stitches/react";
import { gray } from "@radix-ui/colors";

export const { styled, css, globalCss, keyframes, getCssText, theme, createTheme, config } =
  createStitches({
    theme: {
      colors: {
        ...gray,
      },
      fontSizes: {
        16: "1rem",
      },
      space: {
        40: "2.5rem",
      },
    },
    media: {
      sm: "(min-width: 640px)",
      md: "(min-width: 768px)",
      lg: "(min-width: 1024px)",
      xl: "(min-width: 1280px)",
    },
    utils: {
      p: (value: Stitches.PropertyValue<"paddingTop">) => ({
        paddingTop: value,
        paddingBottom: value,
        paddingLeft: value,
        paddingRight: value,
      }),
      pt: (value: Stitches.PropertyValue<"paddingTop">) => ({
        paddingTop: value,
      }),
      pr: (value: Stitches.PropertyValue<"paddingTop">) => ({
        paddingRight: value,
      }),
      pb: (value: Stitches.PropertyValue<"paddingTop">) => ({
        paddingBottom: value,
      }),
      pl: (value: Stitches.PropertyValue<"paddingTop">) => ({
        paddingLeft: value,
      }),
      px: (value: Stitches.PropertyValue<"paddingTop">) => ({
        paddingLeft: value,
        paddingRight: value,
      }),
      py: (value: Stitches.PropertyValue<"paddingTop">) => ({
        paddingTop: value,
        paddingBottom: value,
      }),
      m: (value: Stitches.PropertyValue<"marginTop">) => ({
        marginTop: value,
        marginBottom: value,
        marginLeft: value,
        marginRight: value,
      }),
      mt: (value: Stitches.PropertyValue<"marginTop">) => ({
        marginTop: value,
      }),
      mr: (value: Stitches.PropertyValue<"marginTop">) => ({
        marginRight: value,
      }),
      mb: (value: Stitches.PropertyValue<"marginTop">) => ({
        marginBottom: value,
      }),
      ml: (value: Stitches.PropertyValue<"marginTop">) => ({
        marginLeft: value,
      }),
      mx: (value: Stitches.PropertyValue<"marginTop">) => ({
        marginLeft: value,
        marginRight: value,
      }),
      my: (value: Stitches.PropertyValue<"marginTop">) => ({
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
