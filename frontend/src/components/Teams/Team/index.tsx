import React from 'react';

import { TeamUser } from '@/types/team/team.user';
import Flex from '@/components/Primitives/Flex';

import TeamMemberItem from '@/components/Teams/Team/TeamMemberItem';

type TeamMemberListProps = {
  teamUsers: TeamUser[];
  hasPermissions: boolean;
  isTeamPage?: boolean;
};

const TeamMembersList = ({
  teamUsers,
  hasPermissions,
  isTeamPage = false,
}: TeamMemberListProps) => (
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
