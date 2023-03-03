import React from 'react';

import { Team } from '@/types/team/team';
import Flex from '@/components/Primitives/Flex';
import EmptyTeams from './partials/EmptyTeams';

import TeamItem from './TeamItem';

export type TeamsListProps = {
  teams: Team[];
};

const TeamsList = ({ teams }: TeamsListProps) => {
  if (teams?.length === 0) return <EmptyTeams />;

  return (
    <Flex direction="column" gap="8">
      {teams.map((team: Team) => (
        <TeamItem key={team.id} team={team} isTeamPage />
      ))}
    </Flex>
  );
};

export default TeamsList;
