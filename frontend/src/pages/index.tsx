import { useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';

import {
  BannerContainer,
  BodyContainer,
  FormContainer,
  ImageBackground,
  ImageContainer,
} from '@/styles/pages/auth.styles';

import TroubleLogin from '@/components/auth/ForgotPassword/TroubleLogin';
import LoginForm from '@/components/auth/LoginForm';
import SignUpTabContent from '@/components/auth/SignUp/SignUpTabContent';
import Banner from '@/components/icons/Banner';
import Text from '@/components/Primitives/Text/Text';
import { DASHBOARD_ROUTE } from '@/utils/routes';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import { NEXT_PUBLIC_LOGIN_SSO_ONLY } from '@/utils/constants';
import { styled } from '@/styles/stitches/stitches.config';

const StyledImage = styled('img', {});

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
        <Text css={{ mb: '5%', textAlign: 'center', mt: '$10' }}>
          No account yet?{' '}
          <Text
            onClick={handleTabState}
            css={{ color: '$highlight2Dark', '@hover': { '&:hover': { cursor: 'pointer' } } }}
          >
            Sign up.
          </Text>
        </Text>
      ) : (
        <Text css={{ mb: '5%', textAlign: 'center', mt: '$10' }}>
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
      <BodyContainer direction="column">
        <BannerContainer>
          <Banner />
        </BannerContainer>
        <FormContainer direction="column">
          {renderBody()}
          {renderFooter()}
        </FormContainer>
      </BodyContainer>
      <ImageContainer>
        <ImageBackground css={{ boxShadow: '-8px 8px 24px rgba(0, 0, 0, 0.16)' }} />
      </ImageContainer>
    </Flex>
  );
};

export default Home;
