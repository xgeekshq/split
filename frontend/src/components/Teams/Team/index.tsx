import React from 'react';

import { TeamUser } from '@/types/team/team.user';
import Flex from '@/components/Primitives/Layout/Flex';

import TeamMemberItem from '@/components/Teams/Team/TeamMemberItem';

export type TeamMembersListProps = {
  teamUsers: TeamUser[];
  hasPermissions: boolean;
  isTeamPage?: boolean;
};

const TeamMembersList = ({
  teamUsers,
  hasPermissions,
  isTeamPage = false,
}: TeamMembersListProps) => (
  <Flex direction="column" gap="8">
    {teamUsers.map((teamUser) => (
      <TeamMemberItem
        key={teamUser.user._id}
        isTeamPage={isTeamPage}
        member={teamUser}
        hasPermissions={hasPermissions}
      />
    ))}
  </Flex>
);

export default TeamMembersList;
