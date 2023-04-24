import React from 'react';

import Flex from '@/components/Primitives/Layout/Flex/Flex';
import TeamRolePopover from '@/components/Primitives/Popovers/TeamRolePopover/TeamRolePopover';
import Separator from '@/components/Primitives/Separator/Separator';
import Text from '@/components/Primitives/Text/Text';
import { TeamUserRoles } from '@/enums/teams/userRoles';
import { getFormattedTeamUserRole } from '@/utils/getFormattedTeamUserRole';

export type RoleSelectorProps = {
  role: TeamUserRoles;
  handleRoleChange: (role: TeamUserRoles) => void;
  canChangeRole?: boolean;
};

const RoleSelector = ({ role, handleRoleChange, canChangeRole = true }: RoleSelectorProps) => (
  <Flex align="center" data-testid="roleSelector" gap="8">
    <Text color="primary200" size="sm">
      Role
    </Text>
    <Separator orientation="vertical" size="md" />
    <Text color="primary800" fontWeight="medium" size="sm">
      {getFormattedTeamUserRole(role)}
    </Text>
    {canChangeRole && <TeamRolePopover handleRoleChange={handleRoleChange} />}
  </Flex>
);

export default RoleSelector;
