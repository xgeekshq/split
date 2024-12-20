import { Suspense, useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { joiResolver } from '@hookform/resolvers/joi';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { getAllTeams, getUserTeams } from '@/api/teamService';
import BoardName from '@/components/CreateBoard/BoardName/BoardName';
import SettingsTabs from '@/components/CreateBoard/SplitBoard/SettingsTabs/SettingsTabs';
import QueryError from '@/components/Errors/QueryError';
import requireAuthentication from '@/components/HOC/requireAuthentication';
import AlertBox from '@/components/Primitives/Alerts/AlertBox/AlertBox';
import Button from '@/components/Primitives/Inputs/Button/Button';
import CreateFooter from '@/components/Primitives/Layout/CreateFooter/CreateFooter';
import CreateHeader from '@/components/Primitives/Layout/CreateHeader/CreateHeader';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import TipBar from '@/components/Primitives/Layout/TipBar/TipBar';
import LoadingPage from '@/components/Primitives/Loading/Page/Page';
import { defaultSplitColumns } from '@/constants/boards/defaultColumns';
import { TEAMS_KEY } from '@/constants/react-query/keys';
import { DASHBOARD_ROUTE, ROUTES } from '@/constants/routes';
import SPLIT_BOARD_TIPS from '@/constants/tips/splitBoard';
import { createSuccessMessage } from '@/constants/toasts';
import { BoardPhases } from '@/enums/boards/phases';
import { BoardUserRoles } from '@/enums/boards/userRoles';
import useTeams from '@/hooks/teams/useTeams';
import useBoard from '@/hooks/useBoard';
import useCurrentSession from '@/hooks/useCurrentSession';
import SchemaCreateBoard from '@/schema/schemaCreateBoardForm';
import {
  createBoardDataState,
  createBoardError,
  createBoardTeam,
} from '@/store/createBoard/atoms/create-board.atom';
import { toastState } from '@/store/toast/atom/toast.atom';
import { StyledForm } from '@/styles/pages/pages.styles';
import { CreateBoardDto } from '@/types/board/board';
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
    columns: defaultSplitColumns,
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

const NewSplitBoard: NextPage = () => {
  const router = useRouter();
  const { isSAdmin } = useCurrentSession();
  const routerTeam = router.query.team;
  const { session } = useCurrentSession({ required: true });

  const [isBackButtonDisable, setBackButtonState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Recoil Atoms
  const setToastState = useSetRecoilState(toastState);
  const [boardState, setBoardState] = useRecoilState(createBoardDataState);
  const [haveError, setHaveError] = useRecoilState(createBoardError);
  const [selectedTeam, setSelectedTeam] = useRecoilState(createBoardTeam);

  // User Board Hook
  const {
    createBoard: { mutate },
  } = useBoard({ autoFetchBoard: false });

  // Team  Hook
  const {
    fetchAllTeams: { data, isError },
    handleErrorOnFetchAllTeams,
  } = useTeams(isSAdmin);
  const userBasedTeams = data ?? [];

  // React Hook Form
  const methods = useForm<{
    text: string;
    team: string;
    maxVotes?: number;
    slackEnable: boolean;
    maxTeams: number;
    maxUsers: number;
  }>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      text: '',
      maxVotes: boardState.board.maxVotes,
      team: undefined,
      slackEnable: boardState.board.slackEnable,
      maxTeams: undefined,
      maxUsers: undefined,
    },
    resolver: joiResolver(SchemaCreateBoard),
  });

  if (routerTeam && !selectedTeam) {
    const foundTeam = userBasedTeams.find((team) => team.id === routerTeam);
    setSelectedTeam(foundTeam);
  }

  // Handle back to boards list page
  const handleBack = useCallback(() => {
    setIsLoading(true);
    setBackButtonState(true);
    router.back();
  }, [router]);

  const handleCancelBtn = () => {
    setIsLoading(true);
    router.push(DASHBOARD_ROUTE);
  };

  const saveBoard = (
    title: string,
    team: string,
    slackEnable: boolean,
    maxUsers: number,
    maxVotes?: number,
  ) => {
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

      if (responsible) {
        newSubBoard.responsibles = [responsible.user];
      }

      return newSubBoard;
    });

    const boardUsersDtos = boardState.users.map((boardUser) => ({
      user: boardUser.user._id,
      role: boardUser.role,
    }));

    mutate(
      {
        ...boardState.board,
        users: boardUsersDtos,
        title,
        dividedBoards: newDividedBoards,
        maxVotes,
        maxUsers: boardState.count.maxUsersCount,
        team,
        responsibles,
        slackEnable,
        phase: BoardPhases.ADDCARDS,
      },
      {
        onSuccess: () => {
          setIsLoading(true);
          setToastState(createSuccessMessage('Board created with success!'));

          setBoardState(defaultBoard);
          setSelectedTeam(undefined);
          router.push(ROUTES.Boards);
        },
      },
    );
  };

  useEffect(() => {
    return () => {
      setBoardState(defaultBoard);
      setSelectedTeam(undefined);
      setHaveError(false);
    };
  }, [setSelectedTeam, setBoardState, setHaveError]);

  if (isError) {
    handleErrorOnFetchAllTeams();
  }

  if (!session || !userBasedTeams) return null;

  return (
    <Suspense fallback={<LoadingPage />}>
      <QueryError>
        <Flex
          css={{ height: '100vh', backgroundColor: '$primary50', opacity: isLoading ? 0.5 : 1 }}
          direction="column"
        >
          <CreateHeader
            disableBack={isBackButtonDisable}
            handleBack={handleBack}
            title="Add new SPLIT board"
          />
          <Flex
            css={{ height: '100%', position: 'relative', overflowY: 'auto' }}
            direction="column"
          >
            <Flex css={{ flex: '1' }}>
              <FormProvider {...methods}>
                <StyledForm
                  id="hook-form"
                  {...(!haveError && {
                    onSubmit: methods.handleSubmit(
                      ({ text, team, maxVotes, slackEnable, maxUsers }) => {
                        saveBoard(text, team, slackEnable, +maxUsers, maxVotes);
                      },
                    ),
                  })}
                >
                  <Flex css={{ width: '100%' }} direction="column" gap={24}>
                    {haveError && (
                      <AlertBox
                        css={{ flexWrap: 'wrap', gap: '$16' }}
                        text="In order to create a SPLIT retrospective, you need to have a team with an amount of people big enough to be split into smaller sub-teams. Also you need to be team-admin to create SPLIT retrospectives."
                        title="No team yet!"
                        type="error"
                      >
                        <Link href={ROUTES.NewTeam}>
                          <Button css={{ px: '$40' }} size="sm">
                            Create team
                          </Button>
                        </Link>
                      </AlertBox>
                    )}
                    <Flex direction="column">
                      <BoardName
                        description="The main board is the board into which all sub-boards will be merged"
                        title="Main Board Name"
                      />
                      <SettingsTabs />
                    </Flex>
                  </Flex>
                </StyledForm>
              </FormProvider>
              <TipBar tips={SPLIT_BOARD_TIPS} />
            </Flex>
          </Flex>
          <CreateFooter
            confirmationLabel="Create board"
            disableButton={isBackButtonDisable}
            formId="hook-form"
            handleBack={handleCancelBtn}
            hasError={haveError}
          />
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
    await queryClient.prefetchQuery({
      queryKey: [TEAMS_KEY],
      queryFn: () => {
        if (isSAdmin) {
          return getAllTeams(context);
        }
        return getUserTeams(userId, context);
      },
    });

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
    };
  },
);

export default NewSplitBoard;
