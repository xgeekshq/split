import React from 'react';
import { useSession } from 'next-auth/react';

import { styled } from '@/styles/stitches/stitches.config';

import Icon from '@/components/icons/Icon';
import Box from '@/components/Primitives/Box';
import Flex from '@/components/Primitives/Flex';
import Separator from '@/components/Primitives/Separator';
import Text from '@/components/Primitives/Text';
import { UserWithTeams } from '@/types/user/user';
import SuperAdmin from './SuperAdmin';
import CardEnd from './CardEnd';
import CardTitle from './CardTitle';

const InnerContainer = styled(Flex, Box, {
  px: '$32',
  backgroundColor: '$white',
  borderRadius: '$12',
});

type CardBodyProps = {
  user: UserWithTeams;
};

const CardBody = React.memo<CardBodyProps>(({ user }) => {
  const { data: session } = useSession();

  const loggedUserIsSAdmin = session?.isSAdmin;

  const { firstName, lastName, email, isSAdmin } = user.user;
  const { teamsNames } = user;

  return (
    <Flex css={{ flex: '1 1 1', marginBottom: '$10' }} direction="column" gap="12">
      <InnerContainer
        align="center"
        elevation="1"
        justify="between"
        css={{
          position: 'relative',
          py: '$22',
          maxHeight: '$76',
          ml: 0,
        }}
      >
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
              {!teamsNames && (
                <Text css={{ mr: '$2', fontWeight: '$bold' }} size="sm">
                  in 0 teams
                </Text>
              )}
              {teamsNames?.length === 1 && (
                <Text css={{ mr: '$2', fontWeight: '$bold' }} size="sm">
                  in 1 team
                </Text>
              )}
              {teamsNames?.length !== 0 && teamsNames?.length !== 1 && teamsNames && (
                <Text css={{ mr: '$2', fontWeight: '$bold' }} size="sm">
                  in {teamsNames?.length} teams
                </Text>
              )}
            </Flex>
          </Flex>
          <Flex css={{ width: '40%' }} justify="end">
            <Flex align="center" css={{ width: '$237' }} justify="start">
              <SuperAdmin userSAdmin={isSAdmin} loggedUserSAdmin={loggedUserIsSAdmin} />
            </Flex>
            <Separator
              orientation="vertical"
              css={{
                ml: '$20',
                backgroundColor: '$primary100',
                height: '$24 !important',
              }}
            />
            <CardEnd user={user.user} userSAdmin={loggedUserIsSAdmin} />
          </Flex>
        </Flex>
      </InnerContainer>
    </Flex>
  );
});

export default CardBody;
