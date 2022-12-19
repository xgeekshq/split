import { ReactElement, Suspense } from 'react';
import { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import MyBoards from '@/components/Boards/MyBoards';
import QueryError from '@/components/Errors/QueryError';
import requireAuthentication from '@/components/HOC/requireAuthentication';
import Layout from '@/components/layouts/Layout';
import LoadingPage from '@/components/loadings/LoadingPage';
import Flex from '@/components/Primitives/Flex';

const Boards = () => {
  const { data: session } = useSession({ required: true });

  if (!session) return null;
  return (
    <Flex direction="column">
      <Suspense fallback={<LoadingPage />}>
        <QueryError>
          <MyBoards isSuperAdmin={session.user.isSAdmin} userId={session.user.id} />
        </QueryError>
      </Suspense>
    </Flex>
  );
};

export default Boards;

Boards.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export const getServerSideProps: GetServerSideProps = requireAuthentication(async () => ({
  props: {},
}));
