import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSideProps, NextPage } from 'next';
import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { getBoardRequest, getPublicStatusRequest } from '@/api/boardService';
import DragDropArea from '@/components/Board/DragDropArea';
import RegularBoard from '@/components/Board/RegularBoard';
import { BoardSettings } from '@/components/Board/Settings';
import AlertGoToMainBoard from '@/components/Board/SplitBoard/AlertGoToMainBoard';
import BoardHeader from '@/components/Board/SplitBoard/Header';
import Timer from '@/components/Board/Timer';
import Icon from '@/components/Primitives/Icons/Icon/Icon';
import LoadingPage from '@/components/Primitives/Loading/Page/Page';
import AlertBox from '@/components/Primitives/Alerts/AlertBox/AlertBox';
import Button from '@/components/Primitives/Inputs/Button/Button';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import useBoard from '@/hooks/useBoard';
import { useSocketIO } from '@/hooks/useSocketIO';
import {
  boardInfoState,
  boardParticipantsState,
  deletedColumnsState,
  editColumnsState,
  newBoardState,
} from '@/store/board/atoms/board.atom';
import { BoardUserRoles } from '@/utils/enums/board.user.roles';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';
import isEmpty from '@/utils/isEmpty';
import { GuestUser } from '@/types/user/user';
import { DASHBOARD_ROUTE } from '@/utils/routes';
import { getGuestUserCookies } from '@/utils/getGuestUserCookies';
import { BoardPhases } from '@/utils/enums/board.phases';
import ConfirmationDialog from '@/components/Primitives/Alerts/ConfirmationDialog/ConfirmationDialog';
import useCards from '@/hooks/useCards';
import { UpdateBoardPhaseType } from '@/types/board/board';
import { sortParticipantsList } from './participants';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const boardId = String(context.query.boardId);
  const { req, res } = context;
  const queryClient = new QueryClient();

  const session = await getSession(context);

  try {
    const boardIsPublic = await getPublicStatusRequest(boardId, context);

    // if board is public and user has no session
    if (boardIsPublic && !session) {
      // check if there are guest user cookies
      const cookiesGuestUser: GuestUser | { user: string } = getGuestUserCookies(
        { req, res },
        true,
      );
      // if there isn´t cookies, the guest user is not registered
      if (!cookiesGuestUser) {
        return {
          redirect: {
            permanent: false,
            destination: `/login-guest-user/${boardId}`,
          },
        };
      }
    }

    await queryClient.fetchQuery(['board', { id: boardId }], () =>
      getBoardRequest(boardId, context),
    );
  } catch (e) {
    return {
      redirect: {
        permanent: false,
        destination: DASHBOARD_ROUTE,
      },
    };
  }

  return {
    props: {
      key: boardId,
      dehydratedState: dehydrate(queryClient),
      boardId,
    },
  };
};

type Props = {
  boardId: string;
};

