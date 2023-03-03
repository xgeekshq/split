import React from 'react';

import Text from '@/components/Primitives/Text';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';
import Flex from '@/components/Primitives/Flex';
import { getFormattedTeamUserRole } from '@/utils/getFormattedTeamUserRole';
import PopoverRoleSettings from './PopoverRoleSettings';

export type RoleSelectorProps = {
  role: TeamUserRoles;
  userId: string;
  isTeamPage?: boolean;
  teamId?: string;
  canChangeRole?: boolean;
};

const RoleSelector = ({
  role,
  userId,
  isTeamPage = false,
  teamId = undefined,
  canChangeRole = true,
}: RoleSelectorProps) => (
  <Flex gap="8" data-testid="roleSelector">
    <Text color="primary200" size="sm">
      Role |
    </Text>
    <Text color="primary800" size="sm" fontWeight="medium">
      {getFormattedTeamUserRole(role)}
    </Text>
    {canChangeRole && (
      <PopoverRoleSettings userId={userId} isTeamPage={isTeamPage} teamId={teamId} />
    )}
  </Flex>
);

export default RoleSelector;
