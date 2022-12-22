import { ReactElement, Suspense, useEffect } from 'react';
import { useSession } from 'next-auth/react';

import QueryError from '@/components/Errors/QueryError';
import Layout from '@/components/layouts/Layout';
import LoadingPage from '@/components/loadings/LoadingPage';
import Flex from '@/components/Primitives/Flex';
import UsersEdit from '@/components/Users/UserEdit';
import { ContentSection } from '@/components/layouts/DashboardLayout/styles';
import UserHeader from '@/components/Users/UserEdit/partials/UserHeader';

import { useRouter } from 'next/router';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import requireAuthentication from '@/components/HOC/requireAuthentication';
import { dehydrate, QueryClient, useQuery } from 'react-query';
import { getTeamsOfUser } from '@/api/teamService';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import { useSetRecoilState } from 'recoil';
import { toastState } from '@/store/toast/atom/toast.atom';
import { teamsListState } from '@/store/team/atom/team.atom';

const UserDetails = () => {
  const { data: session } = useSession({ required: true });

  const router = useRouter();
  const { userId, firstName, lastName } = router.query;

  const setToastState = useSetRecoilState(toastState);

  // Recoil States
  const setTeamsListState = useSetRecoilState(teamsListState);

  const { data, isFetching } = useQuery(['teams'], () => getTeamsOfUser(), {
    enabled: false,
    refetchOnWindowFocus: false,
    onError: () => {
      setToastState({
        open: true,
        content: 'Error getting the teams',
        type: ToastStateEnum.ERROR,
      });
    },
  });

  useEffect(() => {
    if (!data) {
      return;
    }

    setTeamsListState(data);
  }, [data, setTeamsListState]);

  if (!session || !data) return null;

  return (
    <Flex direction="column">
      <Suspense fallback={<LoadingPage />}>
        <QueryError>
          <ContentSection gap="36" justify="between">
            <Flex css={{ width: '100%' }} direction="column">
              <Flex justify="between">
                <UserHeader firstName={firstName} lastName={lastName} />
              </Flex>
              {data && <UsersEdit userId={userId?.toString()} isLoading={isFetching} />}
            </Flex>
          </ContentSection>
        </QueryError>
      </Suspense>
    </Flex>
  );
};

UserDetails.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export const getServerSideProps: GetServerSideProps = requireAuthentication(
  async (context: GetServerSidePropsContext) => {
    const userId = context.query.userId?.toString();

    const queryClient = new QueryClient();
    await queryClient.prefetchQuery('teams', () => getTeamsOfUser(context, userId));

    return {
      props: {
        dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      },
    };
  },
);

export default UserDetails;
