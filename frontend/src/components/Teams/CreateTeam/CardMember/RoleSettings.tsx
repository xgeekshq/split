import React from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { Popover, PopoverPortal } from '@radix-ui/react-popover';

import { PopoverContent } from '@/components/Primitives/Popover';
import Text from '@/components/Primitives/Text';

import { membersListState, userTeamsListState } from '@/store/team/atom/team.atom';
import { TeamUser, TeamUserUpdate } from '@/types/team/team.user';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';

import useTeam from '@/hooks/useTeam';
import Icon from '@/components/icons/Icon';
import { useRouter } from 'next/router';
import { PopoverCloseStyled, PopoverItemStyled, PopoverTriggerStyled } from './styles';

interface PopoverRoleSettingsProps {
  userId: string | undefined;
  teamId?: string | undefined;
  isTeamPage?: boolean;
}

const PopoverRoleSettings: React.FC<PopoverRoleSettingsProps> = React.memo(
  ({ userId, teamId, isTeamPage }) => {
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
        };

        mutate(updateTeamUserRole);
      }
    };

    let updateUserRole = (value: TeamUserRoles) => {
      const userFound = membersList.find((member) => member.user._id === userId);
      updateUser(value, userFound);
    };

    if (router.pathname.includes('users')) {
      updateUserRole = (value: TeamUserRoles) => {
        const teamUsers = userTeamsList.flatMap((team) => team.users);
        const teamFound = teamUsers.find((teamUser) => teamUser.team === teamId);

        updateUser(value, teamFound);
      };
    }

    const handleSelectFunction = (role: TeamUserRoles) =>
      isTeamPage ? updateUserRole(role) : selectRole(role);

    return (
      <Popover>
        <PopoverTriggerStyled
          css={{
            position: 'relative',
          }}
        >
          <Icon
            name="arrow-down"
            css={{
              width: '$20',
              height: '$20',
            }}
          />
        </PopoverTriggerStyled>
        <PopoverPortal>
          <PopoverContent css={{ width: '$360', height: '$316' }}>
            <PopoverCloseStyled>
              <PopoverItemStyled
                align="end"
                direction="column"
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
              </PopoverItemStyled>
            </PopoverCloseStyled>
            <PopoverCloseStyled>
              <PopoverItemStyled
                align="end"
                direction="column"
                onClick={() => {
                  handleSelectFunction(TeamUserRoles.ADMIN);
                }}
              >
                <Text css={{ textAlign: 'end' }} size="sm" fontWeight="medium">
                  Team Admin
                </Text>
                <Text css={{ textAlign: 'end' }} size="sm">
                  The team admin can nominate team admins / stakeholder and can create/delete/edit
                  team boards.
                </Text>
              </PopoverItemStyled>
            </PopoverCloseStyled>
            <PopoverCloseStyled>
              <PopoverItemStyled
                align="end"
                direction="column"
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
              </PopoverItemStyled>
            </PopoverCloseStyled>
          </PopoverContent>
        </PopoverPortal>
      </Popover>
    );
  },
);

export default PopoverRoleSettings;
