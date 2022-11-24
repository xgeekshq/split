import React, { useState } from 'react';
import { Droppable } from '@react-forked/dnd';

import Flex from '@/components/Primitives/Flex';
import Separator from '@/components/Primitives/Separator';
import Text from '@/components/Primitives/Text';
import { getCardVotes } from 'helper/board/votes';
import { ColumnBoardType } from '@/types/column';
import AddCardOrComment from '../AddCardOrComment';
import CardsList from './CardsList';
import { SortMenu } from './partials/SortMenu';
import { CardsContainer, Container, OuterContainer, Title } from './styles';

const Column = React.memo<ColumnBoardType>(
  ({
    columnId,
    cards,
    userId,
    boardId,
    title,
    color,
    socketId,
    isMainboard,
    boardUser,
    maxVotes,
    countAllCards,
    isSubmited,
    hideCards,
  }) => {
    const [filter, setFilter] = useState<'asc' | 'desc' | undefined>();

    const filteredCards = () => {
      switch (filter) {
        case 'desc':
          return [...cards].sort((a, b) => {
            const votesA = a.items.length === 1 ? a.items[0].votes.length : getCardVotes(a).length;
            const votesB = b.items.length === 1 ? b.items[0].votes.length : getCardVotes(b).length;
            return votesA - votesB;
          });
        case 'asc':
          return [...cards].sort((a, b) => {
            const votesA = a.items.length === 1 ? a.items[0].votes.length : getCardVotes(a).length;
            const votesB = b.items.length === 1 ? b.items[0].votes.length : getCardVotes(b).length;
            return votesB - votesA;
          });
        default:
          return cards;
      }
    };

    return (
      <OuterContainer>
        <Droppable isCombineEnabled droppableId={columnId} type="CARD">
          {(provided) => (
            <Container direction="column" elevation="2">
              <Flex css={{ pt: '$20', px: '$20', pb: '$16' }} justify="between">
                <Flex>
                  <Title heading="4">{title}</Title>
                  <Text
                    color="primary400"
                    size="xs"
                    css={{
                      borderRadius: '$4',
                      border: '1px solid $colors$primary100',
                      px: '$8',
                      py: '$2',
                    }}
                  >
                    {cards.length} cards
                  </Text>
                </Flex>

                <SortMenu disabled={!isMainboard} filter={filter} setFilter={setFilter} />
              </Flex>
              <Separator css={{ backgroundColor: '$primary100', mb: '$20' }} />
              <Flex css={{}} direction="column">
                {!isSubmited && (
                  <Flex
                    align="center"
                    css={{
                      '&>*': { flex: '1 1 auto' },
                      '&>form': { px: '$20' },
                    }}
                  >
                    <AddCardOrComment
                      isCard
                      boardId={boardId}
                      colId={columnId}
                      defaultOpen={countAllCards === 0}
                      isUpdate={false}
                      socketId={socketId}
                    />
                  </Flex>
                )}
                <CardsContainer
                  direction="column"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <CardsList
                    boardId={boardId}
                    boardUser={boardUser}
                    cards={filter ? filteredCards() : cards}
                    colId={columnId}
                    color={color}
                    hideCards={hideCards}
                    isMainboard={isMainboard}
                    isSubmited={isSubmited}
                    maxVotes={maxVotes}
                    socketId={socketId}
                    userId={userId}
                  />
                  {provided.placeholder}
                </CardsContainer>
              </Flex>
            </Container>
          )}
        </Droppable>
      </OuterContainer>
    );
  },
);
export default Column;
