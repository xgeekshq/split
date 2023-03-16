import React from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverItem,
  PopoverClose,
} from '@/components/Primitives/Popovers/Popover/Popover';
import Text from '@/components/Primitives/Text/Text';

import { membersListState, userTeamsListState } from '@/store/team/atom/team.atom';
import { TeamUser, TeamUserUpdate } from '@/types/team/team.user';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';

import useTeam from '@/hooks/useTeam';
import Icon from '@/components/Primitives/Icons/Icon/Icon';
import { useRouter } from 'next/router';

export type TeamRolePopoverProps = {
  userId: string | undefined;
  teamId?: string | undefined;
  isTeamPage?: boolean;
};

const TeamRolePopover = React.memo(({ userId, teamId, isTeamPage }: TeamRolePopoverProps) => {
  const membersList = useRecoilValue(membersListState);
  const setMembersList = useSetRecoilState(membersListState);
  const userTeamsList = useRecoilValue(userTeamsListState);

  const router = useRouter();

  const {
    updateTeamUser: { mutate },
  } = useTeam();

  const selectRole = (value: TeamUserRoles) => {
    const members = membersList.map((member) =>
      member.user._id === userId ? { ...member, role: value } : member,
    );

    setMembersList(members);
  };

  const updateUser = (value: TeamUserRoles, teamUser?: TeamUser) => {
    if (teamUser && teamUser.team) {
      const updateTeamUserRole: TeamUserUpdate = {
        team: teamUser.team,
        user: userId,
        role: value,
        isNewJoiner: teamUser.isNewJoiner,
        canBeResponsible: teamUser.canBeResponsible,
      };

      mutate(updateTeamUserRole);
    }
  };

  const updateUserRole = (value: TeamUserRoles) => {
    let userFound: TeamUser | undefined;

    if (router.pathname.includes('users')) {
      const teamUsers = userTeamsList.flatMap((team) => team.users);
      userFound = teamUsers.find((teamUser) => teamUser.team === teamId);
    } else {
      userFound = membersList.find((member) => member.user._id === userId);
    }

    updateUser(value, userFound);
  };

  const handleSelectFunction = (role: TeamUserRoles) =>
    isTeamPage ? updateUserRole(role) : selectRole(role);

  return (
    <Popover>
      <PopoverTrigger variant="dark" size="sm" data-testid="teamRolePopoverTrigger">
        <Icon name="arrow-down" />
      </PopoverTrigger>
      <PopoverContent
        css={{ width: '$360', height: '$316' }}
        collisionPadding={32}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <PopoverClose>
          <PopoverItem
            align="end"
            direction="column"
            css={{ pr: '$16', height: '$100' }}
            onClick={() => {
              handleSelectFunction(TeamUserRoles.MEMBER);
            }}
          >
            <Text css={{ textAlign: 'end' }} size="sm" fontWeight="medium">
              Team Member
            </Text>

            <Text css={{ textAlign: 'end' }} size="sm">
              The team member can create boards and can create teams.
            </Text>
          </PopoverItem>
        </PopoverClose>
        <PopoverClose>
          <PopoverItem
            align="end"
            direction="column"
            css={{ pr: '$16', height: '$100' }}
            onClick={() => {
              handleSelectFunction(TeamUserRoles.ADMIN);
            }}
          >
            <Text css={{ textAlign: 'end' }} size="sm" fontWeight="medium">
              Team Admin
            </Text>
            <Text css={{ textAlign: 'end' }} size="sm">
              The team admin can nominate team admins / stakeholder and can create/delete/edit team
              boards.
            </Text>
          </PopoverItem>
        </PopoverClose>
        <PopoverClose>
          <PopoverItem
            align="end"
            direction="column"
            css={{ pr: '$16', height: '$100' }}
            onClick={() => {
              handleSelectFunction(TeamUserRoles.STAKEHOLDER);
            }}
          >
            <Text css={{ textAlign: 'end' }} size="sm" fontWeight="medium">
              Stakeholder
            </Text>
            <Text css={{ textAlign: 'end' }} size="sm">
              Stakeholders will not be included in sub-team SPLIT retrospectives.
            </Text>
          </PopoverItem>
        </PopoverClose>
      </PopoverContent>
    </Popover>
  );
});

export default TeamRolePopover;
