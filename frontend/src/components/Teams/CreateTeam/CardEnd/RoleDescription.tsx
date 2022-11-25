import React from 'react';

import Text from '@/components/Primitives/Text';
import { TeamUserRoles } from '../../../../utils/enums/team.user.roles';

type RoleDescriptionProps = {
  role: string;
};

const RoleDescription = ({ role }: RoleDescriptionProps) => (
  <>
    <Text color="primary200" size="sm">
      Role |
    </Text>
    <Text color="primary800" css={{ mx: '$8' }} size="sm" weight="medium">
      {role === TeamUserRoles.STAKEHOLDER && role[0].toUpperCase() + role.substring(1)}
      {(role === TeamUserRoles.ADMIN || role === TeamUserRoles.MEMBER) &&
        `Team ${role[0].toUpperCase()}${role.substring(1)}`}
    </Text>
  </>
);

export default RoleDescription;
