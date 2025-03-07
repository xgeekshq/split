import React, { useMemo } from 'react';

import CountCards from '@/components/CardBoard/CardBody/CountCards';
import DuplicateBoardNameDialog from '@/components/CardBoard/CardBody/DuplicateBoardNameDialog';
import ConfirmationDialog from '@/components/Primitives/Alerts/ConfirmationDialog/ConfirmationDialog';
import AvatarGroup from '@/components/Primitives/Avatars/AvatarGroup/AvatarGroup';
import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Button from '@/components/Primitives/Inputs/Button/Button';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Separator from '@/components/Primitives/Separator/Separator';
import Text from '@/components/Primitives/Text/Text';
import useBoard from '@/hooks/useBoard';
import BoardType from '@/types/board/board';
import isEmpty from '@/utils/isEmpty';

export type CardEndProps = {
  board: BoardType;
  isDashboard: boolean;
  isSubBoard: boolean | undefined;
  index: number | undefined;
  havePermissions: boolean;
  userId: string;
  userSAdmin?: boolean;
  userIsParticipating: boolean;
  socketId?: string;
};

const CardEnd: React.FC<CardEndProps> = React.memo(
  ({
    board,
    isDashboard,
    isSubBoard,
    index,
    havePermissions,
    userId,
    userSAdmin = undefined,
    socketId,
  }) => {
    const { _id: id, title, columns, users, team, createdBy } = board;

    const {
      deleteBoard,
      duplicateBoard: { mutate: duplicateMutation },
    } = useBoard();

    const boardTypeCaption = useMemo(() => {
      if (isSubBoard && !isDashboard) return 'Responsible';
      if (isSubBoard && isDashboard) return 'Team';
      if (team) return 'Team';
      return 'Personal';
    }, [isDashboard, isSubBoard, team]);

    const deleteBoardDescription = (
      <Text>
        Do you really want to delete the board <Text fontWeight="bold">{title}</Text>?
      </Text>
    );

    const boardOwnerName = useMemo(() => {
      if (team && !isSubBoard) {
        return team?.name;
      }
      if (isSubBoard && isDashboard && index !== undefined) {
        return `sub-team ${index + 1}`;
      }
      if (isSubBoard && !isDashboard) {
        return users.find((user) => user.role === 'responsible')?.user.firstName;
      }

      return createdBy?.firstName;
    }, [team, isSubBoard, isDashboard, createdBy?.firstName, index, users]);

    const handleDelete = () => {
      if (team?.id) {
        deleteBoard.mutate({ id, socketId, teamId: team?.id });
      } else {
        deleteBoard.mutate({ id });
      }
    };

    const handleDuplicateBoard = (boardTitle: string) => {
      duplicateMutation({ boardId: board._id, boardTitle });
    };

    if (isDashboard) {
      return (
        <Flex align="center" css={{ flex: 1 }} gap="8" justify="end" wrap="wrap">
          <Text color="primary300" size="sm">
            {boardTypeCaption}
          </Text>
          <Separator orientation="vertical" size="lg" />
          <Text color="primary800" fontWeight="medium" size="sm">
            {boardOwnerName}
          </Text>
          <AvatarGroup listUsers={!team || isSubBoard ? users : team.users} userId={userId} />
        </Flex>
      );
    }

    if (!isDashboard) {
      return (
        <Flex align="center" css={{ flex: 1, gap: '$12 $24' }} justify="end" wrap="wrap">
          {isSubBoard && (
            <Flex align="center" gap="8">
              <Text color="primary300" size="sm">
                Responsible
              </Text>
              <AvatarGroup responsible listUsers={users} userId={userId} />
            </Flex>
          )}

          <Flex align="center" gap="24">
            <CountCards columns={columns} />
            {(havePermissions || userSAdmin) && !isSubBoard && (
              <>
                <Separator orientation="vertical" size="lg" />
                {isEmpty(board.dividedBoards) && (
                  <DuplicateBoardNameDialog
                    boardTitle={title}
                    handleDuplicateBoard={handleDuplicateBoard}
                  />
                )}
                <ConfirmationDialog
                  confirmationHandler={handleDelete}
                  confirmationLabel="Delete"
                  description={deleteBoardDescription}
                  title="Delete board"
                  tooltip="Delete board"
                  variant="danger"
                >
                  <Button isIcon size="sm">
                    <Icon css={{ color: '$primary400' }} name="trash-alt" />
                  </Button>
                </ConfirmationDialog>
              </>
            )}
          </Flex>
        </Flex>
      );
    }
    return null;
  },
);

export default CardEnd;
