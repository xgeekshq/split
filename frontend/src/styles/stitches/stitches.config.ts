import type * as Stitches from '@stitches/react';
import { createStitches } from '@stitches/react';

import { fontsSettings } from '@/styles/stitches/partials/fonts';
import { spaces } from '@/styles/stitches/partials/spaces';
import { borderRadius } from '@/styles/stitches/partials/borderRadius';
import { mediaQueries } from '@/styles/stitches/partials/mediaQueries';
import { utils } from '@/styles/stitches/partials/utils';
import { sizes } from '@/styles/stitches/partials/sizes';
import { colors } from '@/styles/stitches/partials/colors';

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
