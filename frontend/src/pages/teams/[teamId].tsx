import React, { Suspense, useEffect } from 'react';
import { dehydrate, QueryClient, useQuery } from 'react-query';
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
import { TeamUser } from '@/types/team/team.user';
import { UserList } from '@/types/team/userList';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import { toastState } from '@/store/toast/atom/toast.atom';
import { User } from '@/types/user/user';

const Team = () => {
  // Session Details
  const { data: session } = useSession({ required: true });
  // const userId = session?.user?.id;
  const setToastState = useSetRecoilState(toastState);

  // // Hooks
  const {
    fetchTeam: { data },
  } = useTeam({ autoFetchTeam: true });

  const usersData = useQuery(['users'], () => getAllUsers(), {
    enabled: true,
    refetchOnWindowFocus: false,
    onError: () => {
      setToastState({
        open: true,
        content: 'Error getting the users',
        type: ToastStateEnum.ERROR,
      });
    },
  }).data;


  // Recoil States
  const setMembersListState = useSetRecoilState(membersListState);
  const setUsersListState = useSetRecoilState(usersListState);

  useEffect(() => {
    if (!data || !usersData) {
      return;
    }
    const teamMemberList: UserList[] = data.users.map((teamUser: TeamUser) => ({
      ...teamUser.user,
      isChecked: true,
    }));

    const allUsersList: UserList[] = usersData.map((user: User) => ({
      ...user,
      isChecked: true,
    }));

    const checkboxUsersList = allUsersList.map((user: UserList) => {
      const userIsTeamMember = teamMemberList
        .map((teamMember: UserList) => teamMember._id === user._id)
        .includes(true);
      return userIsTeamMember ? user : { ...user, isChecked: false };
    });

    setMembersListState(data.users);
    setUsersListState(checkboxUsersList);
  }, [data, session?.user.id, setMembersListState, setUsersListState, usersData]);

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

  if (teamId.includes('.map'))
    return {
      props: {},
    };

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
