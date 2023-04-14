import React, { ReactElement, Suspense, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { useSetRecoilState } from 'recoil';

import { getTeam } from '@/api/teamService';
import { getAllUsers } from '@/api/userService';
import QueryError from '@/components/Errors/QueryError';
import Layout from '@/components/layouts/Layout/Layout';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Dots from '@/components/Primitives/Loading/Dots/Dots';
import LoadingPage from '@/components/Primitives/Loading/Page/Page';
import TeamHeader from '@/components/Teams/Team/Header/Header';
import TeamMembersList from '@/components/Teams/Team/TeamMembersList';
import useTeam from '@/hooks/teams/useTeam';
import useCurrentSession from '@/hooks/useCurrentSession';
import useUsers from '@/hooks/users/useUsers';
import { usersListState } from '@/store/team/atom/team.atom';
import { UserList } from '@/types/team/userList';
import { TEAMS_KEY, USERS_KEY } from '@/utils/constants/reactQueryKeys';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';
import { ROUTES } from '@/utils/routes';

const Team = () => {
  // Session Details
  const { userId, isSAdmin } = useCurrentSession();
  const {
    replace,
    query: { teamId },
  } = useRouter();

  // Recoil States
  const setUsers = useSetRecoilState(usersListState);

  // Hooks
  const { data: teamData, isLoading: isLoadingTeam } = useTeam(teamId as string);
  const { data: usersData, isLoading: isLoadingUsers } = useUsers();

  const userFound = teamData?.users.find((member) => member.user?._id === userId);
  const hasPermissions =
    isSAdmin || userFound !== undefined
      ? [TeamUserRoles.ADMIN, TeamUserRoles.STAKEHOLDER].includes(userFound!.role)
      : false;

  useEffect(() => {
    if (!usersData || !teamData) return;

    const checkedUsersData: UserList[] = usersData.map((user) => {
      const userIsTeamMember = teamData.users.some(
        (teamMember) => teamMember.user?._id === user._id,
      );
      return { ...user, isChecked: userIsTeamMember };
    });

    setUsers(checkedUsersData);
  }, [usersData, teamData, setUsers]);

  if (!teamData || !usersData) {
    replace(ROUTES.Teams);
    return null;
  }

  return (
    <Flex css={{ width: '100%' }} direction="column" gap="40">
      <TeamHeader hasPermissions={hasPermissions} title={teamData.name} />
      <Flex
        css={{ height: '100%', position: 'relative', overflowY: 'auto', pr: '$8' }}
        direction="column"
      >
        <Suspense fallback={<LoadingPage />}>
          <QueryError>
            {isLoadingTeam || isLoadingUsers ? (
              <Flex css={{ mt: '$16' }} justify="center">
                <Dots />
              </Flex>
            ) : (
              <TeamMembersList
                isTeamPage
                hasPermissions={hasPermissions}
                teamUsers={teamData.users}
              />
            )}
          </QueryError>
        </Suspense>
      </Flex>
    </Flex>
  );
};

Team.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const teamId = String(context.query.teamId);

  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery([TEAMS_KEY, teamId], () => getTeam(teamId, context)),
    queryClient.prefetchQuery([USERS_KEY], () => getAllUsers(context)),
  ]);

  return {
    props: {
      key: teamId,
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default Team;
