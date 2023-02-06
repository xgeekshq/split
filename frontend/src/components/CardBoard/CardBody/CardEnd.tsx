import React, { useMemo } from 'react';

import Flex from '@/components/Primitives/Flex';
import Separator from '@/components/Primitives/Separator';
import Text from '@/components/Primitives/Text';
import BoardType from '@/types/board/board';
import AvatarGroup from '@/components/Primitives/AvatarGroup';
import DeleteBoard from '../DeleteBoard';
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

    const boardTypeCaption = useMemo(() => {
      if (isSubBoard && !isDashboard) return 'Responsible';
      if (isSubBoard && isDashboard) return 'Team';
      if (team) return 'Team';
      return 'Personal';
    }, [isDashboard, isSubBoard, team]);

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
              <Separator
                orientation="vertical"
                css={{
                  ml: '$8',
                  backgroundColor: '$primary100',
                  height: '$24 !important',
                }}
              />

              <DeleteBoard boardId={id} boardName={title} socketId={socketId} teamId={team?.id} />
            </Flex>
          )}
        </Flex>
      );
    }
    return null;
  },
);

export default CardEnd;
