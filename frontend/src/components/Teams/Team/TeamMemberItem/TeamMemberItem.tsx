import React from 'react';
import { useRecoilState } from 'recoil';

import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import BoardRolePopover from '@/components/Primitives/Popovers/BoardRolePopover/BoardRolePopover';
import NewJoinerTooltip from '@/components/Primitives/Tooltips/NewJoinerTooltip/NewJoinerTooltip';
import MemberTitle from '@/components/Teams/Team/TeamMemberItem/MemberTitle/MemberTitle';
import RoleSelector from '@/components/Teams/Team/TeamMemberItem/RoleSelector/RoleSelector';
import { TeamUserRoles } from '@/enums/teams/userRoles';
import useUpdateTeamUser from '@/hooks/teams/useUpdateTeamUser';
import useCurrentSession from '@/hooks/useCurrentSession';
import { createTeamState } from '@/store/team.atom';
import { InnerContainer } from '@/styles/pages/pages.styles';
import { TeamUser, TeamUserUpdate } from '@/types/team/team.user';
import Avatar from '@components/Primitives/Avatars/Avatar/Avatar';

export type TeamMemberItemProps = {
  member: TeamUser;
  isTeamPage?: boolean;
  hasPermissions?: boolean;
};

const TeamMemberItem = React.memo<TeamMemberItemProps>(
  ({ isTeamPage = false, member, hasPermissions = false }) => {
    const { userId, isSAdmin } = useCurrentSession();
    const canChangeRole = hasPermissions && userId !== member.user._id;

    const [createTeamMembers, setCreateTeamMembers] = useRecoilState(createTeamState);

    const { mutate } = useUpdateTeamUser(member.team!);

    const isNewJoinerHandler = (checked: boolean) => {
      if (isTeamPage && member.team) {
        const updateTeamUser: TeamUserUpdate = {
          team: member.team,
          user: member.user._id,
          role: member.role,
          isNewJoiner: checked,
          canBeResponsible: !checked,
        };

        mutate(updateTeamUser);
      } else {
        const updatedCreateTeamMembers = createTeamMembers.map((user) =>
          user.user._id === member.user._id
            ? { ...user, isNewJoiner: checked, canBeResponsible: !checked }
            : user,
        );

        setCreateTeamMembers(updatedCreateTeamMembers);
      }
    };

    const canBeResponsibleHandler = (checked: boolean) => {
      if (isTeamPage && member.team) {
        const updateTeamUser: TeamUserUpdate = {
          team: member.team,
          user: member.user._id,
          role: member.role,
          isNewJoiner: member.isNewJoiner,
          canBeResponsible: checked,
        };

        mutate(updateTeamUser);
      } else {
        const updatedCreateTeamMembers = createTeamMembers.map((user) =>
          user.user._id === member.user._id ? { ...user, canBeResponsible: checked } : user,
        );

        setCreateTeamMembers(updatedCreateTeamMembers);
      }
    };

    const handleRoleChange = (role: TeamUserRoles) => {
      if (isTeamPage && member.team) {
        const updateTeamUser: TeamUserUpdate = {
          team: member.team,
          user: member.user._id,
          role,
          isNewJoiner: member.isNewJoiner,
          canBeResponsible: member.canBeResponsible,
        };

        mutate(updateTeamUser);
      } else {
        const updatedCreateTeamMembers = createTeamMembers.map((user) =>
          user.user._id === member.user._id ? { ...user, role } : user,
        );

        setCreateTeamMembers(updatedCreateTeamMembers);
      }
    };

    return (
      <Flex data-testid="teamMemberItem" direction="column">
        <InnerContainer align="center" elevation="1" gap="40">
          <Flex align="center" css={{ flex: '4' }} gap="8">
            {member.user.avatar ? (
              <Avatar
                key={`${member}-${member._id}-${Math.random()}`}
                css={{ position: 'relative', mr: '$10' }}
                fallbackText={member.user.firstName.charAt(0) + member.user.lastName.charAt(0)}
                size={32}
                src={member.user.avatar}
              />
            ) : (
              <Icon name="blob-personal" size={32} />
            )}
            <MemberTitle
              hasPermissions={isSAdmin}
              name={`${member.user.firstName} ${member.user.lastName}`}
              userId={member.user._id}
            />
          </Flex>
          <Flex align="center">
            {(hasPermissions || !isTeamPage) && (
              <BoardRolePopover
                canBeResponsible={member.canBeResponsible}
                canBeResponsibleHandler={canBeResponsibleHandler}
                isNewJoiner={member.isNewJoiner}
                isNewJoinerHandler={isNewJoinerHandler}
              />
            )}
            {isTeamPage && !hasPermissions && member.isNewJoiner && <NewJoinerTooltip />}
          </Flex>
          <Flex css={{ flex: '2' }} justify="end">
            <RoleSelector
              canChangeRole={canChangeRole}
              handleRoleChange={handleRoleChange}
              role={member.role}
            />
          </Flex>
        </InnerContainer>
      </Flex>
    );
  },
);

export default TeamMemberItem;
