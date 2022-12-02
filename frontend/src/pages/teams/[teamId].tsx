import React, { Suspense, useEffect } from 'react';
import { dehydrate, QueryClient } from 'react-query';
import { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import { useSetRecoilState } from 'recoil';

import { getTeamRequest } from '@/api/teamService';
import { getAllUsers } from '@/api/userService';
import QueryError from '@/components/Errors/QueryError';
import { ContentSection } from '@/components/layouts/DashboardLayout/styles';
import { ContainerTeamPage } from '@/components/layouts/Layout/styles';
import LoadingPage from '@/components/loadings/LoadingPage';
import Flex from '@/components/Primitives/Flex';
import { Sidebar } from '@/components/Sidebar';
import TeamHeader from '@/components/Teams/Team/Header';
import TeamMembersList from '@/components/Teams/Team/ListCardMembers';
import useTeam from '@/hooks/useTeam';
import { membersListState, usersListState } from '@/store/team/atom/team.atom';

const Team = () => {
  // Session Details
  const { data: session } = useSession({ required: true });
  // const userId = session?.user?.id;

  // // Hooks
  const {
    fetchTeam: { data },
  } = useTeam({ autoFetchTeam: false });

  // Recoil States
  const setUsersListState = useSetRecoilState(usersListState);
  const setMembersListState = useSetRecoilState(membersListState);

  useEffect(() => {
    if (!data) {
      return;
    }

    setMembersListState(data.users);
  }, [data, session?.user.id, setMembersListState, setUsersListState]);

  if (!session || !data) return null;
  return (
    <ContainerTeamPage>
      <Sidebar
        email={session.user.email}
        firstName={session.user.firstName}
        lastName={session.user.lastName}
        strategy={session.strategy}
      />
      <Suspense fallback={<LoadingPage />}>
        <QueryError>
          <ContentSection gap="36" justify="between">
            <Flex css={{ width: '100%' }} direction="column">
              <Flex justify="between">
                <TeamHeader title={data.name} />
              </Flex>
              <TeamMembersList />
            </Flex>
          </ContentSection>
        </QueryError>
      </Suspense>
    </ContainerTeamPage>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const teamId = String(context.query.teamId);

  const queryClient = new QueryClient();
  try {
    await queryClient.prefetchQuery(['team', teamId], () => getTeamRequest(teamId, context));
    await queryClient.prefetchQuery('users', () => getAllUsers(context));
  } catch (e) {
    return {
      redirect: {
        permanent: false,
        destination: '/teams',
      },
    };
  }
  return {
    props: {
      key: teamId,
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default Team;
