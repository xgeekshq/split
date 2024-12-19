import React, { useCallback, useMemo, useState } from 'react';
import { CSS } from '@stitches/react';

import { ListBoardMembers } from '@/components/Boards/MyBoards/ListBoardMembers';
import Avatar, { AvatarButton, AvatarColor } from '@/components/Primitives/Avatars/Avatar/Avatar';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Tooltip from '@/components/Primitives/Tooltips/Tooltip/Tooltip';
import { BoardUserRoles } from '@/enums/boards/userRoles';
import { TeamUserRoles } from '@/enums/teams/userRoles';
import { User } from '@/types/user/user';
import { getInitials } from '@/utils/getInitials';

export type ListUsersType = {
  user: User | string;
  role: TeamUserRoles | BoardUserRoles;
  _id?: string;
};

export type AvatarGroupProps = {
  listUsers: ListUsersType[];
  responsible?: boolean;
  teamAdmins?: boolean;
  stakeholders?: boolean;
  userId: string | undefined;
  myBoards?: boolean;
  haveError?: boolean;
  isClickable?: boolean;
  hasDrawer?: boolean;
  css?: CSS;
};

const AVATAR_AMOUNT = 3;

const AvatarGroup = ({
  listUsers,
  teamAdmins = false,
  stakeholders = false,
  userId,
  haveError,
  responsible = false,
  myBoards,
  isClickable = false,
  hasDrawer = false,
  css,
}: AvatarGroupProps) => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  const handleOpenDialog = useCallback(() => {
    setDialogIsOpen((prevOpen) => !prevOpen);
  }, [dialogIsOpen]);

  const stakeholdersColors = useMemo(
    () => ({
      border: true,
      bg: 'white',
      fontColor: '$primary400',
    }),
    [],
  );

  const errorColors = useMemo(
    () => ({
      bg: '$dangerLightest',
      fontColor: '$danger700',
    }),
    [],
  );

  const numberOfAvatars = useMemo(() => (!myBoards ? AVATAR_AMOUNT : 1), [myBoards]);

  const boardMembers = useMemo(
    () =>
      listUsers.map((member) => ({
        ...member,
        user: member.user as User,
      })),
    [listUsers],
  );

  // Filters the 'listUsers' array
  const data = useMemo(() => {
    if (responsible)
      return listUsers
        .filter((user) => user.role === BoardUserRoles.RESPONSIBLE)
        .map((user) => user.user);

    if (teamAdmins && stakeholders) {
      return listUsers
        .filter((user) => ![TeamUserRoles.MEMBER, BoardUserRoles.MEMBER].includes(user.role))
        .map((user) => user.user);
    }

    if (teamAdmins)
      return listUsers.filter((user) => user.role === TeamUserRoles.ADMIN).map((user) => user.user);

    if (stakeholders) {
      return listUsers
        .filter((user) => user.role === TeamUserRoles.STAKEHOLDER)
        .map((user) => user.user);
    }

    return listUsers.reduce((acc: User[], userFound: ListUsersType) => {
      if ((userFound.user as User)?._id === userId) {
        acc.unshift(userFound.user as User);
      } else {
        acc.push(userFound.user as User);
      }
      return acc;
    }, []);
  }, [listUsers, responsible, teamAdmins, stakeholders, userId]);

  const usersCount = data.length;

  const getAvatarValue = useCallback(
    (user: User | undefined, index: number) => {
      if (usersCount - 1 > index && index > 1) {
        return `+${usersCount - (AVATAR_AMOUNT - 1)}`;
      }
      return user ?? '--';
    },
    [usersCount],
  );

  const renderAvatarWithButton = useCallback(
    (
      keyValue: string,
      idx: number,
      avatarColor: AvatarColor | undefined,
      fallbackText: string,
      id: string,
      avatar: string,
    ) => (
      <AvatarButton
        key={`${keyValue}-${idx}-${Math.random()}`}
        aria-hidden="true"
        disabled={!isClickable && !hasDrawer}
        isClickable={(isClickable || hasDrawer) && !haveError}
        onClick={hasDrawer && !haveError ? handleOpenDialog : undefined}
        type="button"
      >
        <Avatar
          key={`${keyValue}-${idx}-${Math.random()}`}
          colors={avatarColor}
          css={{ position: 'relative', ml: idx > 0 ? '-7px' : 0 }}
          fallbackText={fallbackText}
          id={id}
          isDefaultColor={id === userId}
          size={32}
          src={avatar}
        />
      </AvatarButton>
    ),
    [handleOpenDialog, haveError, userId, isClickable, hasDrawer],
  );

  const renderAvatar = useCallback(
    (value: User | string, avatarColor: AvatarColor | undefined, idx: number) => {
      // Only used for the User Amount:
      if (typeof value === 'string') {
        return renderAvatarWithButton(value, idx, avatarColor, value, value, '');
      }

      return (
        <Tooltip
          key={`${value._id}-${idx}-${Math.random()}`}
          content={`${value.firstName} ${value.lastName}`}
        >
          {renderAvatarWithButton(
            value._id,
            idx,
            avatarColor,
            getInitials(value.firstName, value.lastName),
            value._id,
            value.avatar ?? '',
          )}
        </Tooltip>
      );
    },
    [userId, haveError, isClickable, hasDrawer],
  );

  return (
    <>
      {hasDrawer && (
        <ListBoardMembers
          isSubBoard
          boardMembers={boardMembers}
          isOpen={dialogIsOpen}
          setIsOpen={setDialogIsOpen}
        />
      )}
      <Flex align="center" css={{ ...css, height: 'fit-content', overflow: 'hidden' }}>
        {haveError
          ? ['-', '-', '-']
              .slice(0, numberOfAvatars)
              .map((value, index) => renderAvatar(value, errorColors, index))
          : (data.slice(0, numberOfAvatars) as User[]).map((user: User, index: number) =>
              renderAvatar(
                getAvatarValue(user, index),
                stakeholders && !teamAdmins ? stakeholdersColors : undefined,
                index,
              ),
            )}
      </Flex>
    </>
  );
};

export default AvatarGroup;
