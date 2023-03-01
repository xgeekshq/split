import React, { ReactElement, Suspense, useEffect } from 'react';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { getTeamRequest } from '@/api/teamService';
import { getAllUsers } from '@/api/userService';
import QueryError from '@/components/Errors/QueryError';
import LoadingPage from '@/components/Primitives/Loading/Page';
import Flex from '@/components/Primitives/Flex';
import TeamMembersList from '@/components/Teams/Team';
import { membersListState, usersListState } from '@/store/team/atom/team.atom';
import useTeam from '@/hooks/useTeam';
import Layout from '@/components/layouts/Layout';
import Dots from '@/components/Primitives/Loading/Dots';
import TeamHeader from '@/components/Teams/Team/partials/Header';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';
import useUser from '@/hooks/useUser';

const Team = () => {
  // Session Details
  const { data: session } = useSession({ required: true });

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

  useEffect(() => {
    if (teamData) setTeamUsers(teamData.users);
  }, [teamData, setTeamUsers]);

  useEffect(() => {
    if (!usersData || !teamData) return;

    const checkedUsersData = usersData.map((user) => {
      const userIsTeamMember = teamData.users.some(
        (teamMember) => teamMember.user?._id === user._id,
      );
      return { ...user, isChecked: userIsTeamMember };
    });

    setUsers(checkedUsersData);
  }, [teamData, setTeamUsers]);

  const { id: userId, isSAdmin } = { ...session?.user };

  const user = teamData?.users.find((member) => member.user?._id === userId);
  const hasPermissions =
    isSAdmin || [TeamUserRoles.ADMIN, TeamUserRoles.STAKEHOLDER].includes(user?.role!);

  if (!session || !teamData || !usersData) return null;

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
              <TeamMembersList users={teamUsers} userId={userId} isTeamMember={!hasPermissions} />
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
