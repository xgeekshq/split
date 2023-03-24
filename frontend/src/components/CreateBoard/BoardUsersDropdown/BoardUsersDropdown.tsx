import { User } from '@/types/user/user';
import Text from '@/components/Primitives/Text/Text';
import { UserNamesContainer, Dropdown, DropdownContent, DropdownItem } from './styles';

type UsersBoxProps = {
  haveError: boolean;
  users: User[];
  title: string;
};

const BoardUsersDropdown = ({ haveError, users, title }: UsersBoxProps) => (
  <Dropdown>
    <UserNamesContainer
      direction="column"
      gap="2"
      css={{
        backgroundColor: haveError ? '$transparent' : '$white',
      }}
    >
      <Text color="primary300" size="xs" css={{ textAlign: 'start' }}>
        {title}
      </Text>
      <Text
        css={{
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          textAlign: 'start',
        }}
        size="md"
      >
        {!haveError &&
          users.length > 0 &&
          users.map((value) => `${value.firstName} ${value.lastName}`).join(', ')}
      </Text>
    </UserNamesContainer>
    {users.length > 0 && (
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
    )}
  </Dropdown>
);

export default BoardUsersDropdown;
