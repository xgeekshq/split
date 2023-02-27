import { ReactElement, Suspense } from 'react';
import { useSession } from 'next-auth/react';

import QueryError from '@/components/Errors/QueryError';
import Layout from '@/components/layouts/Layout';
import LoadingPage from '@/components/Primitives/Loading/Page';
import Flex from '@/components/Primitives/Flex';
import UsersList from '@/components/Users/UsersList';
import requireAuthentication from '@/components/HOC/requireAuthentication';
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = requireAuthentication(async () => ({
  props: {},
}));

const Users = () => {
  const { data: session } = useSession({ required: true });

  if (!session) return null;

  return (
    <Flex direction="column">
      <Suspense fallback={<LoadingPage />}>
        <QueryError>
          <UsersList />
        </QueryError>
      </Suspense>
    </Flex>
  );
};

Users.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default Users;
