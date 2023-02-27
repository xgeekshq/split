import React, { ReactNode, useMemo } from 'react';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';

import Flex from '@/components/Primitives/Flex';
import LoadingPage from '@/components/Primitives/Loading/Page';
import Sidebar from '@/components/Sidebar';
import { BOARDS_ROUTE, DASHBOARD_ROUTE, TEAMS_ROUTE, USERS_ROUTE } from '@/utils/routes';
import { REFRESH_TOKEN_ERROR } from '@/utils/constants';
import MainPageHeader from './partials/MainPageHeader';
import { Container, ContentSection } from './styles';

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { data: session } = useSession({ required: false });

  const router = useRouter();

  if (session?.error === REFRESH_TOKEN_ERROR) {
    signOut({ callbackUrl: '/' });
  }

  const getMainPageHeader = useMemo(() => {
    if (!session) return null;

    switch (router.pathname) {
      case DASHBOARD_ROUTE:
        return (
          <MainPageHeader
            title={`Welcome, ${session.user.firstName}`}
            button={{
              link: '/boards/new',
              label: 'Add new board',
            }}
          />
        );
      case BOARDS_ROUTE:
        return (
          <MainPageHeader
            title="Boards"
            button={{
              link: '/boards/new',
              label: 'Add new board',
            }}
          />
        );
      case TEAMS_ROUTE:
        return (
          <MainPageHeader
            title="Teams"
            button={{
              link: '/teams/new',
              label: 'Create new team',
            }}
          />
        );
      case USERS_ROUTE:
        return <MainPageHeader title="Users" />;
      default:
        return null;
    }
  }, [session, router.pathname]);

  if (!session) return <LoadingPage />;

  return (
    <Container>
      <Sidebar
        email={session.user.email}
        firstName={session.user.firstName}
        lastName={session.user.lastName}
        strategy={session.strategy}
      />
      <ContentSection gap="36" justify="between">
        <Flex css={{ width: '100%' }} direction="column" gap="40">
          {getMainPageHeader}
          {children}
        </Flex>
      </ContentSection>
    </Container>
  );
};

export default Layout;
