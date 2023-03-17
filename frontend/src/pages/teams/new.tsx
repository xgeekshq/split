import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import { useSetRecoilState } from 'recoil';
import { getAllUsers } from '@/api/userService';
import requireAuthentication from '@/components/HOC/requireAuthentication';
import CreateTeam from '@/components/Teams/CreateTeam/CreateTeam';
import { membersListState, usersListState } from '@/store/team/atom/team.atom';
import { TeamUser } from '@/types/team/team.user';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';
import QueryError from '@/components/Errors/QueryError';
import LoadingPage from '@/components/Primitives/Loading/Page/Page';
import { Suspense, useEffect } from 'react';
import useUser from '@/hooks/useUser';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Dots from '@/components/Primitives/Loading/Dots/Dots';
import useCurrentSession from '@/hooks/useCurrentSession';

const NewTeam: NextPage = () => {
  const { session, userId } = useCurrentSession({ required: true });

  const {
    fetchUsers: { data: usersData, isFetching },
  } = useUser();

  const setUsersListState = useSetRecoilState(usersListState);
  const setMembersListState = useSetRecoilState(membersListState);

  useEffect(() => {
    const listMembers: TeamUser[] | undefined = [];

    if (!usersData) {
      return;
    }

    usersData.forEach((user) => {
      if (user._id === userId) {
        listMembers.push({
          user,
          role: TeamUserRoles.ADMIN,
          isNewJoiner: false,
          canBeResponsible: true,
        });
      }
    });

    const usersWithChecked = usersData
      .map((user) => ({
        ...user,
        isChecked: user._id === userId,
      }))
      .sort((a, b) => Number(b.isChecked) - Number(a.isChecked));

    setUsersListState(usersWithChecked);
    setMembersListState(listMembers);
  }, [usersData, userId, setMembersListState, setUsersListState]);

  if (!session || !usersData) return null;

  return (
    <Suspense fallback={<LoadingPage />}>
      <QueryError>
        {isFetching ? (
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

export default NewTeam;

export const getServerSideProps: GetServerSideProps = requireAuthentication(
  async (context: GetServerSidePropsContext) => {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery(['users'], () => getAllUsers(context));

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
    };
  },
);
