import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import { getSession, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { getAllTeams, getTeamsOfUser } from '@/api/teamService';
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
import { defaultSplitColumns } from '@/helper/board/defaultColumns';
import useBoard from '@/hooks/useBoard';
import useTeam from '@/hooks/useTeam';
import SchemaCreateBoard from '@/schema/schemaCreateBoardForm';
import {
  createBoardDataState,
  createBoardError,
  createBoardTeam,
} from '@/store/createBoard/atoms/create-board.atom';
import { teamsOfUser } from '@/store/team/atom/team.atom';
import { toastState } from '@/store/toast/atom/toast.atom';
import { StyledForm } from '@/styles/pages/pages.styles';
import { CreateBoardDto } from '@/types/board/board';
import { BoardPhases } from '@/utils/enums/board.phases';
import { BoardUserRoles } from '@/utils/enums/board.user.roles';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import isEmpty from '@/utils/isEmpty';
import { DASHBOARD_ROUTE, ROUTES } from '@/utils/routes';
import { joiResolver } from '@hookform/resolvers/joi';
import { dehydrate, QueryClient } from '@tanstack/react-query';

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

  // Recoil Atoms
  const setToastState = useSetRecoilState(toastState);
  const [boardState, setBoardState] = useRecoilState(createBoardDataState);
  const [haveError, setHaveError] = useRecoilState(createBoardError);
  const [teams, setTeams] = useRecoilState(teamsOfUser);
  const [selectedTeam, setSelectedTeam] = useRecoilState(createBoardTeam);

  // User Board Hook
  const {
    createBoard: { status, mutate },
  } = useBoard({ autoFetchBoard: false });

  // Team Hook
  const {
    fetchUserBasedTeams: { data: userBasedTeams },
  } = useTeam();

  useEffect(() => {
    if (userBasedTeams) {
      setTeams(userBasedTeams);
    }
  }, [userBasedTeams, setTeams]);

  const splitBoardTips = [
    {
      title: 'Sub-teams',
      description: [
        'The participants of the sub-teams are generated randomly.',
        'The number of participants is split equally between all sub-teams.',
        'For each sub-team there is one responsible selected.',
      ],
    },
    {
      title: 'Responsibles',
      description: [
        'Responsibles are normal users with the rights to merge the cards at the end of each sub-teams retro into the main board.',
        'Responsibles also are in charge of scheduling and conducting the sub-teams retrospective.',
      ],
    },
    {
      title: 'Stakeholder',
      description: ['The stakeholder will not be assigned to any sub-team.'],
    },
  ];

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
    const foundTeam = teams.find((team) => team.id === routerTeam);
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

      return newSubBoard;
    });

    const boardUsersDtos = boardState.users.map((boardUser) => ({
      user: boardUser.user._id,
      role: boardUser.role,
    }));

    mutate({
      ...boardState.board,
      users: boardUsersDtos,
      title,
      dividedBoards: newDividedBoards,
      maxVotes,
      maxUsers,
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

  if (!session || !userBasedTeams) return null;

  return (
    <Suspense fallback={<LoadingPage />}>
      <QueryError>
        <Flex
          css={{ height: '100vh', backgroundColor: '$primary50', opacity: isLoading ? 0.5 : 1 }}
          direction="column"
        >
          <CreateHeader
            title="Add new SPLIT board"
            disableBack={isBackButtonDisable}
            handleBack={handleBack}
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
                  <Flex direction="column" gap={24} css={{ width: '100%' }}>
                    {haveError && (
                      <AlertBox
                        text="In order to create a SPLIT retrospective, you need to have a team with an amount of people big enough to be split into smaller sub-teams. Also you need to be team-admin to create SPLIT retrospectives."
                        title="No team yet!"
                        type="error"
                        css={{ flexWrap: 'wrap', gap: '$16' }}
                      >
                        <Link href={ROUTES.NewTeam}>
                          <Button size="sm" css={{ px: '$40' }}>
                            Create team
                          </Button>
                        </Link>
                      </AlertBox>
                    )}
                    <Flex direction="column">
                      <BoardName
                        title="Main Board Name"
                        description="The main board is the board into which all sub-boards will be merged"
                      />
                      <SettingsTabs />
                    </Flex>
                  </Flex>
                </StyledForm>
              </FormProvider>
              <TipBar tips={splitBoardTips} />
            </Flex>
          </Flex>
          <CreateFooter
            disableButton={isBackButtonDisable}
            hasError={haveError}
            handleBack={handleCancelBtn}
            formId="hook-form"
            confirmationLabel="Create board"
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
