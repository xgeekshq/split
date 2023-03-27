import React from 'react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverItem,
  PopoverClose,
} from '@/components/Primitives/Popovers/Popover/Popover';
import Text from '@/components/Primitives/Text/Text';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';

import Icon from '@/components/Primitives/Icons/Icon/Icon';

export type TeamRolePopoverProps = {
  handleRoleChange: (role: TeamUserRoles) => void;
};

const TeamRolePopover = React.memo(({ handleRoleChange }: TeamRolePopoverProps) => (
  <Popover>
    <PopoverTrigger variant="dark" size="sm" data-testid="teamRolePopoverTrigger">
      <Icon name="arrow-down" />
    </PopoverTrigger>
    <PopoverContent
      css={{ width: '$360', height: '$316' }}
      collisionPadding={32}
      onOpenAutoFocus={(e) => e.preventDefault()}
    >
      <PopoverClose>
        <PopoverItem
          align="end"
          direction="column"
          css={{ pr: '$16', height: '$100' }}
          onClick={() => {
            handleRoleChange(TeamUserRoles.MEMBER);
          }}
        >
          <Text css={{ textAlign: 'end' }} size="sm" fontWeight="medium">
            Team Member
          </Text>

          <Text css={{ textAlign: 'end' }} size="sm">
            The team member can create boards and can create teams.
          </Text>
        </PopoverItem>
      </PopoverClose>
      <PopoverClose>
        <PopoverItem
          align="end"
          direction="column"
          css={{ pr: '$16', height: '$100' }}
          onClick={() => {
            handleRoleChange(TeamUserRoles.ADMIN);
          }}
        >
          <Text css={{ textAlign: 'end' }} size="sm" fontWeight="medium">
            Team Admin
          </Text>
          <Text css={{ textAlign: 'end' }} size="sm">
            The team admin can nominate team admins / stakeholder and can create/delete/edit team
            boards.
          </Text>
        </PopoverItem>
      </PopoverClose>
      <PopoverClose>
        <PopoverItem
          align="end"
          direction="column"
          css={{ pr: '$16', height: '$100' }}
          onClick={() => {
            handleRoleChange(TeamUserRoles.STAKEHOLDER);
          }}
        >
          <Text css={{ textAlign: 'end' }} size="sm" fontWeight="medium">
            Stakeholder
          </Text>
          <Text css={{ textAlign: 'end' }} size="sm">
            Stakeholders will not be included in sub-team SPLIT retrospectives.
          </Text>
        </PopoverItem>
      </PopoverClose>
    </PopoverContent>
  </Popover>
));

export default TeamRolePopover;
