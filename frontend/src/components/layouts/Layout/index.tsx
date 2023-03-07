import React, { ReactNode } from 'react';
import { signOut, useSession } from 'next-auth/react';

import LoadingPage from '@/components/Primitives/Loading/Page';
import Sidebar from '@/components/Sidebar';
import { REFRESH_TOKEN_ERROR } from '@/utils/constants';
import { Container, ContentSection } from './styles';

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const { data: session } = useSession({ required: false });

  if (session?.error === REFRESH_TOKEN_ERROR) {
    signOut({ callbackUrl: '/' });
  }

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
        {children}
      </ContentSection>
    </Container>
  );
};

export default Layout;
