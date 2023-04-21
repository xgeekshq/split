import { Suspense, useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { joiResolver } from '@hookform/resolvers/joi';
import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { getAllTeams, getUserTeams } from '@/api/teamService';
import { getAllUsers } from '@/api/userService';
import BoardName from '@/components/CreateBoard/BoardName/BoardName';
import SettingsTabs from '@/components/CreateBoard/RegularBoard/SettingsTabs/SettingsTabs';
import QueryError from '@/components/Errors/QueryError';
import requireAuthentication from '@/components/HOC/requireAuthentication';
import CreateFooter from '@/components/Primitives/Layout/CreateFooter/CreateFooter';
import CreateHeader from '@/components/Primitives/Layout/CreateHeader/CreateHeader';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import TipBar from '@/components/Primitives/Layout/TipBar/TipBar';
import LoadingPage from '@/components/Primitives/Loading/Page/Page';
import { defaultRegularColumns } from '@/constants/boards/defaultColumns';
import { TEAMS_KEY } from '@/constants/react-query/keys';
import { DASHBOARD_ROUTE } from '@/constants/routes';
import REGULAR_BOARD_TIPS from '@/constants/tips/regularBoard';
import { BoardUserRoles } from '@/enums/boards/userRoles';
import { ToastStateEnum } from '@/enums/toasts/toast-types';
import useTeams from '@/hooks/teams/useTeams';
import useCurrentSession from '@/hooks/useCurrentSession';
import SchemaCreateRegularBoard from '@/schema/schemaCreateRegularBoard';
import { toastState } from '@/store/toast/atom/toast.atom';
import { usersListState } from '@/store/user.atom';
import { StyledForm } from '@/styles/pages/pages.styles';
import { BoardUser, BoardUserDto } from '@/types/board/board.user';
import isEmpty from '@/utils/isEmpty';
import CreateBoardBox from '@components/Primitives/Layout/CreateBoardBox/CreateBoardBox';
import useCreateBoard from '@hooks/boards/useCreateBoard';
import useCreateBoardHelper from '@hooks/useCreateBoardHelper';

const NewRegularBoard: NextPage = () => {
  const router = useRouter();
  const { session, userId, isSAdmin } = useCurrentSession({ required: true });

  const [isBackButtonDisable, setBackButtonState] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [createBoard, setCreateBoard] = useState(false);

  const setToastState = useSetRecoilState(toastState);
  const [usersList, setUsersList] = useRecoilState(usersListState);

  // Team  Hook
  const { data: userBasedTeams } = useTeams(isSAdmin);

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
  const { createBoardData, resetBoardState } = useCreateBoardHelper();
  const { status, mutate } = useCreateBoard();

  const addNewRegularBoard = () => {
    setCreateBoard(true);
  };

  const methods = useForm<{ text?: string; maxVotes?: number }>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      text: '',
      maxVotes: createBoardData.board.maxVotes,
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
    setIsPageLoading(true);
    resetListUsersState();
    setBackButtonState(true);
    router.back();
  }, [resetListUsersState, router]);

  const handleCancelBtn = () => {
    resetListUsersState();
    setIsPageLoading(true);
    router.push(DASHBOARD_ROUTE);
  };

  const filterResponsibles = (users: BoardUser[]) =>
    users.flatMap((member) => {
      if (member.role === BoardUserRoles.RESPONSIBLE) {
        return [member.user._id];
      }
      return [];
    });

  const saveBoard = (title?: string, maxVotes?: number) => {
    const users: BoardUserDto[] = [];

    let responsibles: string[] = [];

    const responsiblesFiltered = filterResponsibles(createBoardData.users);
    if (!session) return;

    if (!isEmpty(responsiblesFiltered)) {
      responsibles = [...responsiblesFiltered];
    }

    if (isEmpty(createBoardData.users)) {
      users.push({ role: BoardUserRoles.RESPONSIBLE, user: userId });
    } else {
      createBoardData.users.forEach((boardUser) => {
        users.push({ role: boardUser.role, user: boardUser.user._id });
      });
    }

    mutate({
      ...createBoardData.board,
      columns: defaultRegularColumns,
      users,
      title: title || 'Default Board',
      dividedBoards: [],
      maxVotes,
      maxUsers: createBoardData.count.maxUsersCount,
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
      ...createBoardData.board,
      columns: defaultRegularColumns,
      users,
      title: 'Default Board',
      dividedBoards: [],
      maxUsers: createBoardData.count.maxUsersCount,
      recurrent: false,
      responsibles: [userId],
    });
  };

  const hasResponsibles = !isEmpty(filterResponsibles(createBoardData.users));

  useEffect(() => {
    if (status === 'success') {
      setIsPageLoading(true);
      setToastState({
        open: true,
        content: 'Board created with success!',
        type: ToastStateEnum.SUCCESS,
      });

      resetBoardState();
      router.push('/boards');
    }

    return () => {
      resetBoardState();
    };
  }, [router, setToastState, resetBoardState, status]);

  if (!session || !userBasedTeams) return null;

  return (
    <Suspense fallback={<LoadingPage />}>
      <QueryError>
        <Flex
          css={{ height: '100vh', backgroundColor: '$primary50', opacity: isPageLoading ? 0.5 : 1 }}
          direction="column"
        >
          <CreateHeader
            disableBack={isBackButtonDisable}
            handleBack={handleBack}
            title="Add new Regular board"
          />
          {createBoard ? (
            <>
              <Flex
                css={{ height: '100%', position: 'relative', overflowY: 'auto' }}
                direction="column"
              >
                <Flex css={{ flex: '1' }}>
                  <StyledForm
                    direction="column"
                    id="hook-form"
                    onSubmit={methods.handleSubmit(({ text, maxVotes }) => {
                      saveBoard(text, maxVotes);
                    })}
                  >
                    <Flex direction="column">
                      <FormProvider {...methods}>
                        <BoardName
                          description="Make it short and descriptive. It well help you to distinguish retrospectives from each other."
                          title="Board Name"
                        />
                        <SettingsTabs isPageLoading />
                      </FormProvider>
                    </Flex>
                  </StyledForm>
                  <TipBar tips={REGULAR_BOARD_TIPS} />
                </Flex>
              </Flex>
              <CreateFooter
                confirmationLabel="Create board"
                disableButton={isBackButtonDisable || !hasResponsibles}
                formId="hook-form"
                handleBack={handleCancelBtn}
              />
            </>
          ) : (
            <Flex
              align="center"
              css={{ height: '100%' }}
              direction="column"
              gap={16}
              justify="center"
            >
              <CreateBoardBox
                description="Jump the settings and just create a board. All configurations can still be done within the board itself."
                iconName="blob-arrow-right"
                onClick={saveEmptyBoard}
                title="Quick create"
                type="row"
              />
              <CreateBoardBox
                description="Select team or participants, configure your board and schedule a date and time."
                iconName="blob-settings"
                onClick={addNewRegularBoard}
                title="Configure board"
                type="row"
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
