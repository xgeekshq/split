import { Suspense, useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { joiResolver } from '@hookform/resolvers/joi';
import BoardName from '@/components/CreateBoard/BoardName';
import SettingsTabs from '@/components/CreateBoard/SplitBoard/SettingsTabs';
import TipBar from '@/components/CreateBoard/TipBar';
import Icon from '@/components/icons/Icon';
import AlertBox from '@/components/Primitives/AlertBox';
import Button from '@/components/Primitives/Button';
import Text from '@/components/Primitives/Text';
import useBoard from '@/hooks/useBoard';
import SchemaCreateBoard from '@/schema/schemaCreateBoardForm';
import {
  createBoardDataState,
  createBoardError,
  createBoardTeam,
} from '@/store/createBoard/atoms/create-board.atom';
import { toastState } from '@/store/toast/atom/toast.atom';
import { CreateBoardDto } from '@/types/board/board';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import useTeam from '@/hooks/useTeam';
import { teamsOfUser } from '@/store/team/atom/team.atom';
import QueryError from '@/components/Errors/QueryError';
import LoadingPage from '@/components/loadings/LoadingPage';
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import {
  Container,
  PageHeader,
  ContentContainer,
  SubContainer,
  InnerContent,
  StyledForm,
  ButtonsContainer,
} from '@/styles/pages/boards/newSplitBoard.styles';
import requireAuthentication from '@/components/HOC/requireAuthentication';
import { getAllTeams, getTeamsOfUser } from '@/api/teamService';
import { dehydrate, QueryClient } from 'react-query';
import { DASHBOARD_ROUTE } from '@/utils/routes';
import { BoardUserRoles } from '@/utils/enums/board.user.roles';
import isEmpty from '@/utils/isEmpty';

const defaultBoard = {
  users: [],
  team: null,
  count: {
    teamsCount: 2,
    maxUsersCount: 2,
  },
  board: {
    title: 'Main Board -',
    columns: [
      { title: 'Went well', color: '$highlight1Light', cards: [] },
      { title: 'To improve', color: '$highlight4Light', cards: [] },
      { title: 'Action points', color: '$highlight3Light', cards: [] },
    ],
    isPublic: false,
    maxVotes: undefined,
    dividedBoards: [],
    recurrent: true,
    users: [],
    team: null,
    isSubBoard: false,
    boardNumber: 0,
    hideCards: false,
    hideVotes: false,
    slackEnable: false,
    totalUsedVotes: 0,
  },
};

const NewSplitBoard: NextPage = () => {
  const router = useRouter();
  const routerTeam = router.query.team;
  const { data: session } = useSession({ required: true });

  const [isBackButtonDisable, setBackButtonState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Recoil Atoms and Hooks
   */
  const setToastState = useSetRecoilState(toastState);
  const [boardState, setBoardState] = useRecoilState(createBoardDataState);
  const [haveError, setHaveError] = useRecoilState(createBoardError);
  const setTeams = useSetRecoilState(teamsOfUser);
  const [selectedTeam, setSelectedTeam] = useRecoilState(createBoardTeam);
  const teams = useRecoilValue(teamsOfUser);

  /**
   * User Board Hook
   */
  const {
    createBoard: { status, mutate },
  } = useBoard({ autoFetchBoard: false });

  /**
   * Team  Hook
   */
  const {
    fetchTeamsOfUser: { data: teamsData },
  } = useTeam();

  const {
    fetchAllTeams: { data: allTeamsData },
  } = useTeam();

  /**
   * React Hook Form
   */
  const methods = useForm<{ text: string; team: string; maxVotes?: number; slackEnable?: boolean }>(
    {
      mode: 'onBlur',
      reValidateMode: 'onBlur',
      defaultValues: {
        text: '',
        maxVotes: boardState.board.maxVotes,
        slackEnable: false,
        team: undefined,
      },
      resolver: joiResolver(SchemaCreateBoard),
    },
  );

  const mainBoardName = useWatch({
    control: methods.control,
    name: 'text',
  });

  if (routerTeam && !selectedTeam) {
    const foundTeam = teams.find((team) => team._id === routerTeam);
    setSelectedTeam(foundTeam);
  }

  /**
   * Handle back to boards list page
   */
  const handleBack = useCallback(() => {
    setIsLoading(true);

    setBackButtonState(true);
    router.back();
  }, [router]);

  const handleCancelBtn = () => {
    setIsLoading(true);

    router.push(DASHBOARD_ROUTE);
  };
  /**
   * Save board
   * @param title Board Title
   * @param maxVotes Maxium number of votes allowed
   */
  const saveBoard = (title: string, team: string, maxVotes?: number, slackEnable?: boolean) => {
    const responsibles: string[] = [];
    const newDividedBoards: CreateBoardDto[] = boardState.board.dividedBoards.map((subBoard) => {
      const newSubBoard: CreateBoardDto = { ...subBoard, users: [], dividedBoards: [] };
      newSubBoard.hideCards = boardState.board.hideCards;
      newSubBoard.hideVotes = boardState.board.hideVotes;
      newSubBoard.maxVotes = maxVotes;

      newSubBoard.users = subBoard.users.map((boardUser) => ({
        user: boardUser.user._id,
        role: boardUser.role,
      }));

      const responsible = newSubBoard.users.find(
        (user) => user.role === BoardUserRoles.RESPONSIBLE,
      );
      if (!isEmpty(responsible)) {
        responsibles.push(responsible.user);
      }

      return newSubBoard;
    });

    mutate({
      ...boardState.board,
      users: boardState.users,
      title,
      dividedBoards: newDividedBoards,
      maxVotes,
      slackEnable,
      maxUsers: boardState.count.maxUsersCount,
      team,
      responsibles,
    });
  };

  useEffect(() => {
    if (teamsData && allTeamsData && session) {
      setTeams(session?.user.isSAdmin ? allTeamsData : teamsData);
    }

    if (status === 'success') {
      setIsLoading(true);
      setToastState({
        open: true,
        content: 'Board created with success!',
        type: ToastStateEnum.SUCCESS,
      });

      setBoardState(defaultBoard);
      setSelectedTeam(undefined);
      router.push('/boards');
    }

    return () => {
      setBoardState(defaultBoard);
      setSelectedTeam(undefined);
      setHaveError(false);
    };
  }, [
    status,
    router,
    setToastState,
    session,
    teamsData,
    setTeams,
    allTeamsData,
    setSelectedTeam,
    setBoardState,
    setHaveError,
  ]);

  if (!session || !teamsData || !allTeamsData) return null;

  return (
    <Suspense fallback={<LoadingPage />}>
      <QueryError>
        <Container style={isLoading ? { opacity: 0.5 } : undefined}>
          <PageHeader>
            <Text color="primary800" heading={3} weight="bold">
              Add new SPLIT board
            </Text>

            <Button isIcon disabled={isBackButtonDisable} onClick={handleBack}>
              <Icon name="close" />
            </Button>
          </PageHeader>
          <ContentContainer>
            <SubContainer>
              {haveError && (
                <AlertBox
                  text="In order to create a SPLIT retrospective, you need to have a team with an amount of people big enough to be splitted into smaller sub-teams. Also you need to be team-admin to create SPLIT retrospectives."
                  title="No team yet!"
                  type="error"
                  css={{
                    marginTop: '$20',
                  }}
                />
              )}

              <StyledForm
                direction="column"
                onSubmit={
                  !haveError
                    ? methods.handleSubmit(({ text, team, maxVotes, slackEnable }) => {
                        saveBoard(text, team, maxVotes, slackEnable);
                      })
                    : undefined
                }
              >
                <InnerContent direction="column">
                  <FormProvider {...methods}>
                    <BoardName mainBoardName={mainBoardName} />
                    <SettingsTabs />
                  </FormProvider>
                </InnerContent>
                <ButtonsContainer gap="24" justify="end">
                  <Button
                    disabled={isBackButtonDisable}
                    type="button"
                    variant="lightOutline"
                    onClick={handleCancelBtn}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isBackButtonDisable}>
                    Create board
                  </Button>
                </ButtonsContainer>
              </StyledForm>
            </SubContainer>
            <TipBar isSplitBoard />
          </ContentContainer>
        </Container>
      </QueryError>
    </Suspense>
  );
};

export const getServerSideProps: GetServerSideProps = requireAuthentication(
  async (context: GetServerSidePropsContext) => {
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery('teams', () => getTeamsOfUser(undefined, context));
    await queryClient.prefetchQuery('allTeams', () => getAllTeams(context));

    return {
      props: {
        dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      },
    };
  },
);

export default NewSplitBoard;
