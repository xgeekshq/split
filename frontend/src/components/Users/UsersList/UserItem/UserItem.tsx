import React from 'react';

import Badge from '@/components/Primitives/Badge/Badge';
import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import Tooltip from '@/components/Primitives/Tooltips/Tooltip/Tooltip';
import UserItemActions from '@/components/Users/UsersList/UserItem/UserItemActions/UserItemActions';
import UserTitle from '@/components/Users/UsersList/UserItem/UserTitle/UserTitle';
import useCurrentSession from '@/hooks/useCurrentSession';
import { InnerContainer } from '@/styles/pages/pages.styles';
import { UserWithTeams } from '@/types/user/user';
import Avatar from '@components/Primitives/Avatars/Avatar/Avatar';

export type UserItemProps = {
  userWithTeams: UserWithTeams;
};

export const getTeamsCountText = (teamNames: string[]) => {
  if (teamNames.length === 1) {
    return 'in 1 team';
  }
  if (teamNames && teamNames.length > 1) {
    return `in ${teamNames.length} teams`;
  }
  return 'no teams';
};

const UserItem = React.memo<UserItemProps>(({ userWithTeams }) => {
  const { isSAdmin } = useCurrentSession();
  const { teamsNames, user } = userWithTeams;

  const teamsSeparatedByComma = teamsNames?.join(', ') || '';

  return (
    <Flex data-testid="userItem" direction="column">
      <InnerContainer align="center" elevation="1" wrap="wrap">
        <Flex align="center" css={{ width: '$300' }} gap="8">
          {user.avatar ? (
            <Avatar
              key={`${user}-${user._id}-${Math.random()}`}
              css={{ position: 'relative', mr: '$10' }}
              fallbackText={user.firstName.charAt(0) + user.lastName.charAt(0)}
              size={32}
              src={user.avatar}
            />
          ) : (
            <Icon css={{ flexShrink: 0 }} name="blob-personal" size={32} />
          )}
          <UserTitle hasPermissions={isSAdmin} user={user} />
        </Flex>

        <Text color="primary300" css={{ minWidth: '$170' }} size="sm">
          {user.email}
        </Text>
        <Flex align="center" css={{ flex: 1 }} gap="40" justify="end">
          {!isSAdmin && user.isSAdmin && (
            <Badge pill css={{ whiteSpace: 'nowrap' }} size="sm" variant="success">
              SUPER ADMIN
            </Badge>
          )}
          {teamsNames && (
            <Flex>
              <Tooltip content={teamsSeparatedByComma}>
                <Text css={{ cursor: 'default', whiteSpace: 'nowrap' }} fontWeight="bold" size="sm">
                  {getTeamsCountText(teamsNames)}
                </Text>
              </Tooltip>
            </Flex>
          )}
        </Flex>
        {isSAdmin && <UserItemActions user={user} />}
      </InnerContainer>
    </Flex>
  );
});

export default UserItem;
