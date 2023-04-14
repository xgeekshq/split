import React from 'react';

import Checkbox from '@/components/Primitives/Inputs/Checkboxes/Checkbox/Checkbox';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import { UserList } from '@/types/team/userList';

export type UserCheckboxProps = {
  user: UserList;
  disabled: boolean;
  handleChecked: (id: string) => void;
};

const UserCheckbox = ({ user, disabled, handleChecked }: UserCheckboxProps) => (
  <Flex key={user._id} align="center" data-testid="checkboxUserItem" gap={16}>
    <Flex css={{ flex: 1 }}>
      <Checkbox
        checked={user.isChecked}
        disabled={disabled}
        id={user._id}
        label={`${user.firstName} ${user.lastName}`}
        size="md"
        handleChange={() => {
          handleChecked(user._id);
        }}
      />
    </Flex>
    <Flex css={{ flex: 1 }}>
      <Text color="primary300" size="sm">
        {user.email}
      </Text>
    </Flex>
  </Flex>
);

export default UserCheckbox;
