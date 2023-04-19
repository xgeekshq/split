import { useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';

import DragDropArea from '@/components/Board/DragDropArea';
import RegularBoardHeader from '@/components/Board/RegularBoard/RegularHeader';
import { BoardSettings } from '@/components/Board/Settings';
import Timer from '@/components/Board/Timer';
import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Button from '@/components/Primitives/Inputs/Button/Button';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import LoadingPage from '@/components/Primitives/Loading/Page/Page';
import { BoardUserRoles } from '@/enums/boards/userRoles';
import { boardInfoState } from '@/store/board/atoms/board.atom';
import { EmitEvent } from '@/types/events/emit-event.type';
import { ListenEvent } from '@/types/events/listen-event.type';

type RegularBoardProps = {
  socketId?: string;
  listenEvent: ListenEvent;
  emitEvent: EmitEvent;
  userId: string;
  userSAdmin?: boolean;
};

const RegularBoard = ({
  socketId,
  emitEvent,
  listenEvent,
  userId,
  userSAdmin,
}: RegularBoardProps) => {
  // States
  // State or open and close Board Settings Dialog
  const [isOpen, setIsOpen] = useState(false);

  // Recoil States
  const { board } = useRecoilValue(boardInfoState);

  // Board Settings permissions
  const isStakeholderOrAdmin = useMemo(
    () =>
      board.users.some(
        (boardUser) =>
          [BoardUserRoles.STAKEHOLDER, BoardUserRoles.RESPONSIBLE].includes(boardUser.role) &&
          boardUser.user._id === userId,
      ),
    [board.users, userId],
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
  const hasAdminRole = isStakeholderOrAdmin || userSAdmin || isOwner || isResponsible;

  const shouldRenderBoardSettings = hasAdminRole && !board?.submitedAt;

  const userIsInBoard = useMemo(
    () => board.users.find((user) => user.user._id === userId),
    [board.users, userId],
  );

  const handleOpen = () => {
    setIsOpen(true);
  };

  if ((!userIsInBoard && !hasAdminRole) || !board || !userId || !socketId) return <LoadingPage />;
  return board && userId && socketId ? (
    <>
      <RegularBoardHeader />
      <Flex align="start" css={{ px: '$36' }} direction="column" justify="center">
        <Flex align="center" css={{ py: '$32', width: '100%' }} gap={40} justify="end">
          {shouldRenderBoardSettings && <Flex css={{ flex: 1 }} />}
          {!board?.submitedAt && (
            <Flex
              css={{
                flex: 1,
                justifyContent: shouldRenderBoardSettings ? 'normal' : 'center',
              }}
            >
              <Timer
                boardId={board._id}
                emitEvent={emitEvent}
                isAdmin={hasAdminRole}
                listenEvent={listenEvent}
              />
            </Flex>
          )}
          {shouldRenderBoardSettings && (
            <>
              <Button onClick={handleOpen} variant="primaryOutline">
                <Icon name="settings" />
                Board settings
                <Icon name="arrow-down" />
              </Button>
              {isOpen && (
                <BoardSettings
                  isRegularBoard
                  isOpen={isOpen}
                  isOwner={isOwner}
                  isResponsible={isResponsible}
                  isSAdmin={userSAdmin}
                  isStakeholderOrAdmin={isStakeholderOrAdmin}
                  setIsOpen={setIsOpen}
                  socketId={socketId}
                />
              )}
            </>
          )}
        </Flex>
        <DragDropArea
          isRegularBoard
          board={board}
          hasAdminRole={hasAdminRole}
          socketId={socketId}
          userId={userId}
        />
      </Flex>
    </>
  ) : (
    <LoadingPage />
  );
};

export default RegularBoard;
