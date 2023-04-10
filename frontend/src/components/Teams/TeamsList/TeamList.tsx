import React from 'react';

import Flex from '@/components/Primitives/Layout/Flex/Flex';
import EmptyTeams from '@/components/Teams/TeamsList/EmptyTeams/EmptyTeams';
import TeamItem from '@/components/Teams/TeamsList/TeamItem/TeamItem';
import useCurrentSession from '@/hooks/useCurrentSession';
import { Team } from '@/types/team/team';
import isEmpty from '@/utils/isEmpty';

export type TeamsListProps = {
  teams: Team[];
};

const TeamsList = ({ teams }: TeamsListProps) => {
  const { userId, isSAdmin } = useCurrentSession();

  if (isEmpty(teams)) return <EmptyTeams />;

  return (
    <Flex direction="column" gap="8">
      {teams.map((team: Team) => (
        <TeamItem key={team.id} isSAdmin={isSAdmin} team={team} userId={userId} />
      ))}
    </Flex>
  );
};

export default TeamsList;
