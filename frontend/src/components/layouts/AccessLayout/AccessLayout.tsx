import React, { ReactNode } from 'react';

import Banner from '@/components/icons/Banner';
import {
  BannerContainer,
  BodyContainer,
  ImageBackground,
  ImageContainer,
} from '@/components/layouts/AccessLayout/styles';
import Flex from '@/components/Primitives/Layout/Flex/Flex';

type AccessLayoutProps = {
  children: ReactNode;
};

const AccessLayout = ({ children }: AccessLayoutProps) => (
  <Flex css={{ minHeight: '100vh', overflow: 'auto' }} justify="between">
    <BodyContainer direction="column">
      <BannerContainer>
        <Banner />
      </BannerContainer>
      <Flex css={{ height: '100%' }} direction="column" justify="between">
        {children}
      </Flex>
    </BodyContainer>
    <ImageContainer>
      <ImageBackground css={{ boxShadow: '-8px 8px 24px rgba(0, 0, 0, 0.16)' }} />
    </ImageContainer>
  </Flex>
);

export default AccessLayout;
