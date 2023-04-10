import React from 'react';

import Flex from '@/components/Primitives/Layout/Flex/Flex';
import TeamMemberItem from '@/components/Teams/Team/TeamMemberItem/TeamMemberItem';
import { TeamUser } from '@/types/team/team.user';

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
  <Flex data-testid="teamMembersList" direction="column" gap="8">
    {teamUsers.map((teamUser) => (
      <TeamMemberItem
        key={teamUser.user._id}
        hasPermissions={hasPermissions}
        isTeamPage={isTeamPage}
        member={teamUser}
      />
    ))}
  </Flex>
);

export default TeamMembersList;
