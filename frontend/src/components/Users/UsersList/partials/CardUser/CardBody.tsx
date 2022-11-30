import React from 'react';
import { useSession } from 'next-auth/react';

import { styled } from '@/styles/stitches/stitches.config';

import Icon from '@/components/icons/Icon';
import Box from '@/components/Primitives/Box';
import Flex from '@/components/Primitives/Flex';
import Text from '@/components/Primitives/Text';
import { UserWithTeams } from '@/types/user/user';
// eslint-disable-next-line import/no-named-as-default
import SuperAdmin from './SuperAdmin';
import CardEnd from './CardEnd';
import CardTitle from './CardTitle';

const InnerContainer = styled(Flex, Box, {
  px: '$32',
  backgroundColor: '$white',
  borderRadius: '$12',
  position: 'relative',
  py: '$22',
  maxHeight: '$76',
  ml: 0,
});

type CardBodyProps = {
  userWithTeams: UserWithTeams;
};

const CardBody = React.memo<CardBodyProps>(({ userWithTeams }) => {
  const { data: session } = useSession();

  const loggedUserIsSAdmin = session?.user.isSAdmin;

  const { firstName, lastName, email, isSAdmin } = userWithTeams.user;
  const { teamsNames } = userWithTeams;

  const getTeamsCountText = () => {
    if (teamsNames?.length === 1) {
      return 'in 1 team';
    }
    if (teamsNames?.length !== 0 && teamsNames?.length !== 1 && teamsNames) {
      return `in ${teamsNames.length} teams`;
    }
    return 'no teams';
  };

  return (
    <Flex css={{ flex: '1 1 1', marginBottom: '$10' }} direction="column" gap="12">
      <InnerContainer align="center" elevation="1" justify="between">
        <Flex align="center" css={{ width: '25%' }} gap="8">
          <Icon
            name="blob-personal"
            css={{
              width: '$32',
              height: '$32',
              zIndex: 1,
            }}
          />

          <Flex align="center" css={{ width: '$147' }} gap="8">
            <CardTitle firstName={firstName} lastName={lastName} />
          </Flex>

          <Flex align="center" css={{ width: '$147' }}>
            <Text color="primary300" size="sm">
              {email}
            </Text>
          </Flex>
        </Flex>

        <Flex align="center" css={{ justifyContent: 'end', width: '$683' }} gap="8">
          <Flex align="center" css={{ ml: '$40', alignItems: 'center' }} gap="8">
            <Flex align="center" css={{ width: '$147' }}>
              <Text css={{ mr: '$2', fontWeight: '$bold' }} size="sm">
                {getTeamsCountText()}
              </Text>
            </Flex>
          </Flex>
          <Flex css={{ width: '40%' }} justify="end">
            <Flex align="center" css={{ width: '$237' }} justify="start">
              {loggedUserIsSAdmin && (
                <SuperAdmin userSAdmin={isSAdmin} loggedUserSAdmin={loggedUserIsSAdmin} />
              )}
            </Flex>
            {loggedUserIsSAdmin && <CardEnd user={userWithTeams.user} />}
          </Flex>
        </Flex>
      </InnerContainer>
    </Flex>
  );
});

export default CardBody;
