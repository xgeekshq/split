import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { getAllTeams, getUserTeams } from '@/api/teamService';
import { getAllUsers } from '@/api/userService';
import BoardName from '@/components/CreateBoard/BoardName/BoardName';
import CreateBoardBox from '@/components/CreateBoard/CreateBoardBox/CreateBoardBox';
import SettingsTabs from '@/components/CreateBoard/RegularBoard/SettingsTabs/SettingsTabs';
import QueryError from '@/components/Errors/QueryError';
import requireAuthentication from '@/components/HOC/requireAuthentication';
import CreateFooter from '@/components/Primitives/Layout/CreateFooter/CreateFooter';
import CreateHeader from '@/components/Primitives/Layout/CreateHeader/CreateHeader';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import TipBar from '@/components/Primitives/Layout/TipBar/TipBar';
import LoadingPage from '@/components/Primitives/Loading/Page/Page';
import { defaultRegularColumns } from '@/helper/board/defaultColumns';
import { TEAMS_KEY } from '@/hooks/teams';
import useTeams from '@/hooks/teams/useTeams';
import useBoard from '@/hooks/useBoard';
import useCurrentSession from '@/hooks/useCurrentSession';
import SchemaCreateRegularBoard from '@/schema/schemaCreateRegularBoard';
import { createBoardDataState, createBoardTeam } from '@/store/createBoard/atoms/create-board.atom';
import { usersListState } from '@/store/team/atom/team.atom';
import { toastState } from '@/store/toast/atom/toast.atom';
import { StyledForm } from '@/styles/pages/pages.styles';
import { BoardUserDto } from '@/types/board/board.user';
import { BoardUserRoles } from '@/utils/enums/board.user.roles';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import isEmpty from '@/utils/isEmpty';
import { DASHBOARD_ROUTE } from '@/utils/routes';
import { joiResolver } from '@hookform/resolvers/joi';
import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query';

const defaultBoard = {
  users: [],
  team: null,
  count: {
    teamsCount: 2,
    maxUsersCount: 2,
  },
  board: {
    title: 'Default Board',
    columns: defaultRegularColumns,
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
    postAnonymously: false,
  },
};

