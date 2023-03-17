import React from 'react';

import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import Tooltip from '@/components/Primitives/Tooltips/Tooltip/Tooltip';
import useCurrentSession from '@/hooks/useCurrentSession';
import { InnerContainer } from '@/styles/pages/pages.styles';
import { UserWithTeams } from '@/types/user/user';

import CardEnd from '../partials/CardUser/CardEnd';
import SuperAdmin from '../partials/CardUser/SuperAdmin';
import UserTitle from './UserTitle/UserTitle';

type UserItemProps = {
  userWithTeams: UserWithTeams;
};

const UserItem = React.memo<UserItemProps>(({ userWithTeams }) => {
  const { userId, isSAdmin } = useCurrentSession();

  const { email, isSAdmin: isUserSAdmin, _id } = userWithTeams.user;
  const { teamsNames } = userWithTeams;
  const { user } = userWithTeams;

  const getTeamsCountText = () => {
    if (teamsNames?.length === 1) {
      return 'in 1 team';
    }
    if (teamsNames?.length !== 0 && teamsNames?.length !== 1 && teamsNames) {
      return `in ${teamsNames.length} teams`;
    }
    return 'no teams';
  };

  const teamsSeparatedByComma = teamsNames?.join(', ') || '';

  return (
    <Flex direction="column">
      <InnerContainer align="center" elevation="1" gap="40">
        <Flex align="center" gap="8" css={{ flex: '1' }}>
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

        <Flex align="center" css={{ flex: '1' }}>
          <Text color="primary300" size="sm">
            {email}
          </Text>
        </Flex>

        {!isSAdmin && (
          <Flex align="center" css={{ flex: '1' }}>
            <SuperAdmin
              userSAdmin={isUserSAdmin}
              loggedUserSAdmin={isSAdmin}
              userId={_id}
              loggedUserId={userId}
            />
          </Flex>
        )}

        <Flex align="center" css={{ justifyContent: 'end', width: '$683' }} gap="8">
          <Flex align="center" css={{ ml: '$40', alignItems: 'center' }} gap="8">
            <Flex align="center" css={{ width: '$147' }}>
              <Tooltip content={teamsSeparatedByComma}>
                <Text css={{ mr: '$2', fontWeight: '$bold', cursor: 'default' }} size="sm">
                  {getTeamsCountText()}
                </Text>
              </Tooltip>
            </Flex>
          </Flex>
          {isSAdmin && (
            <Flex css={{ width: '40%' }} justify="end">
              <Flex align="center" css={{ width: '$237' }} justify="start">
                <SuperAdmin
                  userSAdmin={isUserSAdmin}
                  loggedUserSAdmin={isSAdmin}
                  userId={_id}
                  loggedUserId={userId}
                />
              </Flex>
              <CardEnd user={userWithTeams.user} />
            </Flex>
          )}
        </Flex>
      </InnerContainer>
    </Flex>
  );
});

export default UserItem;
