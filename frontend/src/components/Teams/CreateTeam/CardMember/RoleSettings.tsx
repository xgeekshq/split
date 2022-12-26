import React from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { Popover, PopoverPortal } from '@radix-ui/react-popover';

import { PopoverContent } from '@/components/Primitives/Popover';
import Text from '@/components/Primitives/Text';

import { membersListState, userTeamsListState } from '@/store/team/atom/team.atom';
import { TeamUserUpdate } from '@/types/team/team.user';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';

import useTeam from '@/hooks/useTeam';
import Icon from '@/components/icons/Icon';
import { useRouter } from 'next/router';
import { PopoverCloseStyled, PopoverItemStyled, PopoverTriggerStyled } from './styles';

interface PopoverRoleSettingsProps {
  userId: string | undefined;
  isTeamPage?: boolean;
  isTeamCreator?: boolean;
}

const PopoverRoleSettings: React.FC<PopoverRoleSettingsProps> = React.memo(
  ({ userId, isTeamPage, isTeamCreator }) => {
    const membersList = useRecoilValue(membersListState);
    const setMembersList = useSetRecoilState(membersListState);

    const userTeamsList = useRecoilValue(userTeamsListState);

    const router = useRouter();

    const { updateTeamUser, updateUserTeam } = useTeam();

    const selectRole = (value: TeamUserRoles) => {
      const members = membersList.map((member) =>
        member.user._id === userId ? { ...member, role: value } : member,
      );

      setMembersList(members);
    };

    let updateUserRole: (value: TeamUserRoles) => void;

    updateUserRole = (value: TeamUserRoles) => {
      const userFound = membersList.find((member) => member.user._id === userId);

      if (userFound && userFound.team) {
        const updateTeamUserRole: TeamUserUpdate = {
          team: userFound.team,
          user: userId,
          role: value,
          isNewJoiner: userFound.isNewJoiner,
        };

        updateTeamUser.mutate(updateTeamUserRole);
      }
    };

    if (router.pathname.includes('users')) {
      updateUserRole = (value: TeamUserRoles) => {
        const users = userTeamsList.flatMap((team) => team.users);

        const userFound = users.find((member) => member.user._id === userId);

        if (userFound && userFound.team) {
          const updateTeamUserRole: TeamUserUpdate = {
            team: userFound.team,
            user: userId,
            role: value,
            isNewJoiner: userFound.isNewJoiner,
          };

          updateUserTeam.mutate(updateTeamUserRole);
        }
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
            {!isTeamCreator && (
              <PopoverCloseStyled>
                <PopoverItemStyled
                  align="end"
                  direction="column"
                  onClick={() => {
                    handleSelectFunction(TeamUserRoles.MEMBER);
                  }}
                >
                  <Text css={{ textAlign: 'end' }} size="sm" weight="medium">
                    Team Member
                  </Text>

                  <Text css={{ textAlign: 'end' }} size="sm">
                    The team member can create boards and can create teams.
                  </Text>
                </PopoverItemStyled>
              </PopoverCloseStyled>
            )}
            <PopoverCloseStyled>
              <PopoverItemStyled
                align="end"
                direction="column"
                onClick={() => {
                  handleSelectFunction(TeamUserRoles.ADMIN);
                }}
              >
                <Text css={{ textAlign: 'end' }} size="sm" weight="medium">
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
                <Text css={{ textAlign: 'end' }} size="sm" weight="medium">
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
