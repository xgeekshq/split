import React, { useEffect, useMemo, useState } from 'react';
import { dehydrate, QueryClient } from 'react-query';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { Container } from '@/styles/pages/boards/board.styles';

import { getBoardRequest } from '@/api/boardService';
import AlertGoToMainBoard from '@/components/Board/AlertGoToMainBoard';
import AlertMergeIntoMain from '@/components/Board/AlertMergeIntoMain';
import DragDropArea from '@/components/Board/DragDropArea';
import BoardHeader from '@/components/Board/Header';
import { BoardSettings } from '@/components/Board/Settings';
import LoadingPage from '@/components/loadings/LoadingPage';
import AlertBox from '@/components/Primitives/AlertBox';
import Flex from '@/components/Primitives/Flex';
import useBoard from '@/hooks/useBoard';
import { useSocketIO } from '@/hooks/useSocketIO';
import { boardInfoState, newBoardState } from '@/store/board/atoms/board.atom';
import { BoardUserRoles } from '@/utils/enums/board.user.roles';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';
import isEmpty from '@/utils/isEmpty';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const boardId = String(context.query.boardId);
  const queryClient = new QueryClient();
  try {
    await queryClient.fetchQuery(['board', { id: boardId }], () =>
      getBoardRequest(boardId, context),
    );
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
  const setBoard = useSetRecoilState(boardInfoState);

  // Session Details
  const { data: session } = useSession({ required: true });
  const userId = session?.user?.id;

  // Hooks
  const {
    fetchBoard: { data },
  } = useBoard({
    autoFetchBoard: true,
  });
  const mainBoard = data?.mainBoardData;
  const board = data?.board;
  const isSubBoard = board?.isSubBoard;
  const route = useRouter();

  // Socket IO Hook
  const socketId = useSocketIO(boardId);

  // Board Settings permissions
  const isStakeholderOrAdmin = useMemo(
    () =>
      (!isSubBoard ? board : mainBoard)?.team.users.some(
        (boardUser) =>
          [TeamUserRoles.STAKEHOLDER, TeamUserRoles.ADMIN].includes(boardUser.role) &&
          boardUser.user._id === userId,
      ),
    [board, isSubBoard, mainBoard, userId],
  );

  const [isResponsible, isOwner] = useMemo(
    () =>
      board
        ? [
            board.users.some(
              (boardUser) =>
                boardUser.role === BoardUserRoles.RESPONSIBLE && boardUser.user._id === userId,
            ),
            board.createdBy._id === userId,
          ]
        : [false, false],
    [board, userId],
  );

  // Show button in sub boards to merge into main
  const showButtonToMerge = !!(isSubBoard && !board?.submitedByUser && isResponsible);

  // Show board settings button if current user is allowed to edit
  const isResponsibleInSubBoard = isSubBoard && isResponsible;
  const hasAdminRole =
    isStakeholderOrAdmin || session?.user.isSAdmin || isOwner || isResponsibleInSubBoard;

  // Show Alert message if any sub-board wasn't merged
  const showMessageHaveSubBoardsMerged =
    !isSubBoard &&
    board?.dividedBoards &&
    board?.dividedBoards?.filter((dividedBoard) => !isEmpty(dividedBoard.submitedAt)).length === 0;

  // Show Alert message if sub board was merged
  const showMessageIfMerged = !!(board?.submitedByUser && board.submitedAt && mainBoardId);

  // Use effect to set recoil state using data from API
  useEffect(() => {
    if (data) {
      setBoard(data);
    }
  }, [data, setBoard]);

  // Use effect to remove "New Board" indicator
  useEffect(() => {
    if (data?.board?._id === newBoard?._id || mainBoard?._id === newBoard?._id) {
      setNewBoard(undefined);
    }
  }, [newBoard, data, setNewBoard, mainBoard?._id]);

  const userIsInBoard = useMemo(
    () => board?.users.find((user) => user.user._id === userId),
    [board?.users, userId],
  );

  useEffect(() => {
    if (data === null) {
      route.push('/board-deleted');
    }
  }, [data, route]);

  if (!userIsInBoard && !hasAdminRole) return <LoadingPage />;
  return board && userId && socketId ? (
    <>
      <BoardHeader />
      <Container direction="column">
        <Flex align="center" css={{ py: '$32', width: '100%' }} gap={40} justify="between">
          {showButtonToMerge ? <AlertMergeIntoMain boardId={boardId} socketId={socketId} /> : null}

          {showMessageHaveSubBoardsMerged ? (
            <AlertBox
              css={{ flex: 1 }}
              title="No sub-team has merged into this main board yet."
              type="info"
            />
          ) : null}

          {hasAdminRole && !board?.submitedAt ? (
            <BoardSettings
              isOpen={isOpen}
              isOwner={isOwner}
              isResponsible={isResponsible}
              isSAdmin={session?.user.isSAdmin}
              isStakeholderOrAdmin={isStakeholderOrAdmin}
              setIsOpen={setIsOpen}
              socketId={socketId}
            />
          ) : null}

          {showMessageIfMerged ? (
            <AlertGoToMainBoard mainBoardId={mainBoardId} submitedAt={board.submitedAt as Date} />
          ) : null}
        </Flex>

        <DragDropArea board={board} socketId={socketId} userId={userId} />
      </Container>
    </>
  ) : (
    <LoadingPage />
  );
};

export default Board;
