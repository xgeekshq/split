import React from 'react';

import Flex from '@/components/Primitives/Flex';
import Icon from '@/components/icons/Icon';
import { InnerContainer, StyledMemberTitle } from '@/components/Teams/CreateTeam/CardMember/styles';
import { BoardUser } from '@/types/board/board.user';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DeleteColumnButton } from '@/components/Board/Settings/partials/Columns/DeleteButton';
import Tooltip from '@/components/Primitives/Tooltip';

type CardBodyProps = {
  member: BoardUser;
  isBoardCreator?: boolean;
  isBoardMember?: boolean;
  isOpen?: boolean;
};

const ParticipantCard = React.memo<CardBodyProps>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ member, isBoardCreator, isBoardMember, isOpen }) => (
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
            width: '100%',
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
            <Flex align="center" css={{ width: '$237' }} justify="end">
              <Tooltip content="Delete board member">
                <Flex pointer justify="end">
                  <Icon
                    name="trash-alt"
                    css={{
                      color: '$primary400',
                      mt: '$16',
                      size: '$20',
                    }}
                  />
                </Flex>
              </Tooltip>
            </Flex>
          </Flex>
        </InnerContainer>
      </Flex>
    </Flex>
  ),
);

export default ParticipantCard;
