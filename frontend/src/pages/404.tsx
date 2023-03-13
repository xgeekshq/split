import Link from 'next/link';

import { BannerContainer, ContainerSection, ImageBackground } from '@/styles/pages/error.styles';

import LogoIcon from '@/components/icons/Logo';
import Text from '@/components/Primitives/Text/Text';
import SecondaryBanner from '@/components/icons/SecondaryBanner';
import Button from '@/components/Primitives/Inputs/Button/Button';

export default function Custom404() {
  return (
    <ImageBackground>
      <BannerContainer>
        <SecondaryBanner />
      </BannerContainer>

      <ContainerSection>
        <LogoIcon />

        <Text css={{ mt: '$29' }} display="3">
          404
        </Text>

        <Text css={{ mt: '$10' }} heading="2" fontWeight="medium">
          Page Not Found
        </Text>
        <Text color="primary500" css={{ mt: '$24' }} size="md">
          The page you are looking for might have been removed or is temporarily unavailable
        </Text>
        <Link href="/">
          <Button css={{ mt: '$26' }} size="md">
            Go to Home
          </Button>
        </Link>
      </ContainerSection>
    </ImageBackground>
  );
}
