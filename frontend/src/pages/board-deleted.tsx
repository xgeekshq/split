import Link from 'next/link';

import {
  BannerContainer,
  ContainerSection,
  GoBackButton,
  ImageBackground,
} from '@/styles/pages/error.styles';

import Banner from '@/components/icons/Banner';
import LogoIcon from '@/components/icons/Logo';
import Text from '@/components/Primitives/Text';

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
          <GoBackButton css={{ mt: '$26' }} size="md" style={{ width: '100%' }} variant="primary">
            Go to Dashboard
          </GoBackButton>
        </Link>
      </ContainerSection>
    </ImageBackground>
  );
}
