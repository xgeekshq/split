import React, { Dispatch, SetStateAction, useRef } from 'react';
import { Dialog, DialogClose } from '@radix-ui/react-dialog';

import Icon from '@/components/icons/Icon';
import Text from '@/components/Primitives/Text';
import { User } from '@/types/user/user';
import { BoardUserRoles } from '@/utils/enums/board.user.roles';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';
import isEmpty from '@/utils/isEmpty';
import {
  StyledDialogCloseButton,
  StyledDialogContainer,
  StyledDialogContent,
  StyledDialogOverlay,
  StyledDialogTitle,
} from '../../../Board/Settings/styles';
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
  // References
  const scrollRef = useRef<HTMLDivElement>(null);
  const dialogContainerRef = useRef<HTMLSpanElement>(null);

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
    <StyledDialogContainer ref={dialogContainerRef}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <StyledDialogOverlay />
        <StyledDialogContent>
          <StyledDialogTitle>
            <Text heading="4">Board Members</Text>
            <DialogClose asChild>
              <StyledDialogCloseButton isIcon size="lg">
                <Icon css={{ color: '$primary400' }} name="close" size={24} />
              </StyledDialogCloseButton>
            </DialogClose>
          </StyledDialogTitle>
          <ScrollableContent direction="column" justify="start" ref={scrollRef}>
            <FilterBoardMembers title="Team Members" users={members} />
            {!isEmpty(responsible) && (
              <FilterBoardMembers title="Responsible" users={responsible} />
            )}
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
        </StyledDialogContent>
      </Dialog>
    </StyledDialogContainer>
  );
};

export { ListBoardMembers };
