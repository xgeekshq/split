import { Suspense, useEffect } from 'react';
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import { useRouter } from 'next/router';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { useSetRecoilState } from 'recoil';

import { getAllUsers } from '@/api/userService';
import QueryError from '@/components/Errors/QueryError';
import requireAuthentication from '@/components/HOC/requireAuthentication';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Dots from '@/components/Primitives/Loading/Dots/Dots';
import LoadingPage from '@/components/Primitives/Loading/Page/Page';
import CreateTeam from '@/components/Teams/CreateTeam/CreateTeam';
import { USERS_KEY } from '@/constants/react-query/keys';
import { ROUTES } from '@/constants/routes';
import { TeamUserRoles } from '@/enums/teams/userRoles';
import useCurrentSession from '@/hooks/useCurrentSession';
import useUsers from '@/hooks/users/useUsers';
import { createTeamState } from '@/store/team.atom';
import { usersListState } from '@/store/user.atom';

const NewTeam: NextPage = () => {
  const { session, userId } = useCurrentSession({ required: true });
  const { replace } = useRouter();

  const {
    fetchAllUsers: { data: usersData, isLoading, isError },
    handleErrorOnFetchAllUsers,
  } = useUsers();

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

  if (isError) {
    handleErrorOnFetchAllUsers();
  }

  if (!session || !usersData) {
    replace(ROUTES.Teams);
    return null;
  }

  return (
    <Suspense fallback={<LoadingPage />}>
      <QueryError>
        {isLoading ? (
          <Flex css={{ mt: '$16' }} data-testid="loading" justify="center">
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

    await queryClient.prefetchQuery({ queryKey: [USERS_KEY], queryFn: () => getAllUsers(context) });

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
    };
  },
);

export default NewTeam;
