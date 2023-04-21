import React, { useCallback, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';

import CardEnd from '@/components/CardBoard/CardBody/CardEnd';
import CardTitle from '@/components/CardBoard/CardBody/CardTitle';
import CenterMainBoard from '@/components/CardBoard/CardBody/CenterMainBoard';
import CountCards from '@/components/CardBoard/CardBody/CountCards';
import SubBoards from '@/components/CardBoard/CardBody/SubBoards';
import CardIcon from '@/components/CardBoard/CardIcon';
import AvatarGroup from '@/components/Primitives/Avatars/AvatarGroup/AvatarGroup';
import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Box from '@/components/Primitives/Layout/Box/Box';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import Tooltip from '@/components/Primitives/Tooltips/Tooltip/Tooltip';
import { newBoardState } from '@/store/board/atoms/board.atom';
import { styled } from '@/styles/stitches/stitches.config';
import BoardType from '@/types/board/board';
import { Team } from '@/types/team/team';
import { BoardUserRoles } from '@/utils/enums/board.user.roles';

const InnerContainer = styled(Flex, Box, {
  px: '$18',
  backgroundColor: '$white',
  borderRadius: '$12',
  position: 'relative',
  flex: '1 1 0',
  gap: '$12 $24',
  py: '$22',

  '@md': { px: '$32' },

  variants: {
    isSubBoard: {
      true: { py: '$16' },
    },
  },
});

const NewCircleIndicator = styled('div', {
  variants: {
    position: {
      absolute: {
        position: 'absolute',
        left: '$12',
        top: '50%',
        transform: 'translateY(-50%)',
      },
    },
  },
  width: '$8',
  height: '$8',
  borderRadius: '100%',
  backgroundColor: '$successBase',
});

const NewLabelIndicator = styled(Flex, {
  backgroundColor: '$successLightest',
  border: '1px solid $colors$successBase',
  borderRadius: '$pill',
  px: '$8',
  py: '$4',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '$4',

  span: {
    fontSize: '$12',
    lineHeight: '$16',
    textTransform: 'uppercase',
    color: '$successBase',
  },
});

const RecurrentIconContainer = styled('div', {
  minWidth: '$12',
  height: '$12',

  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',

  borderRadius: '$round',

  backgroundColor: '$primary800',
  color: 'white',

  cursor: 'pointer',

  svg: {
    width: '$8',
    height: '$8',
  },
});

type CardBodyProps = {
  userId: string;
  board: BoardType;
  index?: number;
  dividedBoardsCount: number;
  isDashboard: boolean;
  mainBoardId?: string;
  isSAdmin?: boolean;
  socketId?: string;
  mainBoardTitle?: string;
  mainBoardTeam?: Team;
};

const CardBody = React.memo<CardBodyProps>(
  ({
    userId,
    board,
    index,
    isDashboard,
    dividedBoardsCount,
    mainBoardId,
    isSAdmin,
    socketId,
    mainBoardTitle,
    mainBoardTeam,
  }) => {
    const { _id: id, columns, users, team, dividedBoards, isSubBoard } = board;
    const countDividedBoards = dividedBoardsCount || dividedBoards.length;
    const [openSubBoards, setSubBoardsOpen] = useState(false);

    const newBoard = useRecoilValue(newBoardState);

    const isANewBoard = newBoard === board._id;

    const userIsParticipating = useMemo(
      () => !!users.find((user) => user.user?._id === userId),
      [users, userId],
    );

    const havePermissions = useMemo(() => {
      if (isSAdmin) {
        return true;
      }

      let myUser;

      const myUserIsOwnerBoard = board.createdBy?._id === userId;

      const myUserIsBoardResponsible = !!users.find(
        (user) => user.user._id === userId && user.role === BoardUserRoles.RESPONSIBLE,
      );

      if (team || mainBoardTeam) {
        myUser = (mainBoardTeam ?? team).users.find(
          (user) => String(user.user?._id) === String(userId),
        );

        const myUserIsOwnerSubBoard = String(board.createdBy) === userId;
        const owner = myUserIsOwnerBoard || myUserIsOwnerSubBoard;
        if (myUser?.role === 'admin' || myUser?.role === 'stakeholder' || owner) {
          return true;
        }
      }

      return myUserIsOwnerBoard || myUserIsBoardResponsible;
    }, [isSAdmin, board.createdBy, userId, users, team, mainBoardTeam]);

    const renderCardBody = useCallback(
      (subBoard: BoardType, idx: number) => (
        <CardBody
          key={subBoard._id}
          board={subBoard}
          dividedBoardsCount={countDividedBoards}
          index={idx}
          isDashboard={isDashboard}
          isSAdmin={isSAdmin}
          mainBoardId={board._id}
          mainBoardTeam={!isSubBoard ? team : undefined}
          mainBoardTitle={board.title}
          socketId={socketId}
          userId={userId}
        />
      ),
      [
        countDividedBoards,
        isDashboard,
        board._id,
        board.title,
        socketId,
        userId,
        isSAdmin,
        isSubBoard,
        team,
      ],
    );

    const iconLockConditions =
      isSubBoard && !havePermissions && !userIsParticipating && !isDashboard;

    return (
      <Flex css={{ flex: '1 1 0' }} direction="column" gap="8">
        <InnerContainer
          align="center"
          elevation="1"
          isSubBoard={isSubBoard}
          justify="between"
          wrap="wrap"
        >
          {isANewBoard && <NewCircleIndicator position="absolute" />}

          <Flex align="center" gap="8" wrap="wrap">
            <Flex align="center" gap="8">
              {!isSubBoard && (
                <CardIcon
                  board={board}
                  havePermissions={havePermissions}
                  isParticipating={userIsParticipating}
                  toAdd={false}
                />
              )}
              <CardTitle
                boardId={id}
                havePermissions={havePermissions}
                isSubBoard={isSubBoard}
                mainBoardId={mainBoardId}
                mainBoardTitle={mainBoardTitle}
                title={board.title}
                userIsParticipating={userIsParticipating}
              />
              {isSubBoard && (
                <Text color="primary300" css={{ whiteSpace: 'nowrap' }} size="xs">
                  of {dividedBoardsCount}
                </Text>
              )}
              {iconLockConditions && (
                <Icon
                  name="lock"
                  css={{
                    color: '$primary300',
                    width: '17px',
                    height: '$16',
                  }}
                />
              )}
              {board.recurrent && (
                <Tooltip content="Recurrs every month">
                  <RecurrentIconContainer>
                    <Icon name="recurring" />
                  </RecurrentIconContainer>
                </Tooltip>
              )}
              {!isDashboard && isSubBoard && (
                <AvatarGroup
                  css={{ minWidth: '$82' }}
                  listUsers={isSubBoard ? users : team.users}
                  userId={userId}
                />
              )}
              {!isDashboard && !isSubBoard && countDividedBoards > 0 && (
                <CenterMainBoard
                  countDividedBoards={countDividedBoards}
                  handleOpenSubBoards={() => setSubBoardsOpen(!openSubBoards)}
                  openSubBoards={openSubBoards}
                />
              )}
            </Flex>

            {isDashboard && <CountCards columns={columns} />}
            {isANewBoard && (
              <NewLabelIndicator>
                <NewCircleIndicator />
                <span>New Board</span>
              </NewLabelIndicator>
            )}
          </Flex>
          <CardEnd
            board={board}
            havePermissions={havePermissions}
            index={index}
            isDashboard={isDashboard}
            isSubBoard={isSubBoard}
            socketId={socketId}
            userId={userId}
            userIsParticipating={userIsParticipating}
            userSAdmin={isSAdmin}
          />
        </InnerContainer>
        {(openSubBoards || isDashboard) && (
          <SubBoards
            dividedBoards={dividedBoards}
            isDashboard={isDashboard}
            isSubBoard={isSubBoard}
            renderCardBody={renderCardBody}
            userId={userId}
          />
        )}
      </Flex>
    );
  },
);

export default CardBody;
