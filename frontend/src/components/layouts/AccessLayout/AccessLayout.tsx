import React, { ReactNode } from 'react';

import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Banner from '@/components/icons/Banner';
import {
  BannerContainer,
  BodyContainer,
  FormContainer,
  ImageBackground,
  ImageContainer,
} from '@/components/layouts/AccessLayout/styles';

type AccessLayoutProps = {
  children: ReactNode;
};

const AccessLayout = ({ children }: AccessLayoutProps) => (
  <Flex justify="between" css={{ minHeight: '100vh', overflow: 'auto' }}>
    <BodyContainer direction="column">
      <BannerContainer>
        <Banner />
      </BannerContainer>
      <FormContainer direction="column">{children}</FormContainer>
    </BodyContainer>
    <ImageContainer>
      <ImageBackground css={{ boxShadow: '-8px 8px 24px rgba(0, 0, 0, 0.16)' }} />
    </ImageContainer>
  </Flex>
);

export default AccessLayout;
