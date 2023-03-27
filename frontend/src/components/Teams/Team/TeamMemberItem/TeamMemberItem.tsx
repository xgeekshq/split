import { TeamUser, TeamUserUpdate } from '@/types/team/team.user';
import React from 'react';
import { useRecoilState } from 'recoil';

import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Icon from '@/components/Primitives/Icons/Icon/Icon';

import RoleSelector from '@/components/Teams/Team/TeamMemberItem/RoleSelector/RoleSelector';
import { InnerContainer } from '@/styles/pages/pages.styles';
import useCurrentSession from '@/hooks/useCurrentSession';
import NewJoinerTooltip from '@/components/Primitives/Tooltips/NewJoinerTooltip/NewJoinerTooltip';
import BoardRolePopover from '@/components/Primitives/Popovers/BoardRolePopover/BoardRolePopover';
import useUpdateTeamUser from '@/hooks/teams/useUpdateTeamUser';
import { createTeamState } from '@/store/team/atom/team.atom';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';
import MemberTitle from './MemberTitle/MemberTitle';

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
      <Flex direction="column" data-testid="teamMemberItem">
        <InnerContainer align="center" elevation="1" gap="40">
          <Flex align="center" gap="8" css={{ flex: '4' }}>
            <Icon name="blob-personal" size={32} />
            <MemberTitle
              userId={member.user._id}
              name={`${member.user.firstName} ${member.user.lastName}`}
              hasPermissions={isSAdmin!}
            />
          </Flex>
          <Flex align="center">
            {(hasPermissions || !isTeamPage) && (
              <BoardRolePopover
                isNewJoinerHandler={isNewJoinerHandler}
                isNewJoiner={member.isNewJoiner}
                canBeResponsibleHandler={canBeResponsibleHandler}
                canBeResponsible={member.canBeResponsible}
              />
            )}
            {isTeamPage && !hasPermissions && member.isNewJoiner && <NewJoinerTooltip />}
          </Flex>
          <Flex css={{ flex: '2' }} justify="end">
            <RoleSelector
              role={member.role}
              canChangeRole={canChangeRole}
              handleRoleChange={handleRoleChange}
            />
          </Flex>
        </InnerContainer>
      </Flex>
    );
  },
);

export default TeamMemberItem;
