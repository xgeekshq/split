import React from 'react';

import { Team } from '@/types/team/team';
import Flex from '@/components/Primitives/Layout/Flex/Flex';

import TeamItem from '@/components/Teams/TeamsList/TeamItem/TeamItem';

export type UserTeamsListProps = {
  userTeams: Team[];
};

const UserTeamsList = ({ userTeams }: UserTeamsListProps) => (
  <Flex direction="column" gap="8">
    {userTeams.map((team) => (
      <TeamItem key={team.id} team={team} />
    ))}
  </Flex>
);

export default UserTeamsList;
