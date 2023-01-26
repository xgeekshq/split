import Link from 'next/link';

import { BannerContainer, ContainerSection, ImageBackground } from '@/styles/pages/error.styles';

import LogoIcon from '@/components/icons/Logo';
import Text from '@/components/Primitives/Text';
import SecondaryBanner from '@/components/icons/SecondaryBanner';
import Button from '@/components/Primitives/Button';

const Custom500 = () => (
  <ImageBackground>
    <BannerContainer>
      <SecondaryBanner />
    </BannerContainer>

    <ContainerSection>
      <LogoIcon />

      <Text css={{ mt: '$29', fontSize: '$48' }} heading="1" size="xl">
        500
      </Text>

      <Text css={{ mt: '$10' }} heading="2" weight="medium">
        Server Error
      </Text>
      <Text color="primary500" css={{ mt: '$24' }} size="md">
        Try to refresh this page or feel free to contact us if the problem persists.
      </Text>
      <Link href="/">
        <Button css={{ mt: '$26' }} size="md">
          Go to Home
        </Button>
      </Link>
    </ContainerSection>
  </ImageBackground>
);
export default Custom500;
