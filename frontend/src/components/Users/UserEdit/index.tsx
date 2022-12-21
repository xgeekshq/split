import { Team } from '@/types/team/team';
import React from 'react';

import ListOfCards from './partials/ListOfCards';

type UserEditProps = {
  userId: string | undefined;
  teams: Team[];
  isLoading: boolean;
};

const UsersEdit = ({ userId, teams, isLoading }: UserEditProps) => (
  <ListOfCards userId={userId} teams={teams} isLoading={isLoading} />
);

export default UsersEdit;
