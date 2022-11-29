import { UserWithTeams } from '@/types/user/user';
import React from 'react';

import ListOfCards from './partials/ListOfCards';

type UsersWithTeamsProps = {
  usersWithTeams: UserWithTeams[];
  isFetching: boolean;
};

const TeamsList = ({ isFetching, usersWithTeams }: UsersWithTeamsProps) => (
  <ListOfCards isLoading={isFetching} usersWithTeams={usersWithTeams} />
);

export default TeamsList;
