import { ReactElement, useState } from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

import TroubleLogin from '@/components/auth/ForgotPassword/TroubleLogin';
import LoginForm from '@/components/auth/LoginForm';
import SignUpTabContent from '@/components/auth/SignUp/SignUpTabContent';
import Text from '@/components/Primitives/Text/Text';
import { DASHBOARD_ROUTE } from '@/utils/routes';
import { NEXT_PUBLIC_LOGIN_SSO_ONLY } from '@/utils/constants';
import { styled } from '@/styles/stitches/stitches.config';
import AccessLayout from '@/components/layouts/AccessLayout/AccessLayout';
import Flex from '@/components/Primitives/Layout/Flex/Flex';

const StyledImage = styled('img', {});

const Home = () => {
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
        <Text css={{ textAlign: 'center' }}>
          No account yet?{' '}
          <Text link onClick={handleTabState} css={{ color: '$highlight2Dark' }}>
            Sign up.
          </Text>
        </Text>
      ) : (
        <Text css={{ textAlign: 'center' }}>
          Already have an account?{' '}
          <Text link onClick={handleTabState} css={{ color: '$highlight2Dark' }}>
            Log in.
          </Text>
        </Text>
      );
    }
    return (
      <Flex justify="center" align="center">
        SPLIT - A product by{' '}
        <StyledImage
          alt="xgeeks_logo"
          src="/xgeeks_logo.svg"
          width={66}
          height={13}
          css={{ ml: '$8', mt: '$6' }}
        />
      </Flex>
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
    <>
      {renderBody()}
      {renderFooter()}
    </>
  );
};

Home.getLayout = (page: ReactElement) => <AccessLayout>{page}</AccessLayout>;

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

export default Home;
