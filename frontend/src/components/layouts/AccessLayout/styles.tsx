import Flex from '@/components/Primitives/Layout/Flex/Flex';
import { styled } from '@/styles/stitches/stitches.config';

const BodyContainer = styled(Flex, {
  width: '100%',
  margin: '$48',
  gap: '$72',

  '@md': {
    margin: '$48 $72 $24',
    width: '$362',
  },
});

const ImageContainer = styled(Flex, {
  flexGrow: 1,
  py: '$24',
  pr: '$24',
  flexShrink: 0,
  display: 'none',

  '@md': {
    display: 'flex',
  },
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
  '& svg': {
    maxWidth: '100%',
  },
});

export { BannerContainer, BodyContainer, ImageBackground, ImageContainer };
