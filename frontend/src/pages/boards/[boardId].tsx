import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSideProps, NextPage } from 'next';
import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { Container } from '@/styles/pages/boards/board.styles';
import { getBoardRequest, getPublicBoardRequest, getPublicStatusRequest } from '@/api/boardService';
import DragDropArea from '@/components/Board/DragDropArea';
import RegularBoard from '@/components/Board/RegularBoard';
import { BoardSettings } from '@/components/Board/Settings';
import AlertGoToMainBoard from '@/components/Board/SplitBoard/AlertGoToMainBoard';
import AlertMergeIntoMain from '@/components/Board/SplitBoard/AlertMergeIntoMain';
import BoardHeader from '@/components/Board/SplitBoard/Header';
import Timer from '@/components/Board/Timer';
import Icon from '@/components/icons/Icon';
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
import { getGuestUserCookies } from '@/hooks/useUser';
import axios from 'axios';
import { setCookie } from 'cookies-next';
import { DASHBOARD_ROUTE } from '@/utils/routes';
import { GUEST_USER_COOKIE } from '@/utils/constants';
import { sortParticipantsList } from './[boardId]/participants';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const boardId = String(context.query.boardId);
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

  // if not public, get board from private endpoint
  if (!isPublic) {
    try {
      await queryClient.fetchQuery(['board', { id: boardId }], () =>
        getBoardRequest(boardId, context),
      );

      const data = queryClient.getQueryData<GetBoardResponse>(['board', { id: boardId }]);
      const boardUser = data?.board?.users.find((user) => user.user?._id === session?.user.id);

      const userFound = data?.board.users.find(
        (teamUser) => teamUser.user?._id === session?.user.id,
      );

      const teamUserFound = data?.board.team?.users.find(
        (teamUser) => teamUser.user?._id === session?.user.id,
      );

      if (
        !boardUser &&
        !(
          [teamUserFound?.role, userFound?.role].includes(TeamUserRoles.STAKEHOLDER) ||
          [teamUserFound?.role, userFound?.role].includes(TeamUserRoles.ADMIN)
        ) &&
        !session?.user.isSAdmin
      ) {
        throw Error();
      }
    } catch (e) {
      return {
        redirect: {
          permanent: false,
          destination: '/dashboard',
        },
      };
    }
  }
  const { req, res } = context;

  // if public

  // check if there are cookies and if the cookies have the board he's trying to access

  const cookiesGuestUser: GuestUser[] = getGuestUserCookies({ req, res }, true);

  if (!session) {
    if (!cookiesGuestUser) {
      return {
        redirect: {
          permanent: false,
          destination: `/login-guest-user/${boardId}`,
        },
      };
    }

    let guestUserHasCurrentBoard = cookiesGuestUser.find((cookie) => cookie.board === boardId);

    if (!guestUserHasCurrentBoard) {
      try {
        const { data } = await axios.post('http://localhost:3200/auth/loginGuest', {
          user: cookiesGuestUser[0].user,
          board: boardId,
        });

        if (data) {
          const guestUserCookieArray = getGuestUserCookies({ req, res }, true);
          guestUserCookieArray.push(data);
          setCookie(GUEST_USER_COOKIE, guestUserCookieArray, { req, res });
          guestUserHasCurrentBoard = data;
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

    if (!guestUserHasCurrentBoard) {
      return {
        redirect: {
          permanent: false,
          destination: DASHBOARD_ROUTE,
        },
      };
    }

    const { board, user } = guestUserHasCurrentBoard;

    await queryClient.fetchQuery(['board', { id: board }], () =>
      getPublicBoardRequest({ boardId: board, userId: user }, context),
    );
  }

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
    !session && guestUserCookies ? guestUserCookies[0].user : session?.user?.id;

  // Hooks
  const {
    fetchBasedBoard: { data },
  } = useBoard({
    autoFetchBoard: !!userId,
  });

  const board = data?.board;
  const isSubBoard = board?.isSubBoard;
  const route = useRouter();

  const isPersonalBoard = !data?.board.team; // personal boards don't have teams

  // // regular boards have teams but no subboards (divided boards)
  const isRegularOrPersonalBoard =
    (!data?.board.isSubBoard && !!data?.board.team && !data?.board.dividedBoards.length) ||
    !data?.board.team;

  // // Socket IO Hook
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
        <Flex gap={40} align="center" css={{ py: '$32', width: '100%' }} justify="between">
          {!showMessageIfMerged && (
            <Flex gap={40} css={{ flex: 1 }}>
              {showButtonToMerge && <AlertMergeIntoMain boardId={boardId} socketId={socketId} />}

              {showMessageHaveSubBoardsMerged && (
                <AlertBox
                  css={{ flex: 1 }}
                  title="No sub-team has merged into this main board yet."
                  type="info"
                />
              )}
            </Flex>
          )}

          {!board?.submitedAt && (
            <Flex css={{ flex: 1 }}>
              <Timer
                boardId={boardId}
                isAdmin={hasAdminRole}
                emitEvent={emitEvent}
                listenEvent={listenEvent}
              />
            </Flex>
          )}

          {hasAdminRole && !board?.submitedAt && (
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

          {showMessageIfMerged ? (
            <AlertGoToMainBoard mainBoardId={mainBoardId} submitedAt={board.submitedAt as Date} />
          ) : null}
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