const NewRegularBoard: NextPage = () => {
  const router = useRouter();
  const { session, userId, isSAdmin } = useCurrentSession({ required: true });

  const [isBackButtonDisable, setBackButtonState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [createBoard, setCreateBoard] = useState(false);

  const setToastState = useSetRecoilState(toastState);
  const [boardState, setBoardState] = useRecoilState(createBoardDataState);
  const [usersList, setUsersList] = useRecoilState(usersListState);
  const setSelectedTeam = useSetRecoilState(createBoardTeam);

  // Team  Hook
  const { data: userBasedTeams } = useTeams(isSAdmin);

  const regularBoardTips = [
    {
      title: 'Quick create board',
      description: [
        'If you want to jump the settings you can just hit the button Create board.',
        'You can still adjust all the settings later on inside the board itself.',
      ],
    },
    {
      title: 'Columns',
      description: [
        'We will set the columns by default to 3.',
        'If you want to have more or less you can later, inside the actual board, still adjust the columns.',
      ],
    },
  ];

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

  useEffect(() => {
    if (allUsers) {
      const usersWithChecked = allUsers.map((user) => ({
        ...user,
        isChecked: user._id === userId,
      }));

      setUsersList(usersWithChecked);
    }
  }, [allUsers, setUsersList, userId]);

  // Board Hook
  const {
    createBoard: { status, mutate },
  } = useBoard({ autoFetchBoard: false });

  const addNewRegularBoard = () => {
    setCreateBoard(true);
  };

  const methods = useForm<{ text?: string; maxVotes?: number; slackEnable?: boolean }>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      text: '',
      maxVotes: boardState.board.maxVotes,
      slackEnable: false,
    },
    resolver: joiResolver(SchemaCreateRegularBoard),
  });

  const resetListUsersState = useCallback(() => {
    const updateCheckedUser = usersList.map((user) => ({
      ...user,
      isChecked: user._id === userId,
    }));
    setUsersList(updateCheckedUser);
  }, [userId, setUsersList, usersList]);

  // Handle back to boards list page
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

  const saveBoard = (title?: string, maxVotes?: number, slackEnable?: boolean) => {
    const users: BoardUserDto[] = [];
    const responsibles: string[] = [];
    const responsible = boardState.users.find((user) => user.role === BoardUserRoles.RESPONSIBLE);

    if (!session) return;

    if (!isEmpty(responsible)) {
      responsibles.push(responsible.user._id);
    }

    if (isEmpty(boardState.users)) {
      users.push({ role: BoardUserRoles.RESPONSIBLE, user: userId });
    } else {
      boardState.users.forEach((boardUser) => {
        users.push({ role: boardUser.role, user: boardUser.user._id });
      });
    }

    mutate({
      ...boardState.board,
      columns: defaultRegularColumns,
      users,
      title: title || defaultBoard.board.title,
      dividedBoards: [],
      maxVotes,
      slackEnable,
      maxUsers: boardState.count.maxUsersCount,
      recurrent: false,
      responsibles,
      phase: undefined,
    });
  };

  const saveEmptyBoard = () => {
    const users: BoardUserDto[] = [];
    if (session) {
      users.push({ role: BoardUserRoles.RESPONSIBLE, user: userId });
    }

    mutate({
      ...boardState.board,
      columns: defaultRegularColumns,
      users,
      title: defaultBoard.board.title,
      dividedBoards: [],
      maxUsers: boardState.count.maxUsersCount,
      recurrent: false,
    });
  };

  useEffect(() => {
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
  }, [router, setToastState, setSelectedTeam, setBoardState, status]);

  if (!session || !userBasedTeams) return null;

  return (
    <Suspense fallback={<LoadingPage />}>
      <QueryError>
        <Flex
          css={{ height: '100vh', backgroundColor: '$primary50', opacity: isLoading ? 0.5 : 1 }}
          direction="column"
        >
          <CreateHeader
            title="Add new Regular board"
            disableBack={isBackButtonDisable}
            handleBack={handleBack}
          />
          {createBoard ? (
            <>
              <Flex
                css={{ height: '100%', position: 'relative', overflowY: 'auto' }}
                direction="column"
              >
                <Flex css={{ flex: '1' }}>
                  <StyledForm
                    id="hook-form"
                    direction="column"
                    onSubmit={methods.handleSubmit(({ text, maxVotes, slackEnable }) => {
                      saveBoard(text, maxVotes, slackEnable);
                    })}
                  >
                    <Flex direction="column">
                      <FormProvider {...methods}>
                        <BoardName
                          title="Board Name"
                          description="Make it short and descriptive. It well help you to distinguish retrospectives from each other."
                        />
                        <SettingsTabs />
                      </FormProvider>
                    </Flex>
                  </StyledForm>
                  <TipBar tips={regularBoardTips} />
                </Flex>
              </Flex>
              <CreateFooter
                disableButton={isBackButtonDisable}
                handleBack={handleCancelBtn}
                formId="hook-form"
                confirmationLabel="Create board"
              />
            </>
          ) : (
            <Flex
              gap={16}
              direction="column"
              align="center"
              justify="center"
              css={{ height: '100%' }}
            >
              <CreateBoardBox
                iconName="blob-arrow-right"
                title="Quick create"
                description="Jump the settings and just create a board. All configurations can still be done within the board itself."
                type="row"
                onClick={saveEmptyBoard}
              />
              <CreateBoardBox
                iconName="blob-settings"
                title="Configure board"
                description="Select team or participants, configure your board and schedule a date and time."
                type="row"
                onClick={addNewRegularBoard}
              />
            </Flex>
          )}
        </Flex>
      </QueryError>
    </Suspense>
  );
};

export const getServerSideProps: GetServerSideProps = requireAuthentication(
  async (context: GetServerSidePropsContext) => {
    // CHECK: 'getServerSession' should be used instead of 'getSession'
    // https://next-auth.js.org/configuration/nextjs#unstable_getserversession
    const session = await getSession({ req: context.req });
    const userId = session?.user.id;
    const isSAdmin = session?.user.isSAdmin ?? false;

    const queryClient = new QueryClient();
    await Promise.all([
      queryClient.prefetchQuery([TEAMS_KEY], () => {
        if (isSAdmin) {
          return getAllTeams(context);
        }
        return getUserTeams(userId, context);
      }),
      queryClient.prefetchQuery(['users'], () => getAllUsers(context)),
    ]);

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
    };
  },
);

export default NewRegularBoard;
