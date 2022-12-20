import { ReactElement, Suspense } from 'react';
import { useSession } from 'next-auth/react';

import QueryError from '@/components/Errors/QueryError';
import Layout from '@/components/layouts/Layout';
import LoadingPage from '@/components/loadings/LoadingPage';
import Flex from '@/components/Primitives/Flex';
import UsersEdit from '@/components/Users/UserEdit';
import { ContentSection } from '@/components/layouts/DashboardLayout/styles';
import UserHeader from '@/components/Users/UserEdit/partials/UserHeader';

import { useRouter } from 'next/router';

const UserDetails = () => {
  const { data: session } = useSession({ required: true });

  const router = useRouter();
  const { userId } = router.query;

  if (!session) return null;

  return (
    <Flex direction="column">
      <Suspense fallback={<LoadingPage />}>
        <QueryError>
          <ContentSection gap="36" justify="between">
            <Flex css={{ width: '100%' }} direction="column">
              <Flex justify="between">
                <UserHeader title="Nuno Caseiro" />
              </Flex>
              <UsersEdit userId={userId?.toString()} />
            </Flex>
          </ContentSection>
        </QueryError>
      </Suspense>
    </Flex>
  );
};

UserDetails.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default UserDetails;
