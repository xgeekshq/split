import type * as Stitches from '@stitches/react';
import { createStitches } from '@stitches/react';

import { borderRadius } from './partials/borderRadius';
import { colors } from './partials/colors';
import { fontsSettings } from './partials/fonts';
import { mediaQueries } from './partials/mediaQueries';
import { sizes } from './partials/sizes';
import { spaces } from './partials/spaces';
import { utils } from './partials/utils';

export const { styled, css, globalCss, keyframes, getCssText, theme, createTheme, config } =
  createStitches({
    theme: {
      colors,
      ...fontsSettings,
      space: spaces,
      sizes,
      radii: borderRadius,
    },
    media: mediaQueries,
    utils,
  });

export type CSS = Stitches.CSS<typeof config>;

export type CSSProps = { css?: Stitches.CSS<typeof config> };
