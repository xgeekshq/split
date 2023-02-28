import React from 'react';

import { Team } from '@/types/team/team';
import Flex from '@/components/Primitives/Flex';
import Dots from '@/components/Primitives/Loading/Dots';
import EmptyTeams from './partials/EmptyTeams';

import TeamItem from './TeamItem';

type TeamsListProps = {
  teams: Team[];
  isLoading: boolean;
};

const TeamsList = ({ teams, isLoading }: TeamsListProps) => {
  if (teams?.length === 0) return <EmptyTeams />;

  return (
    <>
      <Flex direction="column" gap="8">
        {teams.map((team: Team) => (
          <TeamItem key={team.id} team={team} isTeamPage />
        ))}
      </Flex>

      {isLoading && (
        <Flex justify="center" css={{ mt: '$16' }}>
          <Dots />
        </Flex>
      )}
    </>
  );
};

export default TeamsList;
