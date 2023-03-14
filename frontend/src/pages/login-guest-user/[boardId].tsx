import { NextPage } from 'next';

import Banner from '@/components/icons/Banner';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import { BannerContainer, ImageBackground } from '@/styles/pages/auth.styles';
import GuestUserForm from '@/components/auth/GuestUserForm';

const LoginGuestUser: NextPage = () => (
  <Flex justify="between" css={{ minHeight: '100vh', overflow: 'auto' }}>
    <Flex direction="column" css={{ flexGrow: '1' }}>
      <BannerContainer>
        <Banner />
      </BannerContainer>
      <Flex
        direction="column"
        css={{
          ml: '$72',
          mr: '$72',
          mt: '9.7%',
          mb: '$24',
          height: '100%',
          justifyContent: 'space-between',
        }}
      >
        <GuestUserForm />
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

export default LoginGuestUser;
