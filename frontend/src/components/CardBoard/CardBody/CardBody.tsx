import React, { useCallback, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { styled } from '@/styles/stitches/stitches.config';

import Icon from '@/components/icons/Icon';
import Box from '@/components/Primitives/Box';
import Flex from '@/components/Primitives/Flex';
import Text from '@/components/Primitives/Text';
import Tooltip from '@/components/Primitives/Tooltip';
import { newBoardState } from '@/store/board/atoms/board.atom';
import BoardType from '@/types/board/board';
import ClickEvent from '@/types/events/clickEvent';
import CardAvatars from '../CardAvatars';
import CardIcon from '../CardIcon';
import CardEnd from './CardEnd';
import CardTitle from './CardTitle';
import CenterMainBoard from './CenterMainBoard';
import CountCards from './CountCards';
import LeftArrow from './LeftArrow';
import SubBoards from './SubBoards';

const InnerContainer = styled(Flex, Box, {
  px: '$32',
  backgroundColor: '$white',
  borderRadius: '$12',
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
  width: '$12',
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
};

const CardBody = React.memo<CardBodyProps>(
  ({ userId, board, index, isDashboard, dividedBoardsCount, mainBoardId, isSAdmin, socketId }) => {
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
      const myUser = team.users.find((user) => String(user.user._id) === String(userId));
      const myUserIsOwnerMainBoard = board.createdBy?._id === userId;
      const myUserIsOwnerSubBoard = String(board.createdBy) === userId;
      const owner = myUserIsOwnerMainBoard || myUserIsOwnerSubBoard;
      if (team && (myUser?.role === 'admin' || myUser?.role === 'stakeholder' || owner)) {
        return true;
      }

      return !!users.find((user) => user.role === 'owner');
    }, [isSAdmin, team, userId, users, board.createdBy]);

    const handleOpenSubBoards = (e: ClickEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault();
      setSubBoardsOpen(!openSubBoards);
    };

    const renderCardBody = useCallback(
      (subBoard: BoardType, idx: number) => (
        <CardBody
          key={subBoard._id}
          board={subBoard}
          dividedBoardsCount={countDividedBoards}
          index={idx}
          isDashboard={isDashboard}
          mainBoardId={board._id}
          socketId={socketId}
          userId={userId}
        />
      ),
      [board._id, countDividedBoards, isDashboard, userId, socketId],
    );

    const iconLockConditions =
      isSubBoard && !havePermissions && !userIsParticipating && !isDashboard;

    return (
      <Flex css={{ flex: '1 1 0' }} direction="column" gap="12">
        <Flex>
          {isSubBoard && <LeftArrow index={index} isDashboard={isDashboard} />}

          <InnerContainer
            align="center"
            elevation="1"
            justify="between"
            css={{
              position: 'relative',
              flex: '1 1 0',
              py: !isSubBoard ? '$22' : '$16',
              maxHeight: isSubBoard ? '$64' : '$76',
              ml: isSubBoard ? '$40' : 0,
            }}
          >
            {isANewBoard && <NewCircleIndicator position="absolute" />}
            <Flex align="center">
              <Flex align="center" gap="8">
                {!isSubBoard && (
                  <CardIcon
                    board={board}
                    havePermissions={havePermissions}
                    isParticipating={userIsParticipating}
                    toAdd={false}
                  />
                )}
                <Flex align="center" gap="8">
                  <CardTitle
                    boardId={id}
                    havePermissions={havePermissions}
                    isSubBoard={isSubBoard}
                    mainBoardId={mainBoardId}
                    title={board.title}
                    userIsParticipating={userIsParticipating}
                  />
                  {isSubBoard && (
                    <Text color="primary300" size="xs">
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
                    <CardAvatars
                      listUsers={isSubBoard ? users : team.users}
                      responsible={false}
                      teamAdmins={false}
                      userId={userId}
                    />
                  )}
                  {!isDashboard && !isSubBoard && countDividedBoards > 0 && (
                    <CenterMainBoard
                      countDividedBoards={countDividedBoards}
                      handleOpenSubBoards={handleOpenSubBoards}
                      openSubBoards={openSubBoards}
                    />
                  )}
                </Flex>
              </Flex>
              {isDashboard && <CountCards columns={columns} />}
            </Flex>
            {isANewBoard && (
              <NewLabelIndicator>
                <NewCircleIndicator />
                <span>New Board</span>
              </NewLabelIndicator>
            )}
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
        </Flex>
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
