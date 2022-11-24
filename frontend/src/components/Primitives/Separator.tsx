import * as SeparatorPrimitive from '@radix-ui/react-separator';

import { styled } from '@/styles/stitches/stitches.config';

const StyledSeparator = styled(SeparatorPrimitive.Root, {
  backgroundColor: '$primary100',
  '&[data-orientation=horizontal]': { height: 1, width: '100%' },
  '&[data-orientation=vertical]': { height: '100%', width: 1 },
});

const Separator = StyledSeparator;

export default Separator;
