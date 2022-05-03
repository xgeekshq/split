import * as NextImage from "next/image";
import "@fontsource/dm-sans";
import { css, styled } from "../stitches.config";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
      fontSize: /fontSize$/,
    },
  },
};
