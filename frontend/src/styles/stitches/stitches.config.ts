import type * as Stitches from '@stitches/react';
import { createStitches } from '@stitches/react';

import { borderRadius } from '@/styles/stitches/partials/borderRadius';
import { colors } from '@/styles/stitches/partials/colors';
import { fontsSettings } from '@/styles/stitches/partials/fonts';
import { mediaQueries } from '@/styles/stitches/partials/mediaQueries';
import { sizes } from '@/styles/stitches/partials/sizes';
import { spaces } from '@/styles/stitches/partials/spaces';
import { utils } from '@/styles/stitches/partials/utils';

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
