import { Suspense, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Icon from '@/components/icons/Icon';
import Button from '@/components/Primitives/Button';
import Text from '@/components/Primitives/Text';
import useTeam from '@/hooks/useTeam';
import QueryError from '@/components/Errors/QueryError';
import LoadingPage from '@/components/loadings/LoadingPage';
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import {
  Container,
  ContentWrapper,
  ContentContainer,
  InnerContent,
  PageHeader,
  SubContainer,
  ButtonsContainer,
  StyledForm,
} from '@/styles/pages/boards/newSplitBoard.styles';
import requireAuthentication from '@/components/HOC/requireAuthentication';
import { getAllTeams, getTeamsOfUser } from '@/api/teamService';
import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query';
import { BoxRowContainer } from '@/components/CreateBoard/SelectBoardType/BoxRowContainer';
import Flex from '@/components/Primitives/Flex';
import { ContentSelectContainer } from '@/styles/pages/boards/newRegularBoard.styles';
import BoardName from '@/components/CreateBoard/BoardName';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import TipBar from '@/components/CreateBoard/TipBar';
import SettingsTabs from '@/components/CreateBoard/RegularBoard/SettingsTabs';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { toastState } from '@/store/toast/atom/toast.atom';
import { createBoardDataState, createBoardTeam } from '@/store/createBoard/atoms/create-board.atom';
import { teamsOfUser, usersListState } from '@/store/team/atom/team.atom';
import { DASHBOARD_ROUTE } from '@/utils/routes';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';
import SchemaCreateRegularBoard from '@/schema/schemaCreateRegularBoard';
import { getAllUsers } from '@/api/userService';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import useBoard from '@/hooks/useBoard';
import isEmpty from '@/utils/isEmpty';
import { BoardUserRoles } from '@/utils/enums/board.user.roles';
import { BoardUserDto } from '@/types/board/board.user';
import { defaultColumns } from '@/helper/board/defaultColumns';

const defaultBoard = {
  users: [],
  team: null,
  count: {
    teamsCount: 2,
    maxUsersCount: 2,
  },
  board: {
    title: 'Default Board',
    columns: defaultColumns,
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
    addCards: true,
  },
};

const NewRegularBoard: NextPage = () => {
  const router = useRouter();
  const { data: session } = useSession({ required: true });

  const [isBackButtonDisable, setBackButtonState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [createBoard, setCreateBoard] = useState(false);

  const setToastState = useSetRecoilState(toastState);
  const [boardState, setBoardState] = useRecoilState(createBoardDataState);
  const [usersList, setUsersList] = useRecoilState(usersListState);
  const setTeams = useSetRecoilState(teamsOfUser);
  const setSelectedTeam = useSetRecoilState(createBoardTeam);

  /**
   * Team  Hook
   */
  const {
    fetchTeamsOfUser: { data: teamsData },
  } = useTeam();

  const {
    fetchAllTeams: { data: allTeamsData },
  } = useTeam();

  const { data: allUsers } = useQuery(['users'], () => getAllUsers(), {
    enabled: true,
    refetchOnWindowFocus: false,
    onError: () => {
      setToastState({
        open: true,
        content: 'Error getting the users',
        type: ToastStateEnum.ERROR,
      });
    },
  });

  /**
   * Board  Hook
   */
  const {
    createBoard: { status, mutate },
  } = useBoard({ autoFetchBoard: false });

  const addNewRegularBoard = () => {
    setCreateBoard(true);
  };

  const methods = useForm<{ text?: string; maxVotes?: number; slackEnable?: boolean }>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      text: '',
      maxVotes: boardState.board.maxVotes,
      slackEnable: false,
    },
    resolver: joiResolver(SchemaCreateRegularBoard),
  });

  const mainBoardName = useWatch({
    control: methods.control,
    name: 'text',
  });

  const resetListUsersState = useCallback(() => {
    const updateCheckedUser = usersList.map((user) => ({
      ...user,
      isChecked: user._id === session?.user.id,
    }));
    setUsersList(updateCheckedUser);
  }, [session?.user.id, setUsersList, usersList]);

  /**
   * Handle back to boards list page
   */
  const handleBack = useCallback(() => {
    setIsLoading(true);

    resetListUsersState();

    setBackButtonState(true);
    router.back();
  }, [resetListUsersState, router]);

  const handleCancelBtn = () => {
    resetListUsersState();
    setIsLoading(true);

    router.push(DASHBOARD_ROUTE);
  };

  /**
   * Save board

   */
  const saveBoard = (title?: string, maxVotes?: number, slackEnable?: boolean) => {
    const users: BoardUserDto[] = [];
    const responsibles: string[] = [];

    const responsible = boardState.users.find((user) => user.role === BoardUserRoles.RESPONSIBLE);

    if (!isEmpty(responsible)) {
      responsibles.push(responsible.user);
    }

    if (isEmpty(boardState.users) && session) {
      users.push({ role: BoardUserRoles.RESPONSIBLE, user: session?.user.id });
    }

    mutate({
      ...boardState.board,
      users: isEmpty(boardState.users) ? users : boardState.users,
      title: title || defaultBoard.board.title,
      dividedBoards: [],
      maxVotes,
      slackEnable,
      maxUsers: boardState.count.maxUsersCount,
      recurrent: false,
      responsibles,
    });
  };

  const saveEmptyBoard = () => {
    const users: BoardUserDto[] = [];
    if (session) {
      users.push({ role: BoardUserRoles.RESPONSIBLE, user: session?.user.id });
    }

    mutate({
      ...boardState.board,
      users: isEmpty(boardState.users) ? users : boardState.users,
      title: defaultBoard.board.title,
      dividedBoards: [],
      maxUsers: boardState.count.maxUsersCount,
      recurrent: false,
    });
  };

  useEffect(() => {
    if (teamsData && allTeamsData && session && allUsers) {
      const availableTeams = teamsData.filter((team) =>
        team.users?.find(
          (teamUser) =>
            teamUser.user._id === session?.user.id &&
            [TeamUserRoles.ADMIN, TeamUserRoles.STAKEHOLDER].includes(teamUser.role),
        ),
      );

      setTeams(session?.user.isSAdmin ? allTeamsData : availableTeams);

      const usersWithChecked = allUsers.map((user) => ({
        ...user,
        isChecked: user._id === session?.user.id,
      }));

      setUsersList(usersWithChecked);
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
    };
  }, [
    router,
    setToastState,
    session,
    teamsData,
    setTeams,
    allTeamsData,
    setSelectedTeam,
    setBoardState,
    allUsers,
    setUsersList,
    status,
  ]);

  if (!session || !teamsData || !allTeamsData) return null;

  return (
    <Suspense fallback={<LoadingPage />}>
      <QueryError>
        <Container style={isLoading ? { opacity: 0.5 } : undefined}>
          <PageHeader>
            <Text color="primary800" heading={3} fontWeight="bold">
              Add new Regular board
            </Text>

            <Button isIcon size="lg" disabled={isBackButtonDisable} onClick={handleBack}>
              <Icon css={{ color: '$primaryBase' }} name="close" />
            </Button>
          </PageHeader>
          {createBoard ? (
            <>
              <ContentWrapper>
                <ContentContainer>
                  <SubContainer>
                    <StyledForm
                      id="hook-form"
                      direction="column"
                      onSubmit={methods.handleSubmit(({ text, maxVotes, slackEnable }) => {
                        saveBoard(text, maxVotes, slackEnable);
                      })}
                    >
                      <InnerContent direction="column">
                        <FormProvider {...methods}>
                          <BoardName mainBoardName={mainBoardName} />
                          <SettingsTabs />
                        </FormProvider>
                      </InnerContent>
                    </StyledForm>
                  </SubContainer>
                  <TipBar isRegularBoard />
                </ContentContainer>
              </ContentWrapper>
              <ButtonsContainer gap="24" justify="end">
                <Button
                  disabled={isBackButtonDisable}
                  type="button"
                  variant="lightOutline"
                  onClick={handleCancelBtn}
                >
                  Cancel
                </Button>
                <Button type="submit" form="hook-form" disabled={isBackButtonDisable}>
                  Create board
                </Button>
              </ButtonsContainer>
            </>
          ) : (
            <ContentSelectContainer>
              <Flex gap={16} direction="column">
                <BoxRowContainer
                  iconName="blob-arrow-right"
                  title="Quick create"
                  description="Jump the settings and just create a board. All configurations can still be done within the board itself."
                  handleSelect={saveEmptyBoard}
                  active
                />
                <BoxRowContainer
                  iconName="blob-settings"
                  title="Configure board"
                  description="Select team or participants, configure your board and schedule a date and time."
                  active
                  handleSelect={addNewRegularBoard}
                />
              </Flex>
            </ContentSelectContainer>
          )}
        </Container>
      </QueryError>
    </Suspense>
  );
};

export const getServerSideProps: GetServerSideProps = requireAuthentication(
  async (context: GetServerSidePropsContext) => {
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery(['teams'], () => getTeamsOfUser(undefined, context));
    await queryClient.prefetchQuery(['allTeams'], () => getAllTeams(context));
    await queryClient.prefetchQuery(['users'], () => getAllUsers(context));

    return {
      props: {
        dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      },
    };
  },
);

export default NewRegularBoard;
