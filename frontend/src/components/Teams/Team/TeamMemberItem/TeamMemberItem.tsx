import { TeamUser, TeamUserUpdate } from '@/types/team/team.user';
import React from 'react';
import { useRecoilState } from 'recoil';
import { useSession } from 'next-auth/react';

import Flex from '@/components/Primitives/Layout/Flex';
import Text from '@/components/Primitives/Text/Text';
import Icon from '@/components/Primitives/Icons/Icon/Icon';
import { membersListState } from '@/store/team/atom/team.atom';

import ConfigurationSwitch from '@/components/Primitives/Inputs/Switches/ConfigurationSwitch/ConfigurationSwitch';

import useTeam from '@/hooks/useTeam';
import RoleSelector from '@/components/Teams/Team/TeamMemberItem/partials/RoleSelector';
import { InnerContainer } from '../../styles';
import NewJoinerTooltip from '../../../Primitives/Tooltips/NewJoinerTooltip/NewJoinerTooltip';

export type TeamMemberItemProps = {
  member: TeamUser;
  isTeamPage?: boolean;
  hasPermissions?: boolean;
};

const TeamMemberItem = React.memo<TeamMemberItemProps>(
  ({ isTeamPage = false, member, hasPermissions = false }) => {
    const { data: session } = useSession();
    const canChangeRole = hasPermissions && session?.user.id !== member.user._id;

    const [membersList, setMembersList] = useRecoilState(membersListState);

    const {
      updateTeamUser: { mutate },
    } = useTeam();

    const handleIsNewJoiner = (checked: boolean) => {
      const listUsersMembers = membersList.map((user) =>
        user.user._id === member.user._id ? { ...user, isNewJoiner: checked } : user,
      );

      setMembersList(listUsersMembers);
    };

    const updateIsNewJoinerStatus = (checked: boolean) => {
      if (member.team) {
        const updateTeamUser: TeamUserUpdate = {
          team: member.team,
          user: member.user._id,
          role: member.role,
          isNewJoiner: checked,
        };

        mutate(updateTeamUser);
      }
    };

    const handleSelectFunction = (checked: boolean) =>
      isTeamPage ? updateIsNewJoinerStatus(checked) : handleIsNewJoiner(checked);

    return (
      <Flex direction="column" data-testid="teamMemberItem">
        <InnerContainer align="center" elevation="1" gap="40">
          <Flex align="center" gap="8" css={{ flex: '4' }}>
            <Icon name="blob-personal" size={32} />
            <Text
              size="sm"
              fontWeight="bold"
            >{`${member.user.firstName} ${member.user.lastName}`}</Text>
          </Flex>
          <Flex align="center" gap="8">
            {(hasPermissions || !isTeamPage) && (
              <ConfigurationSwitch
                handleCheckedChange={handleSelectFunction}
                isChecked={member.isNewJoiner}
                title="New Joiner"
              />
            )}
            {isTeamPage && !hasPermissions && member.isNewJoiner && <NewJoinerTooltip />}
          </Flex>
          <Flex css={{ flex: '2' }} justify="end">
            <RoleSelector
              isTeamPage
              role={member.role}
              userId={member.user._id}
              canChangeRole={canChangeRole}
            />
          </Flex>
        </InnerContainer>
      </Flex>
    );
  },
);

export default TeamMemberItem;
