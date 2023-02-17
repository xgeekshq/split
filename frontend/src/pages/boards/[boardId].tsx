import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSideProps, NextPage } from 'next';
import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { Container } from '@/styles/pages/boards/board.styles';

import { getBoardRequest } from '@/api/boardService';
import DragDropArea from '@/components/Board/DragDropArea';
import RegularBoard from '@/components/Board/RegularBoard';
import { BoardSettings } from '@/components/Board/Settings';
import AlertGoToMainBoard from '@/components/Board/SplitBoard/AlertGoToMainBoard';
import AlertMergeIntoMain from '@/components/Board/SplitBoard/AlertMergeIntoMain';
import BoardHeader from '@/components/Board/SplitBoard/Header';
import Timer from '@/components/Board/Timer';
import Icon from '@/components/icons/Icon';
import LoadingPage from '@/components/loadings/LoadingPage';
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
import AlertVotingPhase from '@/components/Board/SplitBoard/AlertVotePhase';
import { sortParticipantsList } from './[boardId]/participants';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const boardId = String(context.query.boardId);
  const queryClient = new QueryClient();

  const session = await getSession(context);

  if (boardId.includes('.map'))
    return {
      props: {},
    };

  try {
    await queryClient.fetchQuery(['board', { id: boardId }], () =>
      getBoardRequest(boardId, context),
    );

    const data = queryClient.getQueryData<GetBoardResponse>(['board', { id: boardId }]);
    const boardUser = data?.board?.users.find((user) => user.user?._id === session?.user.id);

    const userFound = data?.board.users.find((teamUser) => teamUser.user?._id === session?.user.id);

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
  const { data: session } = useSession();
  const userId = session?.user?.id;

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
  }, [
    data,
    session?.user.id,
    setDeletedColumns,
    setEditColumns,
    setBoardParticipants,
    setRecoilBoard,
  ]);

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
    !isSubBoard &&
    hasAdminRole &&
    !board?.submitedByUser &&
    (board?.columns[0].cards.length ||
      board?.columns[1].cards.length ||
      board?.columns[2].cards.length)
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

  // Use effect to recieve value from websocket
  /* useEffect(() => {
    listenEvent('board-voting.user.started', (_payload) => {
      //console.log('websocker do servidor');
      //console.log(payload);
    });
  }, []); */

  const handleOpen = () => {
    setIsOpen(true);
  };

  if (!recoilBoard) return <LoadingPage />;

  if (isRegularOrPersonalBoard)
    return <RegularBoard socketId={socketId} emitEvent={emitEvent} listenEvent={listenEvent} />;

  return board && userId && socketId ? (
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
              {showButtonToVote && (
                <AlertVotingPhase boardId={boardId} isAdmin={hasAdminRole} emitEvent={emitEvent} />
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
  ) : (
    <LoadingPage />
  );
};

export default Board;
