import Link from 'next/link';

import {
  BannerContainer,
  ContainerSection,
  GoBackButton,
  ImageBackground,
} from '@/styles/pages/error.styles';

import LogoIcon from '@/components/icons/Logo';
import Text from '@/components/Primitives/Text';
import SecondaryBanner from '@/components/icons/SecondaryBanner';

const Custom500 = () => (
  <ImageBackground>
    <BannerContainer>
      <SecondaryBanner />
    </BannerContainer>

    <ContainerSection>
      <LogoIcon />

      <Text css={{ mt: '$29' }} display="3">
        500
      </Text>

      <Text css={{ mt: '$10' }} heading="2" fontWeight="medium">
        Server Error
      </Text>
      <Text color="primary500" css={{ mt: '$24' }} size="md">
        Try to refresh this page or feel free to contact us if the problem persists.
      </Text>
      <Link href="/">
        <GoBackButton css={{ mt: '$26' }} size="md" style={{ width: '100%' }} variant="primary">
          Go to Home
        </GoBackButton>
      </Link>
    </ContainerSection>
  </ImageBackground>
);
export default Custom500;
