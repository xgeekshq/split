import Text from '@/components/Primitives/Text/Text';
import { ReactNode } from 'react';
import { User } from '@/types/user/user';
import { Dropdown, DropdownBtn, DropdownContent, DropdownItem } from './styles';

type DropdownUsersProps = {
  children: ReactNode;
  users: User[];
};

const DropdownUsers = ({ children, users }: DropdownUsersProps) => (
  <Dropdown>
    <DropdownBtn disabled>{children}</DropdownBtn>
    <DropdownContent>
      {users.map((user) => (
        <DropdownItem key={user._id} justify="between" align="center">
          <Text size="sm" fontWeight="medium">
            {`${user.firstName} ${user.lastName} `}
          </Text>
          <Text size="xs" color="primary300">{`(${user.email})`}</Text>
        </DropdownItem>
      ))}
    </DropdownContent>
  </Dropdown>
);

export default DropdownUsers;
