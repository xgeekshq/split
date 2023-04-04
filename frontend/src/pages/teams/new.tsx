import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import { useSetRecoilState } from 'recoil';
import { getAllUsers } from '@/api/userService';
import requireAuthentication from '@/components/HOC/requireAuthentication';
import CreateTeam from '@/components/Teams/CreateTeam/CreateTeam';
import { createTeamState, usersListState } from '@/store/team/atom/team.atom';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';
import QueryError from '@/components/Errors/QueryError';
import LoadingPage from '@/components/Primitives/Loading/Page/Page';
import { Suspense, useEffect } from 'react';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Dots from '@/components/Primitives/Loading/Dots/Dots';
import useCurrentSession from '@/hooks/useCurrentSession';
import useUsers from '@/hooks/users/useUsers';
import { USERS_KEY } from '@/utils/constants/reactQueryKeys';

const NewTeam: NextPage = () => {
  const { session, userId } = useCurrentSession({ required: true });

  const { data: usersData, isLoading } = useUsers();

  const setUsersListState = useSetRecoilState(usersListState);
  const setCreateTeamState = useSetRecoilState(createTeamState);

  useEffect(() => {
    if (!usersData) return;

    const currentUser = usersData.find((user) => user._id === userId);
    if (!currentUser) return;

    setCreateTeamState([
      {
        user: currentUser,
        role: TeamUserRoles.ADMIN,
        isNewJoiner: false,
        canBeResponsible: true,
      },
    ]);

    const usersWithChecked = usersData
      .map((user) => ({
        ...user,
        isChecked: user._id === userId,
      }))
      .sort((a, b) => Number(b.isChecked) - Number(a.isChecked));

    setUsersListState(usersWithChecked);
  }, [usersData, userId, setUsersListState, setCreateTeamState]);

  if (!session || !usersData) return null;

  return (
    <Suspense fallback={<LoadingPage />}>
      <QueryError>
        {isLoading ? (
          <Flex justify="center" css={{ mt: '$16' }}>
            <Dots />
          </Flex>
        ) : (
          <CreateTeam />
        )}
      </QueryError>
    </Suspense>
  );
};

export const getServerSideProps: GetServerSideProps = requireAuthentication(
  async (context: GetServerSidePropsContext) => {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery([USERS_KEY], () => getAllUsers(context));

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
    };
  },
);

export default NewTeam;
