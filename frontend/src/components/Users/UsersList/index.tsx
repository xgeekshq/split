import React from 'react';

import ListOfCards from './partials/ListOfCards';

type UsersWithTeamsProps = {
  isFetching: boolean;
};

const TeamsList = ({ isFetching }: UsersWithTeamsProps) => <ListOfCards isLoading={isFetching} />;

export default TeamsList;
