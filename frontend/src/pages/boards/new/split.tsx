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
import { TEAMS_KEY } from '@/constants/react-query/keys';
import { DASHBOARD_ROUTE, ROUTES } from '@/constants/routes';
import SPLIT_BOARD_TIPS from '@/constants/tips/splitBoard';
import { BoardPhases } from '@/enums/boards/phases';
import { BoardUserRoles } from '@/enums/boards/userRoles';
import { ToastStateEnum } from '@/enums/toasts/toast-types';
import useTeams from '@/hooks/teams/useTeams';
import useCurrentSession from '@/hooks/useCurrentSession';
import SchemaCreateBoard from '@/schema/schemaCreateBoardForm';
import { createBoardError } from '@/store/createBoard/atoms/create-board.atom';
import { toastState } from '@/store/toast/atom/toast.atom';
import { StyledForm } from '@/styles/pages/pages.styles';
import { CreateBoardDto } from '@/types/board/board';
import isEmpty from '@/utils/isEmpty';
import useCreateBoard from '@hooks/boards/useCreateBoard';
import useCreateBoardHelper from '@hooks/useCreateBoardHelper';

const NewSplitBoard: NextPage = () => {
  const router = useRouter();
  const { isSAdmin } = useCurrentSession();
  const routerTeam = router.query.team;
  const { session } = useCurrentSession({ required: true });

  const [isBackButtonDisable, setBackButtonState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Recoil Atoms
  const setToastState = useSetRecoilState(toastState);
  const [haveError, setHaveError] = useRecoilState(createBoardError);

  // User Board Hook
  const { createBoardData, setCreateBoardData, resetBoardState } = useCreateBoardHelper();
  const { status, mutate } = useCreateBoard();

  // Team  Hook
  const teamsQuery = useTeams(isSAdmin);
  const userBasedTeams = teamsQuery.data ?? [];

  // React Hook Form
  const methods = useForm<{
    text: string;
    maxVotes?: number;
    slackEnable: boolean;
    maxTeams: number;
    maxUsers: number;
  }>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      text: '',
      maxVotes: createBoardData.board.maxVotes,
      slackEnable: createBoardData.board.slackEnable,
      maxTeams: undefined,
      maxUsers: undefined,
    },
    resolver: joiResolver(SchemaCreateBoard),
  });

  if (routerTeam && !createBoardData.team) {
    const foundTeam = userBasedTeams.find((team) => team.id === routerTeam);
    if (foundTeam) {
      setCreateBoardData((prev) => ({
        ...prev,
        team: foundTeam,
        board: { ...prev.board, team: foundTeam.id },
      }));
    }
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

  const saveBoard = (title: string, slackEnable: boolean, maxUsers: number, maxVotes?: number) => {
    const responsibles: string[] = [];
    const newDividedBoards: CreateBoardDto[] = createBoardData.board.dividedBoards.map(
      (subBoard) => {
        const newSubBoard: CreateBoardDto = { ...subBoard, users: [], dividedBoards: [] };
        newSubBoard.hideCards = createBoardData.board.hideCards;
        newSubBoard.hideVotes = createBoardData.board.hideVotes;
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
      },
    );

    const boardUsersDtos = createBoardData.users.map((boardUser) => ({
      user: boardUser.user._id,
      role: boardUser.role,
    }));

    mutate({
      ...createBoardData.board,
      users: boardUsersDtos,
      title,
      dividedBoards: newDividedBoards,
      maxVotes,
      maxUsers,
      responsibles,
      slackEnable,
      phase: BoardPhases.ADDCARDS,
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

      resetBoardState();
      router.push('/boards');
    }

    return () => {
      resetBoardState();
      setHaveError(false);
    };
  }, [status, router, setToastState, resetBoardState, setHaveError]);

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
                    onSubmit: methods.handleSubmit(({ text, maxVotes, slackEnable, maxUsers }) => {
                      saveBoard(text, slackEnable, +maxUsers, maxVotes);
                    }),
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
    await queryClient.prefetchQuery([TEAMS_KEY], () => {
      if (isSAdmin) {
        return getAllTeams(context);
      }
      return getUserTeams(userId, context);
    });

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
    };
  },
);

export default NewSplitBoard;
