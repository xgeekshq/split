import React, { useCallback, useMemo, useState } from 'react';

import { ListBoardMembers } from '@/components/Boards/MyBoards/ListBoardMembers';
import Avatar from '@/components/Primitives/Avatar';
import Flex from '@/components/Primitives/Flex';
import Tooltip from '@/components/Primitives/Tooltip';
import { User } from '@/types/user/user';
import { BoardUserRoles } from '@/utils/enums/board.user.roles';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';
import { IconButton } from './styles';

type ListUsersType = {
  user: User | string;
  role: TeamUserRoles | BoardUserRoles;
  _id?: string;
};

type CardAvatarProps = {
  listUsers: ListUsersType[];
  responsible: boolean;
  teamAdmins: boolean;
  stakeholders?: boolean;
  userId: string;
  myBoards?: boolean;
  haveError?: boolean;
  isBoardsPage?: boolean;
};

const CardAvatars = React.memo<CardAvatarProps>(
  ({
    listUsers,
    teamAdmins,
    stakeholders,
    userId,
    haveError,
    responsible,
    myBoards,
    isBoardsPage,
  }) => {
    const [dialogIsOpen, setDialogIsOpen] = useState(false);
    const [viewAllUsers, setViewAllUsers] = useState(false);

    const handleViewAllUsers = useCallback(() => {
      setViewAllUsers(!viewAllUsers);
    }, [viewAllUsers]);

    const handleOpenDialog = useCallback(() => {
      setDialogIsOpen(!dialogIsOpen);
    }, [dialogIsOpen]);

    const data = useMemo(() => {
      if (responsible)
        return listUsers
          .filter((user) => user.role === BoardUserRoles.RESPONSIBLE)
          .map((user) => user.user);

      if (teamAdmins)
        return listUsers
          .filter((user) => user.role === TeamUserRoles.ADMIN)
          .map((user) => user.user);

      if (stakeholders) {
        return listUsers
          .filter((user) => user.role === TeamUserRoles.STAKEHOLDER)
          .map((user) => user.user);
      }

      return listUsers.reduce((acc: User[], userFound: ListUsersType) => {
        if ((userFound.user as User)?.id === userId) {
          acc.unshift(userFound.user as User);
        } else {
          acc.push(userFound.user as User);
        }
        return acc;
      }, []);
    }, [listUsers, responsible, teamAdmins, stakeholders, userId]);

    const usersCount = data.length;

    const getInitials = useCallback(
      (user: User | undefined, index) => {
        if (!viewAllUsers && usersCount - 1 > index && index > 1) {
          return `+${usersCount - 2}`;
        }
        return user ?? '--';
      },
      [usersCount, viewAllUsers],
    );

    const stakeholdersColors = useMemo(
      () => ({
        border: true,
        bg: 'white',
        fontColor: '$primary400',
      }),
      [],
    );

    const renderAvatar = useCallback(
      (value: User | string, avatarColor, idx) => {
        if (typeof value === 'string') {
          return (
            <IconButton
              key={`${value}-${idx}-${Math.random()}`}
              aria-hidden="true"
              disabled={!isBoardsPage}
              type="button"
              css={{
                '&:hover': isBoardsPage
                  ? {
                      cursor: 'pointer',
                    }
                  : 'none',
              }}
              onClick={isBoardsPage ? handleOpenDialog : handleViewAllUsers}
            >
              <Avatar
                key={`${value}-${idx}-${Math.random()}`}
                colors={avatarColor}
                css={{ position: 'relative', ml: idx > 0 ? '-7px' : 0 }}
                fallbackText={value}
                id={value}
                isDefaultColor={value === userId}
                size={32}
              />
            </IconButton>
          );
        }

        const initials = `${value.firstName[0]}${value.lastName[0]}`;
        return (
          <Tooltip
            key={`${value}-${idx}-${Math.random()}`}
            content={`${value.firstName} ${value.lastName}`}
          >
            <IconButton
              aria-hidden="true"
              disabled={!isBoardsPage}
              type="button"
              css={{
                '&:hover': isBoardsPage
                  ? {
                      cursor: 'pointer',
                    }
                  : 'none',
              }}
              onClick={isBoardsPage ? handleOpenDialog : handleViewAllUsers}
            >
              <Avatar
                key={`${value}-${idx}-${Math.random()}`}
                colors={avatarColor}
                css={{ position: 'relative', ml: idx > 0 ? '-7px' : 0 }}
                fallbackText={initials}
                id={value.id}
                isDefaultColor={value.id === userId}
                size={32}
              />
            </IconButton>
          </Tooltip>
        );
      },
      [handleViewAllUsers, handleOpenDialog, userId, isBoardsPage],
    );

    const numberOfAvatars = useMemo(() => {
      if (!myBoards) {
        return 3;
      }

      return 1;
    }, [myBoards]);

    const boardMembers = useMemo(
      () =>
        listUsers.map((member) => ({
          ...member,
          user: member.user as User,
        })),
      [listUsers],
    );

    return (
      <>
        <ListBoardMembers
          boardMembers={boardMembers}
          isOpen={dialogIsOpen}
          setIsOpen={setDialogIsOpen}
        />
        <Flex align="center" css={{ height: 'fit-content', overflow: 'hidden' }}>
          {haveError
            ? ['-', '-', '-'].map((value, index) =>
                renderAvatar(value, stakeholders ? stakeholdersColors : undefined, index),
              )
            : (data.slice(0, numberOfAvatars) as User[]).map((user: User, index: number) =>
                renderAvatar(
                  getInitials(user, index),
                  stakeholders ? stakeholdersColors : undefined,
                  index,
                ),
              )}
        </Flex>
      </>
    );
  },
);

export default CardAvatars;