const Board: NextPage<Props> = ({ boardId }) => {
  // States
  // State or open and close Board Settings Dialog
  const [isOpen, setIsOpen] = useState(false);

  // Recoil States
  const [newBoard, setNewBoard] = useRecoilState(newBoardState);
  const [recoilBoard, setRecoilBoard] = useRecoilState(boardInfoState);
  const setBoardParticipants = useSetRecoilState(boardParticipantsState);
  const setEditColumns = useSetRecoilState(editColumnsState);
  const setDeletedColumns = useSetRecoilState(deletedColumnsState);

  // Main Board Id
  const mainBoardId = recoilBoard?.mainBoard?._id;

  // Session Details
  const { data: session } = useSession({ required: false });

  const guestUserCookies = getGuestUserCookies();

  const userId: string | undefined =
    !session && guestUserCookies ? guestUserCookies.user : session?.user?.id;

  // Hooks
  const {
    fetchBoard: { data },
    updateBoardPhaseMutation,
  } = useBoard({
    autoFetchBoard: true,
  });
  const board = data?.board;
  const isSubBoard = board?.isSubBoard;

  const route = useRouter();
  const { mergeBoard } = useCards();

  const isPersonalBoard = !data?.board.team; // personal boards don't have teams

  // regular boards have teams but no subboards (divided boards)
  const isRegularOrPersonalBoard =
    (!data?.board.isSubBoard && !!data?.board.team && !data?.board.dividedBoards.length) ||
    !data?.board.team;

  // Socket IO Hook
  const { socketId, emitEvent, listenEvent } = useSocketIO(boardId);

  // Use effect to set recoil state using data from API
  useEffect(() => {
    if (data) {
      setRecoilBoard(data);

      if (!data.board.team) {
        setEditColumns(data.board.columns);
        setDeletedColumns([]);
        sortParticipantsList([...data.board.users], setBoardParticipants);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, userId]);

  // Board Settings permissions
  const isStakeholderOrAdmin = useMemo(
    () =>
      isPersonalBoard
        ? board?.users.some(
            (boardUser) =>
              [BoardUserRoles.STAKEHOLDER, BoardUserRoles.RESPONSIBLE].includes(boardUser.role) &&
              boardUser.user._id === userId,
          )
        : board?.team.users.some(
            (boardUser) =>
              [TeamUserRoles.STAKEHOLDER, TeamUserRoles.ADMIN].includes(boardUser.role) &&
              boardUser.user?._id === userId,
          ),
    [board, isPersonalBoard, userId],
  );

  const [isResponsible, isOwner] = useMemo(
    () =>
      board
        ? [
            board.users.some(
              (boardUser) =>
                boardUser.role === BoardUserRoles.RESPONSIBLE && boardUser.user?._id === userId,
            ),
            board.createdBy?._id === userId,
          ]
        : [false, false],
    [board, userId],
  );

  // Show board settings button if current user is allowed to edit
  const hasAdminRole = isStakeholderOrAdmin || session?.user.isSAdmin || isOwner || isResponsible;

  // Show button in sub boards to merge into main
  const showButtonToMerge = !!(isSubBoard && !board?.submitedByUser && hasAdminRole);

  const canChangePhase =
    board?.dividedBoards?.every((dividedBoard) => !isEmpty(dividedBoard.submitedAt)) &&
    !isSubBoard &&
    hasAdminRole;

  // Show button in main board to start voting
  const showButtonToVote = !!(canChangePhase && board?.phase === BoardPhases.ADDCARDS);

  // Show button in main board to submit
  const showButtonToSubmit = !!(canChangePhase && board?.phase === BoardPhases.VOTINGPHASE);

  // Show Alert message if any sub-board wasn't merged
  const showMessageHaveSubBoardsMerged =
    !isSubBoard &&
    board?.dividedBoards &&
    board?.dividedBoards?.filter((dividedBoard) => !isEmpty(dividedBoard.submitedAt)).length === 0;

  // Show Alert message if sub board was merged
  const showMessageIfMerged = !!(board?.submitedByUser && board.submitedAt && mainBoardId);

  // Use effect to remove "New Board" indicator
  useEffect(() => {
    if (data?.board?._id === newBoard || mainBoardId === newBoard) {
      setNewBoard(undefined);
    }
  }, [newBoard, data, setNewBoard, mainBoardId]);

  useEffect(() => {
    if (data === null) {
      route.push('/board-deleted');
    }
  }, [data, route]);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleMergeBoard = () => {
    mergeBoard.mutate({ subBoardId: boardId, socketId });
  };

  const handleChangePhase = (phase: string) => {
    if (hasAdminRole) {
      const updateBoardPhase: UpdateBoardPhaseType = {
        boardId,
        phase,
      };
      updateBoardPhaseMutation.mutate(updateBoardPhase);
    }
  };

  const shouldShowLeftSection =
    !showMessageIfMerged &&
    (showButtonToMerge || showMessageHaveSubBoardsMerged || showButtonToVote || showButtonToSubmit);

  const shouldShowRightSection =
    hasAdminRole && !board?.submitedAt && board?.phase !== BoardPhases.SUBMITTED;
  const shouldShowTimer = !board?.submitedAt && board?.phase !== BoardPhases.SUBMITTED;

  if (isEmpty(recoilBoard) || !userId || !socketId || !board) {
    return <LoadingPage />;
  }

  if (isRegularOrPersonalBoard)
    return (
      <RegularBoard
        socketId={socketId}
        emitEvent={emitEvent}
        listenEvent={listenEvent}
        userId={userId}
        userSAdmin={session?.user.isSAdmin}
      />
    );

  return (
    <>
      <BoardHeader />
      <Flex direction="column" align="start" justify="center" css={{ px: '$36' }}>
        <Flex gap={40} align="center" css={{ py: '$32', width: '100%' }} justify="center">
          {shouldShowLeftSection && (
            <Flex gap={40} css={{ flex: 1 }}>
              {showButtonToMerge && (
                <ConfirmationDialog
                  title="Merge board into main board"
                  description="If you merge your sub-team's board into the main board it can not be edited anymore
                afterwards. Are you sure you want to merge it?"
                  confirmationLabel="Merge into main board"
                  confirmationHandler={handleMergeBoard}
                >
                  <Button variant="primaryOutline" size="sm">
                    Merge into main board
                    <Icon name="merge" />
                  </Button>
                </ConfirmationDialog>
              )}

              {showMessageHaveSubBoardsMerged && (
                <AlertBox
                  css={{ flex: 1 }}
                  title="No sub-team has merged into this main board yet."
                  type="info"
                />
              )}
              {showButtonToVote && (
                <ConfirmationDialog
                  title="Start voting phase"
                  description="Are you sure you want to start the voting phase?"
                  confirmationHandler={() => {
                    handleChangePhase(BoardPhases.VOTINGPHASE);
                  }}
                  confirmationLabel="Start Voting"
                >
                  <Button variant="primaryOutline" size="sm">
                    Start voting
                    <Icon name="check" />
                  </Button>
                </ConfirmationDialog>
              )}
              {showButtonToSubmit && (
                <ConfirmationDialog
                  title="Submit"
                  description="If you submit your board it will block the users from voting and it can not be edited
                anymore afterwards. Are you sure you want to submit it?"
                  confirmationHandler={() => {
                    handleChangePhase(BoardPhases.SUBMITTED);
                  }}
                  confirmationLabel="Submit"
                >
                  <Button variant="primaryOutline" size="sm">
                    Submit Board
                    <Icon name="check" />
                  </Button>
                </ConfirmationDialog>
              )}
            </Flex>
          )}

          {!shouldShowLeftSection && !showMessageIfMerged && <Flex css={{ flex: 1 }} />}

          {shouldShowTimer && (
            <Flex
              css={{
                flex: 1,
                justifyContent:
                  ((!shouldShowLeftSection || !shouldShowRightSection) && shouldShowLeftSection) ||
                  (!shouldShowLeftSection && !shouldShowRightSection)
                    ? 'center'
                    : 'normal',
              }}
            >
              <Timer
                boardId={boardId}
                isAdmin={hasAdminRole}
                emitEvent={emitEvent}
                listenEvent={listenEvent}
              />
            </Flex>
          )}
          {shouldShowRightSection && (
            <>
              <Button onClick={handleOpen} variant="primaryOutline">
                <Icon name="settings" />
                Board settings
                <Icon name="arrow-down" />
              </Button>
              {isOpen && (
                <BoardSettings
                  isOpen={isOpen}
                  isOwner={isOwner}
                  isResponsible={isResponsible}
                  isSAdmin={session?.user.isSAdmin}
                  isStakeholderOrAdmin={isStakeholderOrAdmin}
                  setIsOpen={setIsOpen}
                  socketId={socketId}
                />
              )}
            </>
          )}

          {!shouldShowRightSection && !showMessageIfMerged && <Flex css={{ flex: 1 }} />}

          {showMessageIfMerged && (
            <AlertGoToMainBoard mainBoardId={mainBoardId} submitedAt={board.submitedAt as Date} />
          )}
        </Flex>

        <DragDropArea
          board={board}
          socketId={socketId}
          userId={userId}
          hasAdminRole={hasAdminRole}
        />
      </Flex>
    </>
  );
};

export default Board;
