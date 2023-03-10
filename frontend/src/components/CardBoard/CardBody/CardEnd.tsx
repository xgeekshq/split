import React, { useMemo } from 'react';

import Flex from '@/components/Primitives/Layout/Flex';
import Separator from '@/components/Primitives/Separator';
import Text from '@/components/Primitives/Text';
import BoardType from '@/types/board/board';
import AvatarGroup from '@/components/Primitives/Avatars/AvatarGroup/AvatarGroup';
import ConfirmationDialog from '@/components/Primitives/Alerts/ConfirmationDialog/ConfirmationDialog';
import useBoard from '@/hooks/useBoard';
import Button from '@/components/Primitives/Button/Button';
import Icon from '@/components/Primitives/Icons/Icon/Icon';
import CountCards from './CountCards';

type CardEndProps = {
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
    CardEnd.defaultProps = {
      userSAdmin: undefined,
    };
    const { _id: id, title, columns, users, team, createdBy } = board;

    const { deleteBoard } = useBoard({ autoFetchBoard: false });

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

    if (isDashboard) {
      return (
        <Flex align="center" css={{ justifySelf: 'end' }}>
          <Text color="primary300" size="sm">
            {boardTypeCaption} |
          </Text>
          <Text color="primary800" css={{ mx: '$8' }} size="sm" fontWeight="medium">
            {boardOwnerName}
          </Text>
          <AvatarGroup
            listUsers={!team || isSubBoard ? users : team.users}
            responsible={false}
            teamAdmins={false}
            userId={userId}
          />
        </Flex>
      );
    }

    if (!isDashboard) {
      return (
        <Flex css={{ alignItems: 'center' }}>
          {isSubBoard && (
            <Flex align="center" gap="8">
              <Text color="primary300" size="sm">
                Responsible
              </Text>
              <AvatarGroup responsible listUsers={users} teamAdmins={false} userId={userId} />
            </Flex>
          )}
          <CountCards columns={columns} />
          {(havePermissions || userSAdmin) && !isSubBoard && (
            <Flex align="center" css={{ ml: '$24' }} gap="24">
              <Separator orientation="vertical" size="lg" css={{ ml: '$8' }} />
              <ConfirmationDialog
                title="Delete board"
                description={deleteBoardDescription}
                confirmationHandler={handleDelete}
                confirmationLabel="Delete"
                tooltip="Delete board"
                variant="danger"
              >
                <Button isIcon size="sm">
                  <Icon
                    name="trash-alt"
                    css={{
                      color: '$primary400',
                    }}
                  />
                </Button>
              </ConfirmationDialog>
            </Flex>
          )}
        </Flex>
      );
    }
    return null;
  },
);

export default CardEnd;
