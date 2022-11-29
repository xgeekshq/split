import React, { useMemo } from 'react';
import { useSession } from 'next-auth/react';

import { styled } from '@/styles/stitches/stitches.config';

import CardAvatars from '@/components/CardBoard/CardAvatars';
import Icon from '@/components/icons/Icon';
import Box from '@/components/Primitives/Box';
import Flex from '@/components/Primitives/Flex';
import Separator from '@/components/Primitives/Separator';
import Text from '@/components/Primitives/Text';
import { Team } from '@/types/team/team';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';
import BoardsInfo from './BoardsInfo';
import CardEnd from './CardEnd';
import CardTitle from './CardTitle';

const InnerContainer = styled(Flex, Box, {
  px: '$32',
  backgroundColor: '$white',
  borderRadius: '$12',
});

type CardBodyProps = {
  userId: string;
  team: Team;
  index?: number;
};

const CardBody = React.memo<CardBodyProps>(({ userId, team }) => {
  const { data: session } = useSession();

  const isSAdmin = session?.isSAdmin;

  const { _id: id, users } = team;

  const userIsParticipating = useMemo(
    () => users.some((user) => user.user._id === userId),
    [users, userId],
  );

  const havePermissions = useMemo(() => {
    if (isSAdmin) {
      return true;
    }

    const myUser = team.users.find((user) => String(user.user?._id) === String(userId));

    return (
      team && (myUser?.role === TeamUserRoles.ADMIN || myUser?.role === TeamUserRoles.STAKEHOLDER)
    );
  }, [isSAdmin, team, userId]);

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
            name="blob-team"
            css={{
              width: '$32',
              height: '$32',
              zIndex: 1,
            }}
          />

          <Flex align="center" gap="8">
            <CardTitle teamId={id} title={team.name} />
          </Flex>
        </Flex>

        <Flex align="center" css={{ justifyContent: 'start', width: '$683' }} gap="8">
          <Flex align="center" css={{ width: '$160' }}>
            <Text color="primary300" size="sm">
              Members
            </Text>

            <CardAvatars
              listUsers={team.users}
              responsible={false}
              teamAdmins={false}
              userId={userId}
            />
          </Flex>
          <Separator
            orientation="vertical"
            css={{
              ml: '$20',
              backgroundColor: '$primary100',
              height: '$24 !important',
            }}
          />

          <Flex align="center" css={{ ml: '$40', alignItems: 'center' }} gap="8">
            <Flex align="center" css={{ width: '$160' }}>
              <Text color="primary300" css={{ mr: '$2' }} size="sm">
                Team admin
              </Text>

              <CardAvatars teamAdmins listUsers={team.users} responsible={false} userId={userId} />
            </Flex>
            <Separator
              orientation="vertical"
              css={{
                ml: '$40',
                backgroundColor: '$primary100',
                height: '$24 !important',
              }}
            />

            <Flex align="center" css={{ width: '$237' }} justify="start">
              <BoardsInfo
                team={team}
                teamAdminOrStakeholder={havePermissions}
                userSAdmin={isSAdmin}
              />
            </Flex>
          </Flex>
        </Flex>
        <Flex css={{ width: '20%' }} justify="end">
          <CardEnd
            havePermissions={havePermissions}
            team={team}
            userId={userId}
            userIsParticipating={userIsParticipating}
            userSAdmin={isSAdmin}
          />
        </Flex>
      </InnerContainer>
    </Flex>
  );
});

export default CardBody;
