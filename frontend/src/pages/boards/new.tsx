import { Suspense, useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { dehydrate, QueryClient } from 'react-query';
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';
import { joiResolver } from '@hookform/resolvers/joi';

import {
  ButtonsContainer,
  Container,
  ContentContainer,
  InnerContent,
  PageHeader,
  StyledForm,
  SubContainer,
} from '@/styles/pages/boards/new.styles';

import { getTeamsOfUser } from '@/api/teamService';
import BoardName from '@/components/CreateBoard/BoardName';

import SettingsTabs from '@/components/CreateBoard/SettingsTabs';
import TipBar from '@/components/CreateBoard/TipBar';
import requireAuthentication from '@/components/HOC/requireAuthentication';
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

const NewBoard: NextPage = () => {
  const router = useRouter();
  const { data: session } = useSession({ required: true });

  const [isBackButtonDisable, setBackButtonState] = useState(false);

  /**
   * Recoil Atoms and Hooks
   */
  const setToastState = useSetRecoilState(toastState);
  const boardState = useRecoilValue(createBoardDataState);
  const resetBoardState = useResetRecoilState(createBoardDataState);
  const [haveError, setHaveError] = useRecoilState(createBoardError);
  const setTeams = useSetRecoilState(teamsOfUser);

  const setSelectedTeam = useSetRecoilState(createBoardTeam);

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
  } = useTeam({ autoFetchTeam: false });

  /**
   * React Hook Form
   */
  const methods = useForm<{ text: string; maxVotes?: number; slackEnable?: boolean }>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      text: '',
      maxVotes: boardState.board.maxVotes,
      slackEnable: false,
    },
    resolver: joiResolver(SchemaCreateBoard),
  });

  const mainBoardName = useWatch({
    control: methods.control,
    name: 'text',
  });

  /**
   * Handle back to boards list page
   */
  const handleBack = useCallback(() => {
    resetBoardState();
    setSelectedTeam(undefined);
    setHaveError(false);
    setBackButtonState(true);
    router.back();
  }, [router, resetBoardState]);

  /**
   * Save board
   * @param title Board Title
   * @param maxVotes Maxium number of votes allowed
   */
  const saveBoard = (title: string, maxVotes?: number, slackEnable?: boolean) => {
    const newDividedBoards: CreateBoardDto[] = boardState.board.dividedBoards.map((subBoard) => {
      const newSubBoard: CreateBoardDto = { ...subBoard, users: [], dividedBoards: [] };
      newSubBoard.hideCards = boardState.board.hideCards;
      newSubBoard.hideVotes = boardState.board.hideVotes;
      newSubBoard.maxVotes = maxVotes;

      newSubBoard.users = subBoard.users.map((boardUser) => ({
        user: boardUser.user._id,
        role: boardUser.role,
      }));

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
    });
  };

  useEffect(() => {
    if (teamsData) {
      setTeams(teamsData);
    }

    if (status === 'success') {
      setToastState({
        open: true,
        content: 'Board created with success!',
        type: ToastStateEnum.SUCCESS,
      });

      resetBoardState();
      router.push('/boards');
    }
  }, [status, resetBoardState, router, setToastState, session, teamsData, setTeams]);

  if (!session || !teamsData) return null;

  return (
    <Suspense fallback={<LoadingPage />}>
      <QueryError>
        <Container>
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
                    ? methods.handleSubmit(({ text, maxVotes, slackEnable }) => {
                        saveBoard(text, maxVotes, slackEnable);
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
                    onClick={handleBack}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isBackButtonDisable}>
                    Create board
                  </Button>
                </ButtonsContainer>
              </StyledForm>
            </SubContainer>
            <TipBar />
          </ContentContainer>
        </Container>
      </QueryError>
    </Suspense>
  );
};

export const getServerSideProps: GetServerSideProps = requireAuthentication(
  async (context: GetServerSidePropsContext) => {
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery('teams', () => getTeamsOfUser(context));

    return {
      props: {
        dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      },
    };
  },
);

export default NewBoard;
