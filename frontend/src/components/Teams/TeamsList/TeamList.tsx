import React from 'react';

import { Team } from '@/types/team/team';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import useCurrentSession from '@/hooks/useCurrentSession';
import isEmpty from '@/utils/isEmpty';
import EmptyTeams from '@/components/Teams/TeamsList/EmptyTeams/EmptyTeams';

import TeamItem from './TeamItem/TeamItem';

export type TeamsListProps = {
  teams: Team[];
};

const TeamsList = ({ teams }: TeamsListProps) => {
  const { userId, isSAdmin } = useCurrentSession();

  if (isEmpty(teams)) return <EmptyTeams />;

  return (
    <Flex direction="column" gap="8">
      {teams.map((team: Team) => (
        <TeamItem key={team.id} team={team} userId={userId} isSAdmin={isSAdmin} />
      ))}
    </Flex>
  );
};

export default TeamsList;
