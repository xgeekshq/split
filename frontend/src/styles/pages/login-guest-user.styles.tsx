import { styled } from '@/styles/stitches/stitches.config';
import Flex from '@/components/Primitives/Layout/Flex/Flex';

const ImageBackground = styled(Flex, {
  background: 'url(/images/background.svg) no-repeat center center fixed',
  height: '100%',
  width: '100%',
  backgroundColor: '$black',
  backgroundSize: 'cover',
  overflow: 'hidden',
});
const BannerContainer = styled(Flex, {
  ml: '$72',
  mt: '$72',
});
export { BannerContainer, ImageBackground };
