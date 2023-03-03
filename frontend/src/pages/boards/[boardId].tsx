import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSideProps, NextPage } from 'next';
import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { Container } from '@/styles/pages/boards/board.styles';
import { getBoardRequest, getPublicStatusRequest } from '@/api/boardService';
import DragDropArea from '@/components/Board/DragDropArea';
import RegularBoard from '@/components/Board/RegularBoard';
import { BoardSettings } from '@/components/Board/Settings';
import AlertGoToMainBoard from '@/components/Board/SplitBoard/AlertGoToMainBoard';
import AlertMergeIntoMain from '@/components/Board/SplitBoard/AlertMergeIntoMain';
import BoardHeader from '@/components/Board/SplitBoard/Header';
import Timer from '@/components/Board/Timer';
import Icon from '@/components/Primitives/Icon';
import LoadingPage from '@/components/Primitives/Loading/Page';
import AlertBox from '@/components/Primitives/AlertBox';
import Button from '@/components/Primitives/Button';
import Flex from '@/components/Primitives/Flex';
import useBoard from '@/hooks/useBoard';
import { useSocketIO } from '@/hooks/useSocketIO';
import {
  boardInfoState,
  boardParticipantsState,
  deletedColumnsState,
  editColumnsState,
  newBoardState,
} from '@/store/board/atoms/board.atom';
import { GetBoardResponse } from '@/types/board/board';
import { BoardUserRoles } from '@/utils/enums/board.user.roles';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';
import isEmpty from '@/utils/isEmpty';
import { GuestUser } from '@/types/user/user';
import { setCookie } from 'cookies-next';
import { DASHBOARD_ROUTE } from '@/utils/routes';
import { GUEST_USER_COOKIE } from '@/utils/constants';
import { getGuestUserCookies } from '@/utils/getGuestUserCookies';
import fetchData from '@/utils/fetchData';
import AlertVotingPhase from '@/components/Board/SplitBoard/AlertVotePhase';
import { BoardPhases } from '@/utils/enums/board.phases';

import AlertSubmitPhase from '@/components/Board/SplitBoard/AlertSubmitPhase';
import { sortParticipantsList } from './[boardId]/participants';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const boardId = String(context.query.boardId);
  const { req, res } = context;
  const queryClient = new QueryClient();

  const session = await getSession(context);

  if (boardId.includes('.map'))
    return {
      props: {},
    };

  // Verifies if the board is public
  await queryClient.fetchQuery(['statusPublic', boardId], () =>
    getPublicStatusRequest(boardId, context),
  );

  const isPublic = queryClient.getQueryData<boolean>(['statusPublic', boardId]);

  // if not public, get board from protected endpoint
  if (session || !isPublic) {
    try {
      await queryClient.fetchQuery(['board', { id: boardId }], () =>
        getBoardRequest(boardId, context),
      );

      const data = queryClient.getQueryData<GetBoardResponse>(['board', { id: boardId }]);
      const boardUser = data?.board?.users.find((user) => user.user?._id === session?.user.id);

      const teamUserFound = data?.board.team?.users.find(
        (teamUser) => teamUser.user?._id === session?.user.id,
      );

      if (
        !(
          (
            (teamUserFound &&
              [TeamUserRoles.ADMIN, TeamUserRoles.STAKEHOLDER].includes(teamUserFound?.role)) || // check if team user is admin or stakeholder
            boardUser || // check if it is a board user
            session?.user.isSAdmin
          ) // check if it is super admin
        ) // if it has none of these roles, user cant access the board
      ) {
        throw Error();
      }
    } catch (e) {
      return {
        redirect: {
          permanent: false,
          destination: DASHBOARD_ROUTE,
        },
      };
    }
  }

  // if board is public

  // check if there are cookies and if the cookies have the board the user is trying to access
  const cookiesGuestUser: GuestUser | { user: string } = getGuestUserCookies({ req, res }, true);

  if (!session) {
    // if there isn´t cookies, the guest user is registered
    if (!cookiesGuestUser) {
      return {
        redirect: {
          permanent: false,
          destination: `/login-guest-user/${boardId}`,
        },
      };
    }

    // if the user doesn't have access to the board, he is added as a board user
    try {
      const data = await fetchData<GuestUser>('/auth/loginGuest', {
        isPublicRequest: true,
        method: 'POST',
        data: {
          user: cookiesGuestUser.user,
          board: boardId,
        },
      });

      if (data) {
        setCookie(GUEST_USER_COOKIE, data, { req, res });
      }
    } catch (error) {
      return {
        redirect: {
          permanent: false,
          destination: '/dashboard',
        },
      };
    }
  }

  await queryClient.fetchQuery(['board', { id: boardId }], () => getBoardRequest(boardId, context));

  return {
    props: {
      key: boardId,
      dehydratedState: dehydrate(queryClient),
      mainBoardId: context.query.mainBoardId ?? null,
      boardId,
    },
  };
};

type Props = {
  boardId: string;
  mainBoardId?: string;
};

const Board: NextPage<Props> = ({ boardId, mainBoardId }) => {
  // States
  // State or open and close Board Settings Dialog
  const [isOpen, setIsOpen] = useState(false);

  // Recoil States
  const [newBoard, setNewBoard] = useRecoilState(newBoardState);
  const [recoilBoard, setRecoilBoard] = useRecoilState(boardInfoState);
  const setBoardParticipants = useSetRecoilState(boardParticipantsState);
  const setEditColumns = useSetRecoilState(editColumnsState);
  const setDeletedColumns = useSetRecoilState(deletedColumnsState);

  // Session Details
  const { data: session } = useSession({ required: false });

  const guestUserCookies = getGuestUserCookies();

  const userId: string | undefined =
    !session && guestUserCookies ? guestUserCookies.user : session?.user?.id;

  // Hooks
  const {
    fetchBoard: { data },
  } = useBoard({
    autoFetchBoard: true,
  });

  const board = data?.board;
  const isSubBoard = board?.isSubBoard;
  const route = useRouter();

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

  // Show button in main board to start voting if is Admin
  const showButtonToVote = !!(
    board?.dividedBoards?.filter((dividedBoard) => !isEmpty(dividedBoard.submitedAt)).length ===
      board?.dividedBoards?.length &&
    board?.phase === BoardPhases.ADDCARDS &&
    !isSubBoard &&
    hasAdminRole
  );
  const showButtonToSubmit = !!(
    board?.dividedBoards?.filter((dividedBoard) => !isEmpty(dividedBoard.submitedAt)).length ===
      board?.dividedBoards?.length &&
    board?.phase === BoardPhases.VOTINGPHASE &&
    !isSubBoard &&
    hasAdminRole
  );

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
      <Container direction="column">
        <Flex gap={40} align="center" css={{ py: '$32', width: '100%' }} justify="center">
          {shouldShowLeftSection && (
            <Flex gap={40} css={{ flex: 1 }}>
              {showButtonToMerge && <AlertMergeIntoMain boardId={boardId} socketId={socketId} />}

              {showMessageHaveSubBoardsMerged && (
                <AlertBox
                  css={{ flex: 1 }}
                  title="No sub-team has merged into this main board yet."
                  type="info"
                />
              )}
              {showButtonToVote && (
                <AlertVotingPhase boardId={boardId} isAdmin={hasAdminRole} emitEvent={emitEvent} />
              )}
              {showButtonToSubmit && <AlertSubmitPhase boardId={boardId} isAdmin={hasAdminRole} />}
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
      </Container>
    </>
  );
};

export default Board;
