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

type UserItemProps = {
  userWithTeams: UserWithTeams;
};

const UserItem = React.memo<UserItemProps>(({ userWithTeams }) => {
  const { isSAdmin } = useCurrentSession();
  const { teamsNames, user } = userWithTeams;

  const getTeamsCountText = () => {
    if (teamsNames?.length === 1) {
      return 'in 1 team';
    }
    if (teamsNames && teamsNames?.length > 1) {
      return `in ${teamsNames.length} teams`;
    }
    return 'no teams';
  };

  const teamsSeparatedByComma = teamsNames?.join(', ') || '';

  return (
    <Flex direction="column">
      <InnerContainer align="center" elevation="1" gap="40">
        <Flex align="center" css={{ flex: '2' }} gap="8">
          <Icon
            name="blob-personal"
            size={32}
            css={{
              zIndex: 1,
              flexShrink: '0',
            }}
          />

          <UserTitle hasPermissions={isSAdmin!} user={user} />
        </Flex>

        <Flex align="center" css={{ flex: '2' }} justify="start">
          <Text color="primary300" size="sm">
            {user.email}
          </Text>
        </Flex>

        <Flex align="center" css={{ flex: '1' }}>
          {!isSAdmin && user.isSAdmin && (
            <Badge pill size="sm" variant="success">
              SUPER ADMIN
            </Badge>
          )}
        </Flex>

        <Flex align="center" css={{ flex: '1' }} justify="end">
          <Tooltip content={teamsSeparatedByComma}>
            <Text css={{ cursor: 'default' }} fontWeight="bold" size="sm">
              {getTeamsCountText()}
            </Text>
          </Tooltip>
        </Flex>

        {isSAdmin && (
          <Flex align="center" css={{ flex: '2' }} justify="end">
            <UserItemActions user={user} />
          </Flex>
        )}
      </InnerContainer>
    </Flex>
  );
});

export default UserItem;
