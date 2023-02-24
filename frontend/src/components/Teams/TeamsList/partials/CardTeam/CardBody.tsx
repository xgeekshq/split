import React, { useMemo } from 'react';
import { useSession } from 'next-auth/react';

import { styled } from '@/styles/stitches/stitches.config';

import Icon from '@/components/Primitives/Icon';
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
import CardTitle from './CardTitle';
import DeleteTeam from './DeleteTeam';

const InnerContainer = styled(Flex, Box, {
  px: '$32',
  py: '$22',
  backgroundColor: '$white',
  borderRadius: '$12',
  position: 'relative',
  maxHeight: '$76',
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

  const { id, users, name } = team;
  const userFound: TeamUser | undefined = users.find((member) => member.user?._id === userId);
  const userRole = userFound?.role;

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
    <Flex direction="column">
      <InnerContainer align="center" elevation="1" gap="40">
        <Flex align="center" gap="8" css={{ flex: '1' }}>
          <Icon
            name="blob-team"
            size={32}
            css={{
              zIndex: 1,
              flexShrink: 0,
            }}
          />

          <CardTitle teamId={id} title={name} isTeamPage={isTeamPage} />
        </Flex>
        <Flex align="center" justify="start" gap="40" css={{ flex: '3' }}>
          <Flex align="center" gap="8">
            <Text color="primary300" size="sm">
              Members
            </Text>

            <AvatarGroup
              listUsers={users}
              responsible={false}
              teamAdmins={false}
              userId={userId}
              css={{ minWidth: '$88' }}
            />
          </Flex>

          <Separator orientation="vertical" size="lg" />

          <Flex align="center" gap="8">
            <Text color="primary300" size="sm">
              Team admin
            </Text>

            <AvatarGroup
              stakeholders
              teamAdmins
              listUsers={users}
              responsible={false}
              userId={userId}
              css={{ minWidth: '$88' }}
            />
          </Flex>

          <Separator orientation="vertical" size="lg" />

          <Flex align="center">
            {router.pathname.includes('users') ? (
              <>
                <RoleDescription role={userRole} />
                <PopoverRoleSettings userId={userId} isTeamPage teamId={teamId} />
              </>
            ) : (
              <BoardsInfo
                team={team}
                teamAdminOrStakeholder={havePermissions}
                userSAdmin={isSAdmin}
              />
            )}
          </Flex>
        </Flex>
        <Flex css={{ flex: '0' }}>
          {havePermissions && (
            <DeleteTeam
              teamName={name}
              teamId={id}
              teamUserId={userFound?._id}
              isTeamPage={isTeamPage}
            />
          )}
        </Flex>
      </InnerContainer>
    </Flex>
  );
});

export default CardBody;
