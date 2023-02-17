import React, { Suspense, useCallback, useEffect } from 'react';
import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import { useSetRecoilState } from 'recoil';

import { getTeamRequest } from '@/api/teamService';
import { getAllUsers } from '@/api/userService';
import QueryError from '@/components/Errors/QueryError';
import { ContentSection } from '@/components/layouts/DashboardLayout/styles';
import { ContainerTeamPage } from '@/components/layouts/Layout/styles';
import LoadingPage from '@/components/Primitives/Loading/Page';
import Flex from '@/components/Primitives/Flex';
import { Sidebar } from '@/components/Sidebar';
import TeamHeader from '@/components/Teams/Team/Header';
import TeamMembersList from '@/components/Teams/Team/ListCardMembers';
import { membersListState, usersListState } from '@/store/team/atom/team.atom';
import { UserList } from '@/types/team/userList';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import { toastState } from '@/store/toast/atom/toast.atom';
import useTeam from '@/hooks/useTeam';
import { useRouter } from 'next/router';

const Team = () => {
  // Session Details
  const { data: session } = useSession({ required: true });
  // const userId = session?.user?.id;
  const setToastState = useSetRecoilState(toastState);
  const router = useRouter();

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

  const handleMembersList = useCallback(() => {
    if (!data || !usersData) return;

    const checkboxUsersList = usersData
      .map((user): UserList => {
        const userIsTeamMember = data.users.some((teamMember) => teamMember.user?._id === user._id);
        return { ...user, isChecked: userIsTeamMember };
      })
      .sort((a, b) => Number(b.isChecked) - Number(a.isChecked));

    setMembersListState(data.users);
    setUsersListState(checkboxUsersList);
  }, [data, setMembersListState, setUsersListState, usersData]);

  useEffect(() => {
    handleMembersList();
  }, [data, setMembersListState, setUsersListState, usersData, router, handleMembersList]);

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
              <TeamMembersList handleMembersList={handleMembersList} />
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
    await queryClient.prefetchQuery(['users'], () => getAllUsers(context));
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
