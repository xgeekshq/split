import React from 'react';

import Flex from '@/components/Primitives/Flex';
import Text from '@/components/Primitives/Text';
import Icon from '@/components/icons/Icon';
import {
  IconButton,
  InnerContainer,
  StyledMemberTitle,
} from '@/components/Teams/CreateTeam/CardMember/styles';
import { BoardUser, BoardUserAddAndRemove } from '@/types/board/board.user';
import Tooltip from '@/components/Primitives/Tooltip';
import useParticipants from '@/hooks/useParticipants';
import { useRouter } from 'next/router';
import { ConfigurationSwitchSettings } from '@/components/Board/Settings/partials/ConfigurationSettings/ConfigurationSwitch';
import { BoardUserRoles } from '@/utils/enums/board.user.roles';
import { useRecoilState } from 'recoil';
import { boardParticipantsState } from '@/store/board/atoms/board.atom';

type CardBodyProps = {
  member: BoardUser;
  isCurrentUserResponsible: boolean;
  isCurrentUserSAdmin: boolean;
  isMemberCurrentUser: boolean;
  isOpen?: boolean;
};

const ParticipantCard = React.memo<CardBodyProps>(
  ({ member, isCurrentUserResponsible, isCurrentUserSAdmin, isMemberCurrentUser, isOpen }) => {
    const {
      addAndRemoveBoardParticipants: { mutate },
    } = useParticipants();

    const router = useRouter();
    const boardId = router.query.boardId as string;
    const [boardParticipants, setBoardParticipants] = useRecoilState(boardParticipantsState);

    const isMemberResponsible = member.role === BoardUserRoles.RESPONSIBLE;

    const handleRemove = () => {
      if (!member._id) return;

      const boardUsersToUpdate: BoardUserAddAndRemove = {
        addBoardUsers: [],
        removeBoardUsers: [member._id],
        boardId,
      };

      mutate(boardUsersToUpdate);
    };

    const updateIsResponsibleStatus = (checked: boolean) => {
      // if (member.team) {
      //   const updateTeamUser: TeamUserUpdate = {
      //     team: member.team,
      //     user: member.user._id,
      //     role: member.role,
      //     isNewJoiner: checked,
      //   };

      //   mutate(updateTeamUser);
      // }
      const participantsList = [...boardParticipants];
      const idxParticipantToUpdate = participantsList.findIndex(
        (boardUser) => boardUser._id === member._id,
      );
      participantsList.splice(idxParticipantToUpdate, 1);
      if (checked) {
        participantsList.splice(idxParticipantToUpdate, 0, {
          ...member,
          role: BoardUserRoles.RESPONSIBLE,
        });
      } else {
        participantsList.splice(idxParticipantToUpdate, 0, {
          ...member,
          role: BoardUserRoles.MEMBER,
        });
      }
      setBoardParticipants(participantsList);
    };

    const handleSelectFunction = (checked: boolean) => updateIsResponsibleStatus(checked);

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
            <Flex align="center" css={{ width: '100%' }} gap="8">
              <Icon
                name="blob-personal"
                css={{
                  width: '32px',
                  height: '$32',
                  zIndex: 1,
                  opacity: isOpen ? 0.2 : 1,
                }}
              />
              <Flex align="center" gap="8" justify="start" css={{ width: '50%' }}>
                <StyledMemberTitle>
                  {`${member.user.firstName} ${member.user.lastName}`}
                </StyledMemberTitle>
              </Flex>

              <Flex css={{ width: '50%' }} justify="between">
                {(isCurrentUserSAdmin || isCurrentUserResponsible) && (
                  <Flex align="center" gap="8" justify="start">
                    <ConfigurationSwitchSettings
                      handleCheckedChange={handleSelectFunction}
                      isChecked={isMemberResponsible}
                      text=""
                      title="Responsible"
                    />
                  </Flex>
                )}
                {(isCurrentUserSAdmin || (isCurrentUserResponsible && !isMemberCurrentUser)) && (
                  <Flex align="center" justify="end">
                    <Tooltip content="Remove participant">
                      <Flex justify="end">
                        <IconButton
                          onClick={handleRemove}
                          css={{
                            '&:hover': {
                              cursor: 'pointer',
                            },
                          }}
                        >
                          <Icon
                            name="trash-alt"
                            css={{
                              color: '$primary400',
                              size: '$20',
                            }}
                          />
                        </IconButton>
                      </Flex>
                    </Tooltip>
                  </Flex>
                )}

                {isMemberResponsible && !isCurrentUserResponsible && !isCurrentUserSAdmin && (
                  <Flex align="center" css={{ width: '100%' }} gap="8" justify="end">
                    <Text size="sm" fontWeight="medium">
                      Responsible
                    </Text>
                  </Flex>
                )}
              </Flex>
            </Flex>
          </InnerContainer>
        </Flex>
      </Flex>
    );
  },
);

export default ParticipantCard;
