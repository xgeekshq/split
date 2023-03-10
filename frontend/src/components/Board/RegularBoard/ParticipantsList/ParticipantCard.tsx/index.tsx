import React from 'react';

import Flex from '@/components/Primitives/Flex';
import Text from '@/components/Primitives/Text';
import Icon from '@/components/Primitives/Icon';
import { InnerContainer } from '@/components/Teams/styles';
import { BoardUser, UpdateBoardUser } from '@/types/board/board.user';
import Tooltip from '@/components/Primitives/Tooltip/Tooltip';
import { useRouter } from 'next/router';
import ConfigurationSwitch from '@/components/Primitives/ConfigurationSwitch';
import { BoardUserRoles } from '@/utils/enums/board.user.roles';
import useParticipants from '@/hooks/useParticipants';
import Button from '@/components/Primitives/Button';

type CardBodyProps = {
  member: BoardUser;
  isCurrentUserResponsible: boolean;
  isCurrentUserSAdmin: boolean;
  isMemberCurrentUser: boolean;
  isOpen?: boolean;
  isCreatedByCurrentUser?: boolean;
};

const ParticipantCard = React.memo<CardBodyProps>(
  ({
    member,
    isCurrentUserResponsible,
    isCurrentUserSAdmin,
    isMemberCurrentUser,
    isOpen,

    isCreatedByCurrentUser,
  }) => {
    const {
      addAndRemoveBoardParticipants: { mutate },
    } = useParticipants();

    const router = useRouter();
    const boardId = router.query.boardId as string;

    const isMemberResponsible = member.role === BoardUserRoles.RESPONSIBLE;

    const handleRemove = () => {
      if (!member._id) return;

      const boardUsersToUpdate: UpdateBoardUser = {
        addBoardUsers: [],
        removeBoardUsers: [member._id],
        boardId,
      };

      mutate(boardUsersToUpdate);
    };

    const updateIsResponsibleStatus = (checked: boolean) => {
      const boardUserToUpdate: UpdateBoardUser = {
        addBoardUsers: [],
        removeBoardUsers: [],
        boardUserToUpdateRole: {
          ...member,
          role: checked ? BoardUserRoles.RESPONSIBLE : BoardUserRoles.MEMBER,
          board: boardId,
        },
        boardId,
      };
      mutate(boardUserToUpdate);
    };

    const handleSelectFunction = (checked: boolean) => updateIsResponsibleStatus(checked);

    /* Has permission to delete, if the user is:
      - superAdmin and is not the creator of the board
      - responsible of the board and is not the current member and is not the creator of the board
    */

    const hasPermissionsToDelete =
      (isCurrentUserSAdmin && !isCreatedByCurrentUser) ||
      (isCurrentUserResponsible && !isMemberCurrentUser && !isCreatedByCurrentUser);

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
                <Text size="sm" fontWeight="bold" overflow="wrap">
                  {`${member.user.firstName} ${member.user.lastName}`}
                </Text>
              </Flex>

              <Flex css={{ width: '50%' }} justify="between">
                {(isCurrentUserSAdmin || isCurrentUserResponsible) && (
                  <Flex align="center" gap="8" justify="start">
                    <ConfigurationSwitch
                      handleCheckedChange={handleSelectFunction}
                      isChecked={isMemberResponsible}
                      text=""
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
                        <Button isIcon onClick={handleRemove}>
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
