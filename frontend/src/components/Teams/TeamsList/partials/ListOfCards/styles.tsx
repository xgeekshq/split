import { styled } from '@/styles/stitches/stitches.config';

import Text from '@/components/Primitives/Text';

const LastUpdatedText = styled(Text, {
  position: 'sticky',
  zIndex: '5',
  top: '-0.2px',
  height: '$24',
  backgroundColor: '$background',
});

export { LastUpdatedText };
