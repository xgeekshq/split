import React from 'react';

import { TeamUser } from '@/types/team/team.user';
import Flex from '@/components/Primitives/Flex';

import TeamMemberItem from '@/components/Teams/partials/TeamMemberItem';

type TeamMemberListProps = {
  users: TeamUser[];
  hasPermissions: boolean;
  isTeamPage?: boolean;
};

const TeamMembersList = ({ users, hasPermissions, isTeamPage = false }: TeamMemberListProps) => (
  <Flex direction="column" gap="8">
    {users.map((user) => (
      <TeamMemberItem
        key={user._id}
        isTeamPage={isTeamPage}
        member={user}
        hasPermissions={hasPermissions}
      />
    ))}
  </Flex>
);

export default TeamMembersList;
