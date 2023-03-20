import React from 'react';

import Badge from '@/components/Primitives/Badge/Badge';
import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import Tooltip from '@/components/Primitives/Tooltips/Tooltip/Tooltip';
import useCurrentSession from '@/hooks/useCurrentSession';
import { InnerContainer } from '@/styles/pages/pages.styles';
import { UserWithTeams } from '@/types/user/user';

import UserItemActions from './UserItemActions/UserItemActions';
import UserTitle from './UserTitle/UserTitle';

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
        <Flex align="center" gap="8" css={{ flex: '2' }}>
          <Icon
            name="blob-personal"
            size={32}
            css={{
              zIndex: 1,
              flexShrink: '0',
            }}
          />

          <UserTitle user={user} hasPermissions={isSAdmin!} />
        </Flex>

        <Flex align="center" justify="start" css={{ flex: '2' }}>
          <Text color="primary300" size="sm">
            {user.email}
          </Text>
        </Flex>

        <Flex align="center" css={{ flex: '1' }}>
          {!isSAdmin && user.isSAdmin && (
            <Badge pill variant="success" size="sm">
              SUPER ADMIN
            </Badge>
          )}
        </Flex>

        <Flex align="center" justify="end" css={{ flex: '1' }}>
          <Tooltip content={teamsSeparatedByComma}>
            <Text css={{ cursor: 'default' }} fontWeight="bold" size="sm">
              {getTeamsCountText()}
            </Text>
          </Tooltip>
        </Flex>

        {isSAdmin && (
          <Flex align="center" justify="end" css={{ flex: '2' }}>
            <UserItemActions user={user} />
          </Flex>
        )}
      </InnerContainer>
    </Flex>
  );
});

export default UserItem;
