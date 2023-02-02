import React from 'react';

import Flex from '@/components/Primitives/Flex';
import Icon from '@/components/icons/Icon';
import { InnerContainer, StyledMemberTitle } from '@/components/Teams/CreateTeam/CardMember/styles';
import { BoardUser } from '@/types/board/board.user';
import Tooltip from '@/components/Primitives/Tooltip';
import { IconButton } from '@/components/CardBoard/styles';
import { boardParticipantsState } from '@/store/board/atoms/board.atom';
import { useRecoilState } from 'recoil';
import { usersListState } from '@/store/team/atom/team.atom';

type CardBodyProps = {
  member: BoardUser;
  isBoardCreator?: boolean;
  isOpen?: boolean;
};

const ParticipantCard = React.memo<CardBodyProps>(({ member, isBoardCreator, isOpen }) => {
  const [boardParticipants, setBoardParticipants] = useRecoilState(boardParticipantsState);
  const [usersList, setUsersListState] = useRecoilState(usersListState);
  const handleRemove = () => {
    // const participantToRemove = boardParticipants.find(
    //   (boardUser) => boardUser.user._id === member.user._id,
    // ) as BoardUser;
    const updateParticipantsList = [...boardParticipants];
    const updateUsersList = [...usersList];

    const userIdx = updateUsersList.findIndex((user) => user._id === member.user._id);
    const participantIdx = updateParticipantsList.findIndex(
      (boardUser) => boardUser.user._id === member.user._id,
    );

    updateParticipantsList.splice(participantIdx, 1);
    updateUsersList.splice(userIdx, 1);

    setUsersListState(usersList);
    setBoardParticipants(updateParticipantsList);
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
