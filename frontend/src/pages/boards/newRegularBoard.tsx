import { Suspense, useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Icon from '@/components/icons/Icon';
import Button from '@/components/Primitives/Button';
import Text from '@/components/Primitives/Text';
import useTeam from '@/hooks/useTeam';
import QueryError from '@/components/Errors/QueryError';
import LoadingPage from '@/components/loadings/LoadingPage';
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import { Container, PageHeader } from '@/styles/pages/boards/newSplitBoard.styles';
import requireAuthentication from '@/components/HOC/requireAuthentication';
import { getAllTeams, getTeamsOfUser } from '@/api/teamService';
import { dehydrate, QueryClient } from 'react-query';
import { BoxRowContainer } from '@/components/CreateBoard/SelectBoardType/BoxRowContainer';
import Flex from '@/components/Primitives/Flex';
import { ContentSelectContainer } from '@/styles/pages/boards/newRegularBoard.styles';

const NewRegularBoard: NextPage = () => {
  const router = useRouter();
  const { data: session } = useSession({ required: true });

  const [isBackButtonDisable, setBackButtonState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Team  Hook
   */
  const {
    fetchTeamsOfUser: { data: teamsData },
  } = useTeam({ autoFetchTeam: false });

  const {
    fetchAllTeams: { data: allTeamsData },
  } = useTeam({ autoFetchTeam: false });

  /**
   * Handle back to boards list page
   */
  const handleBack = useCallback(() => {
    setIsLoading(true);

    setBackButtonState(true);
    router.back();
  }, [router]);

  if (!session || !teamsData || !allTeamsData) return null;

  return (
    <Suspense fallback={<LoadingPage />}>
      <QueryError>
        <Container style={isLoading ? { opacity: 0.5 } : undefined}>
          <PageHeader>
            <Text color="primary800" heading={3} weight="bold">
              Add new Regular board
            </Text>

            <Button isIcon disabled={isBackButtonDisable} onClick={handleBack}>
              <Icon name="close" />
            </Button>
          </PageHeader>
          <ContentSelectContainer>
            <Flex gap={16} direction="column">
              <BoxRowContainer
                iconName="blob-settings"
                title="Configure board"
                description="Select team or participants, configure your board and schedule a date and time."
                active
              />

              <BoxRowContainer
                iconName="blob-arrow-right"
                title="Quick create"
                description="Jump the settings and just create a board. All configurations can still be done within the board itself."
                active={false}
              />
            </Flex>
          </ContentSelectContainer>
        </Container>
      </QueryError>
    </Suspense>
  );
};

export const getServerSideProps: GetServerSideProps = requireAuthentication(
  async (context: GetServerSidePropsContext) => {
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery('teams', () => getTeamsOfUser(context));
    await queryClient.prefetchQuery('allTeams', () => getAllTeams(context));

    return {
      props: {
        dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      },
    };
  },
);

export default NewRegularBoard;
