import useTeam from '@/hooks/useTeam';
import { TeamUser, TeamUserUpdate } from '@/types/team/team.user';
import React from 'react';
import { useRecoilState } from 'recoil';
import { useSession } from 'next-auth/react';

import Flex from '@/components/Primitives/Flex';
import Text from '@/components/Primitives/Text';
import Icon from '@/components/icons/Icon';
import { membersListState } from '@/store/team/atom/team.atom';

import Tooltip from '@/components/Primitives/Tooltip';
import { ConfigurationSettings } from '@/components/Board/Settings/partials/ConfigurationSettings';
import CardEndTeam from '@/components/Teams/Team/CardEnd';
import { IconButton, InnerContainer, StyledMemberTitle } from './styles';
import CardEndCreateTeam from '../CardEnd';

type CardBodyProps = {
  member: TeamUser;
  isTeamCreator?: boolean;
  isTeamMemberOrStakeholder?: boolean;
  isNewTeamPage?: boolean;
  isTeamPage?: boolean;
};

const CardMember = React.memo<CardBodyProps>(
  ({ isNewTeamPage, isTeamPage, member, isTeamCreator, isTeamMemberOrStakeholder }) => {
    const { data: session } = useSession();

    const [membersList, setMembersList] = useRecoilState(membersListState);

    const {
      updateTeamUser: { mutate },
    } = useTeam({ autoFetchTeam: false });

    const handleIsNewJoiner = (checked: boolean) => {
      const listUsersMembers = membersList.map((user) =>
        user.user._id === member.user._id ? { ...user, isNewJoiner: checked } : user,
      );

      setMembersList(listUsersMembers);
    };

    const isSAdmin = session?.isSAdmin;

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
      <Flex css={{ flex: '1 1 1', marginBottom: '$10' }} direction="column" gap="12">
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
                }}
              />
              <Flex align="center" gap="8">
                <StyledMemberTitle>
                  {`${member.user.firstName} ${member.user.lastName}`}
                </StyledMemberTitle>
              </Flex>
            </Flex>
            {!isSAdmin && isTeamMemberOrStakeholder && member.isNewJoiner && (
              <Flex align="center" css={{ width: '35%' }} gap="8" justify="end">
                <Text size="sm" weight="medium">
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
            {(!isTeamMemberOrStakeholder || isSAdmin) && (
              <Flex align="center" css={{ width: '35%' }} gap="8" justify="end">
                <ConfigurationSettings
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
                isTeamCreator={isTeamCreator}
                isTeamMemberOrStakeholder={isTeamMemberOrStakeholder}
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
