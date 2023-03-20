import React from 'react';

import ListOfCards from './partials/ListOfCards';

type UserEditProps = {
  isLoading: boolean;
};

const UsersEdit = ({ isLoading }: UserEditProps) => <ListOfCards isLoading={isLoading} />;

export default UsersEdit;
