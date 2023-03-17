import React from 'react';

import { UserWithTeams } from '@/types/user/user';
// import ListOfCards from './partials/ListOfCards';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';

export type UsersListProps = {
  users: UserWithTeams[];
};

const UsersList = ({ users }: UsersListProps) => (
  <Flex direction="column" gap="8">
    {users.map((user: UserWithTeams) => (
      <Text key={user.user._id}>{JSON.stringify(user)}</Text>
    ))}
  </Flex>
);

export default UsersList;
