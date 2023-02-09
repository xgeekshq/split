import React, { useMemo } from 'react';
import { useSession } from 'next-auth/react';

import { styled } from '@/styles/stitches/stitches.config';

import Icon from '@/components/icons/Icon';
import Box from '@/components/Primitives/Box';
import Flex from '@/components/Primitives/Flex';
import Separator from '@/components/Primitives/Separator';
import Text from '@/components/Primitives/Text';
import { Team } from '@/types/team/team';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';
import { useRouter } from 'next/router';
import RoleDescription from '@/components/Teams/CreateTeam/CardEnd/RoleDescription';
import PopoverRoleSettings from '@/components/Teams/CreateTeam/CardMember/RoleSettings';
import { TeamUser } from '@/types/team/team.user';
import AvatarGroup from '@/components/Primitives/Avatar/AvatarGroup';
import BoardsInfo from './BoardsInfo';
import CardEnd from './CardEnd';
import CardTitle from './CardTitle';

const InnerContainer = styled(Flex, Box, {
  px: '$32',
  backgroundColor: '$white',
  borderRadius: '$12',
});

type CardBodyProps = {
  userId: string | undefined;
  teamId?: string | undefined;
  team: Team;
  index?: number;
  isTeamPage?: boolean;
};

const CardBody = React.memo<CardBodyProps>(({ userId, teamId, team, isTeamPage }) => {
  const { data: session } = useSession();

  const router = useRouter();

  const isSAdmin = session?.user.isSAdmin;

  const { id, users } = team;

  const userFound: TeamUser | undefined = users.find((member) => member.user?._id === userId);

  const userRole = userFound?.role;

  const userIsParticipating = useMemo(
    () => users.some((user) => user.user?._id === userId),
    [users, userId],
  );

  const havePermissions = useMemo(() => {
    if (isSAdmin) {
      return true;
    }

    const myUser = team.users.find((user) => String(user.user?._id) === String(userId));

    if (!myUser) {
      return false;
    }

    return team && [TeamUserRoles.ADMIN, TeamUserRoles.STAKEHOLDER].includes(myUser.role);
  }, [isSAdmin, team, userId]);

  return (
    <Flex css={{ flex: '1 1 1' }} direction="column">
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
              flexShrink: 0,
            }}
          />

          <CardTitle teamId={id} title={team.name} isTeamPage={isTeamPage} />
        </Flex>
        <Flex align="center" css={{ justifyContent: 'start', pl: '$10' }} gap="8">
          <Flex align="center" css={{ width: '$160' }}>
            <Text color="primary300" size="sm">
              Members
            </Text>

            <AvatarGroup
              listUsers={team.users}
              responsible={false}
              teamAdmins={false}
              userId={userId}
            />
          </Flex>
          <Separator orientation="vertical" size="lg" css={{ ml: '$20' }} />

          <Flex align="center" css={{ ml: '$20', alignItems: 'center' }} gap="8">
            <Flex align="center" css={{ width: '$160' }}>
              <Text color="primary300" css={{ mr: '$2' }} size="sm">
                Team admin
              </Text>

              <AvatarGroup
                stakeholders
                teamAdmins
                listUsers={team.users}
                responsible={false}
                userId={userId}
              />
            </Flex>
            <Separator orientation="vertical" size="lg" css={{ ml: '$20' }} />
            {router.pathname.includes('users') ? (
              <Flex align="center" css={{ width: '$237' }} justify="end">
                <RoleDescription role={userRole} />

                <PopoverRoleSettings userId={userId} isTeamPage teamId={teamId} />
              </Flex>
            ) : (
              <Flex align="center" css={{ width: '$237' }} justify="start">
                <BoardsInfo
                  team={team}
                  teamAdminOrStakeholder={havePermissions}
                  userSAdmin={isSAdmin}
                />
              </Flex>
            )}
          </Flex>
        </Flex>
        <Flex css={{ width: '20%' }} justify="end">
          <CardEnd
            havePermissions={havePermissions}
            team={team}
            teamUserId={userFound?._id}
            userIsParticipating={userIsParticipating}
            userSAdmin={isSAdmin}
            isTeamPage={isTeamPage}
          />
        </Flex>
      </InnerContainer>
    </Flex>
  );
});

export default CardBody;
