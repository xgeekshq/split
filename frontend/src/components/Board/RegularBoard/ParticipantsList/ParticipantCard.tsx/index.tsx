import React from 'react';

import Flex from '@/components/Primitives/Flex';
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

type CardBodyProps = {
  member: BoardUser;
  isBoardCreator?: boolean;
  isOpen?: boolean;
};

const ParticipantCard = React.memo<CardBodyProps>(({ member, isBoardCreator, isOpen }) => {
  const {
    addAndRemoveBoardParticipants: { mutate },
  } = useParticipants();

  const router = useRouter();
  const boardId = router.query.boardId as string;

  const handleRemove = () => {
    if (!member._id) return;

    const boardUsersToUpdate: BoardUserAddAndRemove = {
      addBoardUsers: [],
      removeBoardUsers: [member._id],
      boardId,
    };

    mutate(boardUsersToUpdate);
  };
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
            {!isBoardCreator && (
              <Flex align="center" css={{ width: '50%' }} justify="end">
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
          </Flex>
        </InnerContainer>
      </Flex>
    </Flex>
  );
});

export default ParticipantCard;
