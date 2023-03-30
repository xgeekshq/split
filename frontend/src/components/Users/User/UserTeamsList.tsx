import React from 'react';

import { Team } from '@/types/team/team';
import Flex from '@/components/Primitives/Layout/Flex/Flex';

import TeamItem from '@/components/Teams/TeamsList/TeamItem/TeamItem';
import useCurrentSession from '@/hooks/useCurrentSession';

export type UserTeamsListProps = {
  userTeams: Team[];
};

const UserTeamsList = ({ userTeams }: UserTeamsListProps) => {
  const { userId, isSAdmin } = useCurrentSession();

  return (
    <Flex direction="column" gap="8">
      {userTeams.map((team) => (
        <TeamItem key={team.id} team={team} userId={userId} isSAdmin={isSAdmin} />
      ))}
    </Flex>
  );
};

export default UserTeamsList;
