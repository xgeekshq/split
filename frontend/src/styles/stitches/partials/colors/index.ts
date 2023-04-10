import { dangerColors } from '@/styles/stitches/partials/colors/danger.colors';
import { highlight1Colors } from '@/styles/stitches/partials/colors/highlight1.colors';
import { highlight2Colors } from '@/styles/stitches/partials/colors/highlight2.colors';
import { highlight3Colors } from '@/styles/stitches/partials/colors/highlight3.colors';
import { highlight4Colors } from '@/styles/stitches/partials/colors/highlight4.colors';
import { infoColors } from '@/styles/stitches/partials/colors/info.colors';
import { primaryColors } from '@/styles/stitches/partials/colors/primary.colors';
import { secondaryColors } from '@/styles/stitches/partials/colors/secondary.colors';
import { successColors } from '@/styles/stitches/partials/colors/success.colors';
import { warningColors } from '@/styles/stitches/partials/colors/warning.colors';

const colors = {
  background: '#F4F7F8',
  surface: '#FFFFFF',
  transparent: '#FFFFFF 0%',
  black: '#000000',
  white: '#FFFFFF',

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
};

export { colors };
