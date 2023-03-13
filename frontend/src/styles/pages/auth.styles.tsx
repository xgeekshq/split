import { styled } from '@/styles/stitches/stitches.config';

import Flex from '@/components/Primitives/Layout/Flex/Flex';

const CenteredContainer = styled('div', {
  position: 'absolute',
  top: '5%',
  right: '$150',

  maxWidth: '500px',
  height: 'fit-content',

  display: 'flex',
  flexDirection: 'column',

  backgroundColor: '#ffffff',
  borderRadius: '$12',
});
const ImageBackground = styled(Flex, {
  height: '100%',
  width: '100%',
  backgroundColor: '$black',
  backgroundImage: 'url(/images/background.svg)',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  borderRadius: '$72 0 $72',
});

const BannerContainer = styled(Flex, {
  ml: '$72',
  mt: '8.4%',
});

export { BannerContainer, CenteredContainer, ImageBackground };
