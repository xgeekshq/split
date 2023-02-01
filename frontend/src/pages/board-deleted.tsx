import Link from 'next/link';

import { BannerContainer, ContainerSection, ImageBackground } from '@/styles/pages/error.styles';

import Banner from '@/components/icons/Banner';
import LogoIcon from '@/components/icons/Logo';
import Text from '@/components/Primitives/Text';
import Button from '@/components/Primitives/Button';

export default function Custom404() {
  return (
    <ImageBackground>
      <BannerContainer>
        <Banner />
      </BannerContainer>

      <ContainerSection>
        <LogoIcon />

        <Text css={{ mt: '$29' }} display="3">
          404
        </Text>

        <Text css={{ mt: '$10' }} heading="2" fontWeight="medium">
          Board deleted
        </Text>
        <Text color="primary500" css={{ mt: '$24' }} size="md">
          The board was deleted by a board admin
        </Text>
        <Link href="/dashboard">
          <Button css={{ mt: '$26' }} size="md">
            Go to Dashboard
          </Button>
        </Link>
      </ContainerSection>
    </ImageBackground>
  );
}
