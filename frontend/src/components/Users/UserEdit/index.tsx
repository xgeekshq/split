import React from 'react';

import ListOfCards from './partials/ListOfCards';

type UserEditProps = {
  userId: string | undefined;
  isLoading: boolean;
};

const UsersEdit = ({ userId, isLoading }: UserEditProps) => (
  <ListOfCards userId={userId} isLoading={isLoading} />
);

export default UsersEdit;
