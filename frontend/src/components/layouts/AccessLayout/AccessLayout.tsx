import React, { ReactNode } from 'react';

import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Banner from '@/components/icons/Banner';
import { ImageBackground } from './styles';

type AccessLayoutProps = {
  children: ReactNode;
};

const AccessLayout = ({ children }: AccessLayoutProps) => (
  <Flex justify="between" css={{ minHeight: '100vh', overflow: 'auto' }}>
    <Flex direction="column" css={{ flexGrow: '1', px: '$72', pb: '$24' }}>
      <Flex css={{ pt: '8.4%' }}>
        <Banner />
      </Flex>
      <Flex direction="column" justify="between" css={{ height: '100%', mt: '$50' }}>
        {children}
      </Flex>
    </Flex>
    <Flex
      css={{
        width: '65%',
        py: '$24',
        pr: '$24',
        flexShrink: 0,
      }}
    >
      <ImageBackground css={{ boxShadow: '-8px 8px 24px rgba(0, 0, 0, 0.16)' }} />
    </Flex>
  </Flex>
);

export default AccessLayout;
