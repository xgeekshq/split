import { useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';

import { BannerContainer, ImageBackground } from '@/styles/pages/auth.styles';

import TroubleLogin from '@/components/auth/ForgotPassword/TroubleLogin';
import LoginForm from '@/components/auth/LoginForm';
import SignUpTabContent from '@/components/auth/SignUp/SignUpTabContent';
import Banner from '@/components/icons/Banner';
import Text from '@/components/Primitives/Text';
import { DASHBOARD_ROUTE } from '@/utils/routes';
import Flex from '@/components/Primitives/Flex';
import { NEXT_PUBLIC_LOGIN_SSO_ONLY } from '@/utils/constants';
import StyledImage from '@/components/Primitives/Image';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  if (session) {
    return {
      redirect: {
        destination: DASHBOARD_ROUTE,
        permanent: false,
      },
    };
  }
  return { props: {} };
};

const Home: NextPage = () => {
  const [currentTab, setCurrentTab] = useState('login');
  const [showTroubleLogin, setShowTroubleLogin] = useState(false);

  const handleTabState = () => {
    if (currentTab === 'login') {
      setCurrentTab('signUp');
    } else {
      setCurrentTab('login');
    }
    setShowTroubleLogin(false);
  };

  const renderFooter = () => {
    if (!NEXT_PUBLIC_LOGIN_SSO_ONLY) {
      return currentTab === 'login' ? (
        <Text css={{ mb: '15%', textAlign: 'center', mt: '$10' }}>
          No account yet?{' '}
          <Text
            onClick={handleTabState}
            css={{ color: '$highlight2Dark', '@hover': { '&:hover': { cursor: 'pointer' } } }}
          >
            Sign up.
          </Text>
        </Text>
      ) : (
        <Text css={{ mb: '15%', textAlign: 'center', mt: '$10' }}>
          Already have an account?{' '}
          <Text
            onClick={handleTabState}
            css={{ color: '$highlight2Dark', '@hover': { '&:hover': { cursor: 'pointer' } } }}
          >
            Log in.
          </Text>
        </Text>
      );
    }
    return (
      <Text
        css={{
          mb: '15%',
          textAlign: 'center',
          mt: '$10',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        SPLIT - A product by{' '}
        <StyledImage
          alt="xgeeks_logo"
          src="/xgeeks_logo.svg"
          width={66}
          height={13}
          css={{ ml: '$8', mt: '$4' }}
        />
      </Text>
    );
  };

  const renderBody = () => {
    if (!showTroubleLogin) {
      if (currentTab === 'login') {
        return <LoginForm setShowTroubleLogin={setShowTroubleLogin} />;
      }
      return <SignUpTabContent setCurrentTab={setCurrentTab} />;
    }
    return <TroubleLogin setShowTroubleLogin={setShowTroubleLogin} />;
  };

  return (
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
            height: '100%',
            justifyContent: 'space-between',
          }}
        >
          {renderBody()}
          {renderFooter()}
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
};

export default Home;
