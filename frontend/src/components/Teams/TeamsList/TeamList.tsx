import React from 'react';

import { Team } from '@/types/team/team';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import EmptyTeams from './EmptyTeams/EmptyTeams';

import TeamItem from './TeamItem/TeamItem';

export type TeamsListProps = {
  teams: Team[];
};

const TeamsList = ({ teams }: TeamsListProps) => {
  if (teams.length === 0) return <EmptyTeams />;

  return (
    <Flex direction="column" gap="8">
      {teams.map((team: Team) => (
        <TeamItem key={team.id} team={team} />
      ))}
    </Flex>
  );
};

export default TeamsList;
