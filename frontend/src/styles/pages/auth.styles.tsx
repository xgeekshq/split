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

const BodyContainer = styled(Flex, {
  width: '100%',
  margin: '$48',

  '@md': {
    margin: '$48 $72 $24',
    width: '$400',
  },
});

const FormContainer = styled(Flex, {
  height: '100%',
  justifyContent: 'space-between',
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

export {
  BannerContainer,
  CenteredContainer,
  BodyContainer,
  FormContainer,
  ImageContainer,
  ImageBackground,
};
