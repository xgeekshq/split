import React, { Dispatch, SetStateAction } from 'react';

import { FilterBoardMembers } from '@/components/Boards/MyBoards/ListBoardMembers/FilterBoardMembers';
import { ScrollableContent } from '@/components/Boards/MyBoards/ListBoardMembers/styles';
import Dialog from '@/components/Primitives/Dialogs/Dialog/Dialog';
import { BoardUserRoles } from '@/enums/boards/userRoles';
import { TeamUserRoles } from '@/enums/teams/userRoles';
import { User } from '@/types/user/user';
import isEmpty from '@/utils/isEmpty';

type ListUsersType = {
  user: User;
  role: TeamUserRoles | BoardUserRoles;
  _id?: string;
};

type ListBoardMembersProps = {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
  boardMembers: ListUsersType[];
  isSubBoard: boolean;
  isRegularBoardNoTeam?: boolean;
};

const ListBoardMembers = ({
  isOpen,
  setIsOpen,
  boardMembers,
  isSubBoard,
  isRegularBoardNoTeam,
}: ListBoardMembersProps) => {
  const admin = boardMembers
    .filter((user) => user.role === TeamUserRoles.ADMIN)
    .map((user) => user.user);

  const responsible = boardMembers
    .filter((user) => user.role === BoardUserRoles.RESPONSIBLE)
    .map((user) => user.user);

  const members = boardMembers
    .filter((user) => user.role === BoardUserRoles.MEMBER)
    .map((user) => user.user);

  const stakeholders = boardMembers
    .filter((user) => user.role === BoardUserRoles.STAKEHOLDER)
    .map((user) => user.user);

  return (
    <Dialog isOpen={isOpen} setIsOpen={setIsOpen}>
      <Dialog.Header title="Board Members" />
      <ScrollableContent direction="column" justify="start">
        {!isEmpty(admin) && (
          <FilterBoardMembers
            title={admin.length > 1 ? 'Team Admins' : 'Team Admin'}
            users={admin}
          />
        )}
        {!isEmpty(responsible) && isSubBoard && (
          <FilterBoardMembers
            title={isRegularBoardNoTeam ? 'Board Creator' : 'Responsible'}
            users={responsible}
          />
        )}
        {!isEmpty(stakeholders) && (
          <FilterBoardMembers
            title={stakeholders.length > 1 ? 'Stakeholders' : 'Stakeholder'}
            users={stakeholders}
          />
        )}
        {!isEmpty(members) && (
          <FilterBoardMembers
            title={isRegularBoardNoTeam ? 'Participants' : 'Team Members'}
            users={members}
          />
        )}
      </ScrollableContent>
    </Dialog>
  );
};

export { ListBoardMembers };
