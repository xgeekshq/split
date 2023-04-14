import * as HoverCard from '@radix-ui/react-hover-card';

import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  UserNamesContainer,
} from '@/components/CreateBoard/SplitBoard/SubTeamsTab/BoardUsersDropdown/styles';
import Text from '@/components/Primitives/Text/Text';
import { User } from '@/types/user/user';

type UsersBoxProps = {
  haveError: boolean;
  users: User[];
  title: string;
};

const BoardUsersDropdown = ({ haveError, users, title }: UsersBoxProps) => (
  <Dropdown closeDelay={0} openDelay={0}>
    <UserNamesContainer
      direction="column"
      gap={2}
      css={{
        backgroundColor: haveError ? '$transparent' : '$white',
      }}
    >
      <Text color="primary300" css={{ textAlign: 'start' }} size="xs">
        {title}
      </Text>
      <Text
        size="md"
        css={{
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          textAlign: 'start',
        }}
      >
        {!haveError &&
          users.length > 0 &&
          users.map((value) => `${value.firstName} ${value.lastName}`).join(', ')}
      </Text>
    </UserNamesContainer>
    <HoverCard.Portal>
      {users.length > 0 && (
        <DropdownContent avoidCollisions hideWhenDetached align="start" collisionPadding={100}>
          {users.map((user) => (
            <DropdownItem key={user._id} align="center" justify="between">
              <Text fontWeight="medium" size="sm">
                {`${user.firstName} ${user.lastName} `}
              </Text>
              <Text color="primary300" size="xs">{`(${user.email})`}</Text>
            </DropdownItem>
          ))}
        </DropdownContent>
      )}
    </HoverCard.Portal>
  </Dropdown>
);

export default BoardUsersDropdown;
