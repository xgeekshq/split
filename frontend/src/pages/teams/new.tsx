import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import { useSession } from 'next-auth/react';
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
import Flex from '@/components/Primitives/Layout/Flex';
import Dots from '@/components/Primitives/Loading/Dots/Dots';

const NewTeam: NextPage = () => {
  const { data: session } = useSession({ required: true });

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
      if (user._id === session?.user.id) {
        listMembers.push({
          user,
          role: TeamUserRoles.ADMIN,
          isNewJoiner: false,
        });
      }
    });

    const usersWithChecked = usersData
      .map((user) => ({
        ...user,
        isChecked: user._id === session?.user.id,
      }))
      .sort((a, b) => Number(b.isChecked) - Number(a.isChecked));

    setUsersListState(usersWithChecked);
    setMembersListState(listMembers);
  }, [usersData, session?.user.id, setMembersListState, setUsersListState]);

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
    try {
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
        dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      },
    };
  },
);
