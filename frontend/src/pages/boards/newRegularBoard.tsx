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
  ContentContainer,
  InnerContent,
  PageHeader,
  SubContainer,
  ButtonsContainer,
  StyledForm,
} from '@/styles/pages/boards/newSplitBoard.styles';
import requireAuthentication from '@/components/HOC/requireAuthentication';
import { getAllTeams, getTeamsOfUser } from '@/api/teamService';
import { dehydrate, QueryClient, useQuery } from 'react-query';
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

const NewRegularBoard: NextPage = () => {
  const router = useRouter();
  const { data: session } = useSession({ required: true });

  const [isBackButtonDisable, setBackButtonState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [createBoard, setCreateBoard] = useState(false);

  const setToastState = useSetRecoilState(toastState);
  // const setBoardState = useSetRecoilState(createBoardDataState);
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

  const addNewRegularBoard = () => {
    setCreateBoard(true);
  };

  const methods = useForm<{ text?: string; maxVotes?: number; slackEnable?: boolean }>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      text: '',
      maxVotes: 2,
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
    console.log({
      ...boardState.board,
      users: boardState.users,
      title: title || boardState.board.title,
      maxVotes,
      slackEnable,
      maxUsers: boardState.count.maxUsersCount,
    });
    // mutate( {
    //   ...boardState.board,
    //   users: boardState.users,
    //   title: title || boardState.board.title,
    //   maxVotes,
    //   slackEnable,
    //   maxUsers: boardState.count.maxUsersCount,
    // });
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

    // if (status === 'success') {
    //   setIsLoading(true);
    //   setToastState({
    //     open: true,
    //     content: 'Board created with success!',
    //     type: ToastStateEnum.SUCCESS,
    //   });

    //   setBoardState(defaultBoard);
    //   setSelectedTeam(undefined);
    //   router.push('/boards');
    // }

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
  ]);

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
          {createBoard ? (
            <ContentContainer>
              <SubContainer>
                <StyledForm
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
              <TipBar isRegularBoard />
            </ContentContainer>
          ) : (
            <ContentSelectContainer>
              <Flex gap={16} direction="column">
                <BoxRowContainer
                  iconName="blob-settings"
                  title="Configure board"
                  description="Select team or participants, configure your board and schedule a date and time."
                  active
                  handleSelect={addNewRegularBoard}
                />

                <BoxRowContainer
                  iconName="blob-arrow-right"
                  title="Quick create"
                  description="Jump the settings and just create a board. All configurations can still be done within the board itself."
                  active={false}
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
    await queryClient.prefetchQuery('teams', () => getTeamsOfUser(undefined, context));
    await queryClient.prefetchQuery('allTeams', () => getAllTeams(context));
    await queryClient.prefetchQuery('users', () => getAllUsers(context));

    return {
      props: {
        dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      },
    };
  },
);

export default NewRegularBoard;
