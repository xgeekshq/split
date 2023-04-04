import { styled } from '@/styles/stitches/stitches.config';

import Flex from '@/components/Primitives/Layout/Flex/Flex';

const ImageBackground = styled(Flex, {
  height: '100%',
  width: '100%',
  backgroundColor: '$black',
  backgroundImage: 'url(/images/background.svg)',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  borderRadius: '$72 0 $72',
});

export { ImageBackground };
