import React, { Dispatch, SetStateAction } from 'react';

import Text from '@/components/Primitives/Text';
import { User } from '@/types/user/user';
import { BoardUserRoles } from '@/utils/enums/board.user.roles';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';
import isEmpty from '@/utils/isEmpty';
import Dialog from '@/components/Primitives/Dialog';
import { FilterBoardMembers } from './FilterBoardMembers';
import { ScrollableContent } from './styles';

type ListUsersType = {
  user: User;
  role: TeamUserRoles | BoardUserRoles;
  _id?: string;
};

type ListBoardMembersProps = {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
  boardMembers: ListUsersType[];
};

const ListBoardMembers = ({ isOpen, setIsOpen, boardMembers }: ListBoardMembersProps) => {
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
      <Dialog.Header>
        <Text heading="4">Board Members</Text>
      </Dialog.Header>
      <ScrollableContent direction="column" justify="start">
        <FilterBoardMembers title="Team Members" users={members} />
        {!isEmpty(responsible) && <FilterBoardMembers title="Responsible" users={responsible} />}
        {!isEmpty(stakeholders) && (
          <FilterBoardMembers
            title={stakeholders.length > 1 ? 'Stakeholders' : 'Stakeholder'}
            users={stakeholders}
          />
        )}
        {!isEmpty(admin) && (
          <FilterBoardMembers
            title={admin.length > 1 ? 'Team Admins' : 'Team Admin'}
            users={admin}
          />
        )}
      </ScrollableContent>
    </Dialog>
  );
};

export { ListBoardMembers };
