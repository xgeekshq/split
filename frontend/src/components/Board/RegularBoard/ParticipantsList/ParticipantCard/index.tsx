import React from 'react';

import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Button from '@/components/Primitives/Inputs/Button/Button';
import ConfigurationSwitch from '@/components/Primitives/Inputs/Switches/ConfigurationSwitch/ConfigurationSwitch';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import Tooltip from '@/components/Primitives/Tooltips/Tooltip/Tooltip';
import { InnerContainer } from '@/styles/pages/pages.styles';
import { BoardUser } from '@/types/board/board.user';
import { BoardUserRoles } from '@/utils/enums/board.user.roles';

type CardBodyProps = {
  participant: BoardUser;
  handleRemoveParticipant: (userId: string) => void;
  updateIsResponsibleStatus: (checked: boolean, participant: BoardUser) => void;
  isCurrentUserResponsible: boolean;
  isCurrentUserSAdmin: boolean;
  isMemberCurrentUser: boolean;
  isCreatedByCurrentUser?: boolean;
};

const ParticipantCard = React.memo<CardBodyProps>(
  ({
    participant,
    handleRemoveParticipant,
    updateIsResponsibleStatus,
    isCurrentUserResponsible,
    isCurrentUserSAdmin,
    isMemberCurrentUser,
    isCreatedByCurrentUser,
  }) => {
    const isMemberResponsible = participant.role === BoardUserRoles.RESPONSIBLE;

    /* Has permission to delete, if the user is:
      - superAdmin and is not the creator of the board
      - responsible of the board and is not the current participant and is not the creator of the board
    */
    const hasPermissionsToDelete =
      (isCurrentUserSAdmin && !isCreatedByCurrentUser) ||
      (isCurrentUserResponsible && !isMemberCurrentUser && !isCreatedByCurrentUser);

    return (
      <Flex direction="column">
        <InnerContainer align="center" elevation="1" justify="between">
          <Flex align="center" gap={8} justify="start" css={{ flex: 2 }}>
            <Icon
              name="blob-personal"
              size={32}
              css={{
                zIndex: 1,
              }}
            />
            <Text size="sm" fontWeight="bold" overflow="wrap">
              {`${participant.user.firstName} ${participant.user.lastName}`}
            </Text>
          </Flex>
          <Flex css={{ flex: 2 }} justify="between">
            {(isCurrentUserSAdmin || isCurrentUserResponsible) && (
              <Flex align="center" gap={8} justify="start">
                <ConfigurationSwitch
                  handleCheckedChange={(checked: boolean) =>
                    updateIsResponsibleStatus(checked, participant)
                  }
                  isChecked={isMemberResponsible}
                  size="sm"
                  title="Responsible"
                  disabledInfo="Select another responsible for the board"
                  disabled={isCreatedByCurrentUser}
                />
              </Flex>
            )}
            {hasPermissionsToDelete && (
              <Flex align="center" justify="end">
                <Tooltip content="Remove participant">
                  <Flex justify="end">
                    <Button
                      isIcon
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemoveParticipant(participant._id!);
                      }}
                    >
                      <Icon
                        name="trash-alt"
                        size={20}
                        css={{
                          color: '$primary400',
                        }}
                      />
                    </Button>
                  </Flex>
                </Tooltip>
              </Flex>
            )}
            {isMemberResponsible && !isCurrentUserResponsible && !isCurrentUserSAdmin && (
              <Flex align="center" css={{ width: '100%' }} gap={8} justify="end">
                <Text size="sm" fontWeight="medium">
                  Responsible
                </Text>
              </Flex>
            )}
          </Flex>
        </InnerContainer>
      </Flex>
    );
  },
);

export default ParticipantCard;
