import React, { ReactNode } from 'react';
import { signOut, useSession } from 'next-auth/react';

import { Container, ContentSection } from '@/components/layouts/Layout/styles';
import LoadingPage from '@/components/Primitives/Loading/Page/Page';
import Sidebar from '@/components/Sidebar/Sidebar';
import { REFRESH_TOKEN_ERROR } from '@/constants';

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const { data: session } = useSession({ required: true });

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
