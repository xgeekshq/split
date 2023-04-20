import React from 'react';

import Icon from '@/components/Primitives/Icons/Icon/Icon';
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverItem,
  PopoverTrigger,
} from '@/components/Primitives/Popovers/Popover/Popover';
import Text from '@/components/Primitives/Text/Text';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';

export type TeamRolePopoverProps = {
  handleRoleChange: (role: TeamUserRoles) => void;
};

const TeamRolePopover = React.memo(({ handleRoleChange }: TeamRolePopoverProps) => (
  <Popover>
    <PopoverTrigger data-testid="teamRolePopoverTrigger" size="sm" variant="dark">
      <Icon name="arrow-down" />
    </PopoverTrigger>
    <PopoverContent
      collisionPadding={32}
      css={{ width: '$360', height: '$316' }}
      onOpenAutoFocus={(e) => e.preventDefault()}
    >
      <PopoverClose>
        <PopoverItem
          align="end"
          css={{ pr: '$16', height: '$100' }}
          data-testid="teamMemberPopover"
          direction="column"
          onClick={() => {
            handleRoleChange(TeamUserRoles.MEMBER);
          }}
        >
          <Text css={{ textAlign: 'end' }} fontWeight="medium" size="sm">
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
          css={{ pr: '$16', height: '$100' }}
          data-testid="teamAdminPopover"
          direction="column"
          onClick={() => {
            handleRoleChange(TeamUserRoles.ADMIN);
          }}
        >
          <Text css={{ textAlign: 'end' }} fontWeight="medium" size="sm">
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
          css={{ pr: '$16', height: '$100' }}
          data-testid="teamStakeholderPopover"
          direction="column"
          onClick={() => {
            handleRoleChange(TeamUserRoles.STAKEHOLDER);
          }}
        >
          <Text css={{ textAlign: 'end' }} fontWeight="medium" size="sm">
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
