import React from 'react';

import Text from '@/components/Primitives/Text';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';
import Flex from '@/components/Primitives/Flex';
import PopoverRoleSettings from './PopoverRoleSettings';

type RoleSelectorProps = {
  role: string | undefined;
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
  <Flex gap="8">
    <Text color="primary200" size="sm">
      Role |
    </Text>
    <Text color="primary800" size="sm" fontWeight="medium">
      {role === TeamUserRoles.STAKEHOLDER && role[0].toUpperCase() + role.substring(1)}
      {(role === TeamUserRoles.ADMIN || role === TeamUserRoles.MEMBER) &&
        `Team ${role[0].toUpperCase()}${role.substring(1)}`}
    </Text>
    {canChangeRole && (
      <PopoverRoleSettings userId={userId} isTeamPage={isTeamPage} teamId={teamId} />
    )}
  </Flex>
);

export default RoleSelector;
