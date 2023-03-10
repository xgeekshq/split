import { Suspense, useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { getSession, useSession } from 'next-auth/react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { joiResolver } from '@hookform/resolvers/joi';
import BoardName from '@/components/CreateBoard/BoardName';
import SettingsTabs from '@/components/CreateBoard/SplitBoard/SettingsTabs';
import TipBar from '@/components/CreateBoard/TipBar';
import Icon from '@/components/Primitives/Icon';
import AlertBox from '@/components/Primitives/Alerts/AlertBox/AlertBox';
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
import LoadingPage from '@/components/Primitives/Loading/Page/Page';
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import {
  PageHeader,
  StyledForm,
  ButtonsContainer,
} from '@/styles/pages/boards/newSplitBoard.styles';
import requireAuthentication from '@/components/HOC/requireAuthentication';
import { getAllTeams, getTeamsOfUser } from '@/api/teamService';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { DASHBOARD_ROUTE } from '@/utils/routes';
import { BoardUserRoles } from '@/utils/enums/board.user.roles';
import isEmpty from '@/utils/isEmpty';

import Link from 'next/link';
import { defaultSplitColumns } from '@/helper/board/defaultColumns';
import { BoardPhases } from '@/utils/enums/board.phases';
import Flex from '@/components/Primitives/Flex';

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
  const [teams, setTeams] = useRecoilState(teamsOfUser);
  const [selectedTeam, setSelectedTeam] = useRecoilState(createBoardTeam);

  /**
   * User Board Hook
   */
  const {
    createBoard: { status, mutate },
  } = useBoard({ autoFetchBoard: false });

  // Team  Hook
  const {
    fetchUserBasedTeams: { data },
  } = useTeam();

  useEffect(() => {
    if (data) {
      setTeams(data);
    }
  }, [data, setTeams]);

  /**
   * React Hook Form
   */
  const methods = useForm<{ text: string; team: string; maxVotes?: number; slackEnable: boolean }>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      text: '',
      maxVotes: boardState.board.maxVotes,
      team: undefined,
      slackEnable: boardState.board.slackEnable,
    },
    resolver: joiResolver(SchemaCreateBoard),
  });

  if (routerTeam && !selectedTeam) {
    const foundTeam = teams.find((team) => team.id === routerTeam);
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
  const saveBoard = (title: string, team: string, slackEnable: boolean, maxVotes?: number) => {
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
      maxUsers: boardState.count.maxUsersCount,
      team,
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

      setBoardState(defaultBoard);
      setSelectedTeam(undefined);
      router.push('/boards');
    }

    return () => {
      setBoardState(defaultBoard);
      setSelectedTeam(undefined);
      setHaveError(false);
    };
  }, [status, router, setToastState, setSelectedTeam, setBoardState, setHaveError]);

  if (!session || !data) return null;

  return (
    <Suspense fallback={<LoadingPage />}>
      <QueryError>
        <Flex
          css={{ height: '100vh', backgroundColor: '$primary50', opacity: isLoading ? 0.5 : 1 }}
          direction="column"
        >
          <PageHeader>
            <Text color="primary800" heading={3} fontWeight="bold">
              Add new SPLIT board
            </Text>

            <Button isIcon size="lg" disabled={isBackButtonDisable} onClick={handleBack}>
              <Icon css={{ color: '$primaryBase' }} name="close" />
            </Button>
          </PageHeader>
          <Flex
            css={{ height: '100%', position: 'relative', overflowY: 'auto' }}
            direction="column"
          >
            <Flex css={{ flex: '1' }}>
              <StyledForm
                id="hook-form"
                onSubmit={
                  !haveError
                    ? methods.handleSubmit(({ text, team, maxVotes, slackEnable }) => {
                        saveBoard(text, team, slackEnable, maxVotes);
                      })
                    : undefined
                }
              >
                <Flex direction="column" gap={24} css={{ width: '100%' }}>
                  {haveError && (
                    <AlertBox
                      text="In order to create a SPLIT retrospective, you need to have a team with an amount of people big enough to be split into smaller sub-teams. Also you need to be team-admin to create SPLIT retrospectives."
                      title="No team yet!"
                      type="error"
                      css={{ flexWrap: 'wrap', gap: '$16' }}
                    >
                      <Link href="/teams/new">
                        <Button size="sm" css={{ px: '$40' }}>
                          Create team
                        </Button>
                      </Link>
                    </AlertBox>
                  )}
                  <Flex direction="column">
                    <FormProvider {...methods}>
                      <BoardName
                        title="Main Board Name"
                        description="The main board is the board into which all sub-boards will be merged"
                      />
                      <SettingsTabs />
                    </FormProvider>
                  </Flex>
                </Flex>
              </StyledForm>
              <TipBar isSplitBoard />
            </Flex>
          </Flex>
          <ButtonsContainer gap="24" justify="end">
            <Button
              disabled={isBackButtonDisable}
              type="button"
              variant="lightOutline"
              onClick={handleCancelBtn}
            >
              Cancel
            </Button>
            <Button type="submit" form="hook-form" disabled={isBackButtonDisable || haveError}>
              Create board
            </Button>
          </ButtonsContainer>
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

    const queryClient = new QueryClient();

    if (session?.user.isSAdmin) {
      await queryClient.prefetchQuery(['userBasedTeams'], () => getAllTeams(context));
    } else {
      await queryClient.prefetchQuery(['userBasedTeams'], () => getTeamsOfUser(undefined, context));
    }

    return {
      props: {
        dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      },
    };
  },
);

export default NewSplitBoard;
