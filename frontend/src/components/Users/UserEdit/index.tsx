import React from 'react';

import ListOfCards from './partials/ListOfCards';

type UserEditProps = {
  userId: string | undefined;
};

const UsersEdit = ({ userId }: UserEditProps) => <ListOfCards userId={userId} />;

export default UsersEdit;
