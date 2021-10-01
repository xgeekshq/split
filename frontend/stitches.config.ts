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
      padding: (value: Stitches.PropertyValue<"paddingTop">) => ({
        paddingTop: value,
        paddingBottom: value,
        paddingLeft: value,
        paddingRight: value,
      }),
      paddingTop: (value: Stitches.PropertyValue<"paddingTop">) => ({
        paddingTop: value,
      }),
      paddingRight: (value: Stitches.PropertyValue<"paddingTop">) => ({
        paddingRight: value,
      }),
      paddingBottom: (value: Stitches.PropertyValue<"paddingTop">) => ({
        paddingBottom: value,
      }),
      paddingLeft: (value: Stitches.PropertyValue<"paddingTop">) => ({
        paddingLeft: value,
      }),
      paddingX: (value: Stitches.PropertyValue<"paddingTop">) => ({
        paddingLeft: value,
        paddingRight: value,
      }),
      paddingY: (value: Stitches.PropertyValue<"paddingTop">) => ({
        paddingTop: value,
        paddingBottom: value,
      }),
      margin: (value: Stitches.PropertyValue<"marginTop">) => ({
        marginTop: value,
        marginBottom: value,
        marginLeft: value,
        marginRight: value,
      }),
      marginTop: (value: Stitches.PropertyValue<"marginTop">) => ({
        marginTop: value,
      }),
      marginRight: (value: Stitches.PropertyValue<"marginTop">) => ({
        marginRight: value,
      }),
      marginBottom: (value: Stitches.PropertyValue<"marginTop">) => ({
        marginBottom: value,
      }),
      marginLeft: (value: Stitches.PropertyValue<"marginTop">) => ({
        marginLeft: value,
      }),
      marginX: (value: Stitches.PropertyValue<"marginTop">) => ({
        marginLeft: value,
        marginRight: value,
      }),
      marginY: (value: Stitches.PropertyValue<"marginTop">) => ({
        marginTop: value,
        marginBottom: value,
      }),
      size: (value: Stitches.PropertyValue<"width">) => ({
        width: value,
        height: value,
      }),
      backgroundColor: (value: Stitches.PropertyValue<"backgroundColor">) => ({
        backgroundColor: value,
      }),
    },
  });
