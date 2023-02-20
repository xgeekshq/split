import { TeamUser, TeamUserUpdate } from '@/types/team/team.user';
import React from 'react';
import { useRecoilState } from 'recoil';
import { useSession } from 'next-auth/react';

import Flex from '@/components/Primitives/Flex';
import Text from '@/components/Primitives/Text';
import Icon from '@/components/Primitives/Icon';
import { membersListState } from '@/store/team/atom/team.atom';

import Tooltip from '@/components/Primitives/Tooltip';
import { ConfigurationSwitchSettings } from '@/components/Board/Settings/partials/ConfigurationSettings/ConfigurationSwitch';
import CardEndTeam from '@/components/Teams/Team/CardEnd';

import useTeam from '@/hooks/useTeam';
import { IconButton, InnerContainer, StyledMemberTitle } from './styles';
import CardEndCreateTeam from '../CardEnd';

type CardBodyProps = {
  member: TeamUser;
  isTeamCreator?: boolean;
  isNewTeamPage?: boolean;
  isTeamPage?: boolean;
  isTeamMember?: boolean;
  isOpen?: boolean;
};

const CardMember = React.memo<CardBodyProps>(
  ({ isNewTeamPage, isTeamPage, member, isTeamCreator, isTeamMember, isOpen }) => {
    const { data: session } = useSession();

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

    const isSAdmin = session?.user.isSAdmin;

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
      <Flex css={{ flex: '1 1 1' }} direction="column">
        <Flex>
          <InnerContainer
            align="center"
            elevation="1"
            justify="between"
            css={{
              position: 'relative',
              flex: '1 1 0',
              py: '$22',
              maxHeight: '$76',
              ml: 0,
            }}
          >
            <Flex align="center" css={{ width: '23%' }} gap="8">
              <Icon
                name="blob-personal"
                css={{
                  width: '32px',
                  height: '$32',
                  zIndex: 1,
                  opacity: isOpen ? 0.2 : 1,
                }}
              />
              <Flex align="center" gap="8">
                <StyledMemberTitle>
                  {`${member.user.firstName} ${member.user.lastName}`}
                </StyledMemberTitle>
              </Flex>
            </Flex>
            {!isTeamMember && isTeamCreator && !isSAdmin && (
              <Flex align="center" css={{ width: '35%' }} gap="8" justify="end">
                <ConfigurationSwitchSettings
                  handleCheckedChange={handleSelectFunction}
                  isChecked={member.isNewJoiner}
                  title="New Joiner"
                />
              </Flex>
            )}
            {!isSAdmin && isTeamMember && member.isNewJoiner && (
              <Flex align="center" css={{ width: '35%' }} gap="8" justify="end">
                <Text size="sm" fontWeight="medium">
                  New Joiner
                </Text>
                <Tooltip
                  content={
                    <Text color="white" size="sm">
                      The new joiner will not be selected as a responsible for the TEAM sub-teams.
                    </Text>
                  }
                >
                  <IconButton>
                    <Icon
                      name="info"
                      css={{
                        '&:hover': { cursor: 'pointer' },
                      }}
                    />
                  </IconButton>
                </Tooltip>
              </Flex>
            )}
            {(!(isTeamMember || isTeamCreator) || isSAdmin) && (
              <Flex align="center" css={{ width: '35%' }} gap="8" justify="end">
                <ConfigurationSwitchSettings
                  handleCheckedChange={handleSelectFunction}
                  isChecked={member.isNewJoiner}
                  text=""
                  title="New Joiner"
                />
              </Flex>
            )}
            {isNewTeamPage && (
              <CardEndCreateTeam
                isTeamCreator={isTeamCreator}
                role={member.role}
                userId={member.user._id}
              />
            )}
            {isTeamPage && (
              <CardEndTeam
                isTeamPage
                isSAdmin={isSAdmin}
                isTeamMember={isTeamMember}
                role={member.role}
                userId={member.user._id}
              />
            )}
          </InnerContainer>
        </Flex>
      </Flex>
    );
  },
);

export default CardMember;
