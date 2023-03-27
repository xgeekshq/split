import { useRouter } from 'next/router';
import React, { useMemo } from 'react';

import ConfirmationDialog from '@/components/Primitives/Alerts/ConfirmationDialog/ConfirmationDialog';
import AvatarGroup from '@/components/Primitives/Avatars/AvatarGroup/AvatarGroup';
import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Button from '@/components/Primitives/Inputs/Button/Button';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Separator from '@/components/Primitives/Separator/Separator';
import Text from '@/components/Primitives/Text/Text';
import RoleSelector from '@/components/Teams/Team/TeamMemberItem/RoleSelector/RoleSelector';
import { InnerContainer } from '@/styles/pages/pages.styles';
import { Team } from '@/types/team/team';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';

import useDeleteTeam from '@/hooks/teams/useDeleteTeam';
import useDeleteTeamUser from '@/hooks/teams/useDeleteTeamUser';
import useUpdateTeamUser from '@/hooks/teams/useUpdateTeamUser';
import { TeamUserUpdate } from '@/types/team/team.user';
import TeamBoards from './TeamBoards/TeamBoards';
import TeamTitle from './TeamTitle/TeamTitle';

export type TeamItemProps = {
  team: Team;
  userId: string;
  isSAdmin: boolean;
};

const TeamItem = React.memo(({ team, userId, isSAdmin }: TeamItemProps) => {
  const { id: teamId, users: teamUsers, name: teamName } = team;

  const { pathname, query } = useRouter();
  const isTeamPage = pathname.includes('teams');
  const queryUserId = (!isTeamPage && query.userId ? query.userId : userId) as string;

  const { mutate: deleteTeam } = useDeleteTeam();
  const { mutate: updateUser } = useUpdateTeamUser(teamId, queryUserId);
  const { mutate: deleteTeamUser } = useDeleteTeamUser(queryUserId);

  const userFound = useMemo(
    () => teamUsers.find((teamUser) => String(teamUser.user?._id) === String(queryUserId))!,
    [teamUsers, queryUserId],
  );

  const havePermissions = useMemo(() => {
    if (isSAdmin) {
      return true;
    }

    if (!userFound) {
      return false;
    }

    return [TeamUserRoles.ADMIN, TeamUserRoles.STAKEHOLDER].includes(userFound.role);
  }, [isSAdmin, userFound]);

  const handleRoleChange = (role: TeamUserRoles) => {
    const updateTeamUser: TeamUserUpdate = {
      team: userFound.team!,
      user: userFound.user._id,
      role,
      isNewJoiner: userFound.isNewJoiner,
      canBeResponsible: userFound.canBeResponsible,
    };

    updateUser(updateTeamUser);
  };

  const confirmationDialogDescription = () => {
    if (isTeamPage) {
      return (
        <Text>
          Do you really want to delete the team <Text fontWeight="bold">{teamName}</Text>?
        </Text>
      );
    }
    const userFoundName = (
      <Text fontWeight="bold">
        {userFound?.user.firstName} {userFound?.user.lastName}
      </Text>
    );

    return (
      <Text>
        Do you really want to remove {userFoundName} from <Text fontWeight="bold">{teamName}</Text>?
      </Text>
    );
  };

  const handleDelete = () => {
    if (isTeamPage) {
      deleteTeam(teamId);
    } else {
      deleteTeamUser(userFound._id!);
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

          <TeamTitle teamId={teamId} title={teamName} />
        </Flex>
        <Flex align="center" justify="start" gap="40" css={{ flex: '3' }}>
          <Flex align="center" gap="8">
            <Text color="primary300" size="sm">
              Members
            </Text>

            <AvatarGroup listUsers={teamUsers} userId={userId} css={{ minWidth: '$88' }} />
          </Flex>

          <Separator orientation="vertical" size="lg" />

          <Flex align="center" gap="8">
            <Text color="primary300" size="sm">
              Team admin
            </Text>

            <AvatarGroup
              stakeholders
              teamAdmins
              listUsers={teamUsers}
              userId={userId}
              css={{ minWidth: '$88' }}
            />
          </Flex>

          <Separator orientation="vertical" size="lg" />

          <Flex align="center">
            {!isTeamPage && userFound ? (
              <RoleSelector role={userFound.role} handleRoleChange={handleRoleChange} />
            ) : (
              <TeamBoards team={team} havePermissions={havePermissions} />
            )}
          </Flex>
        </Flex>
        <Flex css={{ flex: '0' }}>
          {havePermissions && (
            <ConfirmationDialog
              title={isTeamPage ? 'Delete team' : 'Remove User'}
              description={confirmationDialogDescription()}
              confirmationHandler={handleDelete}
              confirmationLabel={isTeamPage ? 'Delete' : 'Remove'}
              tooltip={isTeamPage ? 'Delete team' : 'Remove user'}
            >
              <Button isIcon size="sm">
                <Icon
                  name={isTeamPage ? 'trash-alt' : 'user-slash'}
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
