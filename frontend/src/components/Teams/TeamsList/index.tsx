import React from 'react';

import { Team } from '../../../types/team/team';
import EmptyTeams from './partials/EmptyTeams';
import ListOfCards from './partials/ListOfCards';

type TeamsListProps = {
  userId: string;
  teams: Team[];
  isFetching: boolean;
};

const TeamsList = ({ userId, teams, isFetching }: TeamsListProps) => {
  if (teams?.length === 0) return <EmptyTeams />;

  return <ListOfCards isLoading={isFetching} teams={teams} userId={userId} />;
};

export default TeamsList;
