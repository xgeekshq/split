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
import { NEXT_PUBLIC_MANUAL_LOGIN } from '@/utils/constants';
import Icon from '@/components/icons/Icon';

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

  const renderFooter = () => {
    if (NEXT_PUBLIC_MANUAL_LOGIN) {
      return currentTab === 'login' ? (
        <Text css={{ mb: '15%', textAlign: 'center', mt: '$10' }}>
          No account yet?{' '}
          <Text
            onClick={() => setCurrentTab('signUp')}
            css={{ color: '$highlight2Dark', '@hover': { '&:hover': { cursor: 'pointer' } } }}
          >
            Sign up.
          </Text>
        </Text>
      ) : (
        <Text css={{ mb: '15%', textAlign: 'center', mt: '$10' }}>
          Already have an account?{' '}
          <Text
            onClick={() => setCurrentTab('login')}
            css={{ color: '$highlight2Dark', '@hover': { '&:hover': { cursor: 'pointer' } } }}
          >
            Log in.
          </Text>
        </Text>
      );
    }
    return (
      <Text css={{ mb: '15%', textAlign: 'center', mt: '$10' }}>
        SPLIT - A product by <Icon css={{ width: '$66', height: '$14' }} name="xgeeks-logo" />
      </Text>
    );
  };

  return (
    <Flex justify="between" css={{ height: '100vh' }}>
      <Flex direction="column" css={{ flexGrow: '1', height: '100%' }}>
        <BannerContainer>
          <Banner />
        </BannerContainer>
        <Flex
          direction="column"
          css={{
            ml: '$72',
            mr: '$58',
            mt: '9.7%',
            height: '100%',
            justifyContent: 'space-between',
          }}
        >
          {!showTroubleLogin && currentTab === 'login' ? (
            <LoginForm setShowTroubleLogin={setShowTroubleLogin} />
          ) : (
            <SignUpTabContent setCurrentTab={setCurrentTab} />
          )}
          {showTroubleLogin && <TroubleLogin setShowTroubleLogin={setShowTroubleLogin} />}
          {renderFooter()}
        </Flex>
      </Flex>
      <Flex css={{ width: '65%', py: '$24', pr: '$24', flexShrink: 0, flexGrow: 1 }}>
        <ImageBackground />
      </Flex>
    </Flex>
  );
};

export default Home;
