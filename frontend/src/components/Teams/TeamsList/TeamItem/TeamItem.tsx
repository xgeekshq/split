import React, { useMemo } from 'react';
import { useSession } from 'next-auth/react';

import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Flex from '@/components/Primitives/Layout/Flex';
import Separator from '@/components/Primitives/Separator/Separator';
import Text from '@/components/Primitives/Text/Text';
import { Team } from '@/types/team/team';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';
import { useRouter } from 'next/router';
import AvatarGroup from '@/components/Primitives/Avatars/AvatarGroup/AvatarGroup';
import { InnerContainer } from '@/components/Teams/styles';

import RoleSelector from '@/components/Teams/Team/TeamMemberItem/RoleSelector/RoleSelector';
import ConfirmationDialog from '@/components/Primitives/Alerts/ConfirmationDialog/ConfirmationDialog';
import Button from '@/components/Primitives/Inputs/Button/Button';
import useTeam from '@/hooks/useTeam';
import TeamTitle from './TeamTitle/TeamTitle';
import TeamBoards from './TeamBoards/TeamBoards';

export type TeamItemProps = {
  team: Team;
  isTeamPage?: boolean;
};

const TeamItem = React.memo<TeamItemProps>(({ team, isTeamPage }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const { deleteTeam, deleteTeamUser } = useTeam();

  const { id: userId, isSAdmin } = { ...session?.user };
  const { id, users, name } = team;
  const userFound = users.find((member) => member.user?._id === userId);

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

  const deleteTeamDescription = (
    <Text>
      Do you really want to delete the team <Text fontWeight="bold">{name}</Text>?
    </Text>
  );

  const handleDelete = () => {
    if (isTeamPage) {
      deleteTeam.mutate({ id });
    } else {
      deleteTeamUser.mutate({ teamUserId: userFound?._id });
    }
  };

  return (
    <Flex direction="column" data-testid="teamItem">
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

          <TeamTitle teamId={id} title={name} isTeamPage={isTeamPage} />
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
            {router.pathname.includes('users') && userFound ? (
              <RoleSelector role={userFound.role} userId={userId!} teamId={id} />
            ) : (
              <TeamBoards team={team} havePermissions={havePermissions} />
            )}
          </Flex>
        </Flex>
        <Flex css={{ flex: '0' }}>
          {havePermissions && (
            <ConfirmationDialog
              title="Delete team"
              description={deleteTeamDescription}
              confirmationHandler={handleDelete}
              confirmationLabel="Delete"
              tooltip="Delete team"
            >
              <Button isIcon size="sm">
                <Icon
                  name="trash-alt"
                  css={{
                    color: '$primary400',
                  }}
                />
              </Button>
            </ConfirmationDialog>
          )}
        </Flex>
      </InnerContainer>
    </Flex>
  );
});

export default TeamItem;
