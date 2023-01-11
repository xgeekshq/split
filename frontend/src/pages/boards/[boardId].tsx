import React, { useEffect, useMemo, useState } from 'react';
import { dehydrate, QueryClient } from 'react-query';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { getSession, useSession } from 'next-auth/react';
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
import Button from '@/components/Primitives/Button';
import Icon from '@/components/icons/Icon';
import { GetBoardResponse } from '@/types/board/board';

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
    const boardUser = data?.board?.users.find((user) => user.user._id === session?.user.id);

    const teamUserFound = data?.board.team.users.find(
      (teamUser) => teamUser.user._id === session?.user.id,
    );

    if (
      !boardUser &&
      teamUserFound?.role !== TeamUserRoles.STAKEHOLDER &&
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
  const setBoard = useSetRecoilState(boardInfoState);

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

  // Socket IO Hook
  const socketId = useSocketIO(boardId);

  // Board Settings permissions
  const isStakeholderOrAdmin = useMemo(
    () =>
      board?.team.users.some(
        (boardUser) =>
          [TeamUserRoles.STAKEHOLDER, TeamUserRoles.ADMIN].includes(boardUser.role) &&
          boardUser.user._id === userId,
      ),
    [board, userId],
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

  // Use effect to set recoil state using data from API
  useEffect(() => {
    if (data) {
      setBoard(data);
    }
  }, [data, setBoard]);

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

        <DragDropArea board={board} socketId={socketId} userId={userId} />
      </Container>
    </>
  ) : (
    <LoadingPage />
  );
};

export default Board;
