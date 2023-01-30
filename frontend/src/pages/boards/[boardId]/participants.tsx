import ParticipantsList from '@/components/Board/RegularBoard/ParticipantsList';
import RegularBoardHeader from '@/components/Board/RegularBoard/ReagularHeader';
import QueryError from '@/components/Errors/QueryError';
import Flex from '@/components/Primitives/Flex';
import { ContentSection } from '@/components/layouts/DashboardLayout/styles';
import LoadingPage from '@/components/loadings/LoadingPage';
import { useSession } from 'next-auth/react';
import React, { Suspense } from 'react';

const BoardParticipants = () => {
  const { data: session } = useSession({ required: true });
  if (!session) return null;
  return (
    <Suspense fallback={<LoadingPage />}>
      <QueryError>
        <ContentSection gap="36" justify="between">
          <Flex css={{ width: '100%' }} direction="column">
            <Flex justify="between">
              <RegularBoardHeader />
            </Flex>
            <ParticipantsList />
          </Flex>
        </ContentSection>
      </QueryError>
    </Suspense>
  );
};

export default BoardParticipants;
