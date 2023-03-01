import React from 'react';

import { TeamUser } from '@/types/team/team.user';
import Flex from '@/components/Primitives/Flex';

import CardMember from '@/components/Teams/CreateTeam/CardMember';

type TeamMemberListProps = {
  users: TeamUser[];
  userId: string | undefined;
  isTeamMember: boolean;
};

const TeamMembersList = ({ users, userId, isTeamMember }: TeamMemberListProps) => (
  <Flex direction="column" gap="8">
    {users.map((user) => (
      <CardMember
        key={user._id}
        isTeamPage
        isTeamCreator={user._id === userId}
        member={user}
        isTeamMember={isTeamMember}
      />
    ))}
  </Flex>
);

export default TeamMembersList;
