import React from 'react';

import { Team } from '../../../types/team/team';
import EmptyTeams from './partials/EmptyTeams';
import ListOfCards from './partials/ListOfCards';

type MyTeamsProps = {
	userId: string;
	teams: Team[];
	isFetching: boolean;
};

const MyTeams = ({ userId, teams, isFetching }: MyTeamsProps) => {
	if (teams?.length === 0) return <EmptyTeams />;

	return <ListOfCards isLoading={isFetching} teams={teams} userId={userId} />;
};

export default MyTeams;
