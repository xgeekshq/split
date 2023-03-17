import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React, { ReactElement, Suspense, useEffect } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { getTeamRequest } from '@/api/teamService';
import { getAllUsers } from '@/api/userService';
import QueryError from '@/components/Errors/QueryError';
import Layout from '@/components/layouts/Layout/Layout';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Dots from '@/components/Primitives/Loading/Dots/Dots';
import LoadingPage from '@/components/Primitives/Loading/Page/Page';
import TeamHeader from '@/components/Teams/Team/Header/Header';
import TeamMembersList from '@/components/Teams/Team/TeamMembersList';
import useCurrentSession from '@/hooks/useCurrentSession';
import useTeam from '@/hooks/useTeam';
import useUser from '@/hooks/useUser';
import { membersListState, usersListState } from '@/store/team/atom/team.atom';
import { UserList } from '@/types/team/userList';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';
import { ROUTES } from '@/utils/routes';
import { dehydrate, QueryClient } from '@tanstack/react-query';

const Team = () => {
  // Session Details
  const { userId, isSAdmin } = useCurrentSession();
  const { replace } = useRouter();

  // Recoil States
  const [teamUsers, setTeamUsers] = useRecoilState(membersListState);
  const setUsers = useSetRecoilState(usersListState);

  // Hooks
  const {
    fetchTeam: { data: teamData, isFetching: fetchingTeams },
  } = useTeam({ autoFetchTeam: true });

  const {
    fetchUsers: { data: usersData, isFetching: fetchingUsers },
  } = useUser();

  const userFound = teamData?.users.find((member) => member.user?._id === userId);
  const hasPermissions =
    isSAdmin || [TeamUserRoles.ADMIN, TeamUserRoles.STAKEHOLDER].includes(userFound?.role!);

  useEffect(() => {
    if (teamData) setTeamUsers(teamData.users);
  }, [teamData, setTeamUsers]);

  useEffect(() => {
    if (!usersData || !teamData) return;

    const checkedUsersData: UserList[] = usersData.map((user) => {
      const userIsTeamMember = teamData.users.some(
        (teamMember) => teamMember.user?._id === user._id,
      );
      return { ...user, isChecked: userIsTeamMember };
    });

    setUsers(checkedUsersData);
  }, [usersData, setUsers, teamData]);

  if (!teamData || !usersData) {
    replace(ROUTES.Teams);
    return null;
  }

  return (
    <Flex css={{ width: '100%' }} direction="column" gap="40">
      <TeamHeader title={teamData.name} hasPermissions={hasPermissions} />
      <Flex
        css={{ height: '100%', position: 'relative', overflowY: 'auto', pr: '$8' }}
        direction="column"
      >
        <Suspense fallback={<LoadingPage />}>
          <QueryError>
            {fetchingTeams || fetchingUsers ? (
              <Flex justify="center" css={{ mt: '$16' }}>
                <Dots />
              </Flex>
            ) : (
              <TeamMembersList teamUsers={teamUsers} hasPermissions={hasPermissions} isTeamPage />
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
    queryClient.prefetchQuery(['team', teamId], () => getTeamRequest(teamId, context)),
    queryClient.prefetchQuery(['users'], () => getAllUsers(context)),
  ]);

  return {
    props: {
      key: teamId,
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
};

export default Team;
