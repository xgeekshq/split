import React, { useCallback, useEffect, useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import Flex from '@/components/Primitives/Flex';
import Separator from '@/components/Primitives/Separator';
import Text from '@/components/Primitives/Text';
import { getCardVotes } from '@/helper/board/votes';
import { ColumnBoardType } from '@/types/column';
import { useSetRecoilState } from 'recoil';
import { filteredColumnsState } from '@/store/board/atoms/filterColumns';
import AddCardOrComment from '../AddCardOrComment';
import CardsList from './CardsList';
import { SortMenu } from './partials/SortMenu';
import { CardsContainer, Container, OuterContainer, Title } from './styles';
import OptionsMenu from './partials/OptionsMenu';
import UpdateColumnDialog from './partials/UpdateColumnDialog';

type ColumMemoProps = {
  isRegularBoard?: boolean;
  hasAdminRole: boolean;
  addCards: boolean;
} & ColumnBoardType;

const Column = React.memo<ColumMemoProps>(
  ({
    columnId,
    cards,
    userId,
    boardId,
    title,
    color,
    isDefaultText,
    cardText,
    socketId,
    isMainboard,
    boardUser,
    maxVotes,
    countAllCards,
    isSubmited,
    hideCards,
    isRegularBoard,
    hasAdminRole,
    addCards,
  }) => {
    const [filter, setFilter] = useState<'asc' | 'desc' | undefined>();
    const setFilteredColumns = useSetRecoilState(filteredColumnsState);
    const [openDialogName, setOpenDialogName] = useState(false);
    const [dialogType, setDialogType] = useState('ColumnName');

    const handleDialogNameChange = (open: boolean, type: string) => {
      setOpenDialogName(open);
      setDialogType(type);
    };

    const filteredCards = useCallback(() => {
      switch (filter) {
        case 'asc':
          return [...cards].sort((a, b) => {
            const votesA = a.items.length === 1 ? a.items[0].votes.length : getCardVotes(a).length;
            const votesB = b.items.length === 1 ? b.items[0].votes.length : getCardVotes(b).length;
            return votesA - votesB;
          });
        case 'desc':
          return [...cards].sort((a, b) => {
            const votesA = a.items.length === 1 ? a.items[0].votes.length : getCardVotes(a).length;
            const votesB = b.items.length === 1 ? b.items[0].votes.length : getCardVotes(b).length;
            return votesB - votesA;
          });
        default:
          return cards;
      }
    }, [cards, filter]);

    useEffect(() => {
      if (filter) {
        setFilteredColumns((prev) => {
          if (prev.includes(columnId)) return prev;
          return [...prev, columnId];
        });
      } else {
        setFilteredColumns((prev) => {
          const newValues = [...prev];
          const index = newValues.indexOf(columnId);
          if (index > -1) {
            newValues.splice(index, 1);
          }
          return newValues;
        });
      }
    }, [columnId, filter, setFilteredColumns]);

    return (
      <>
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
                  <Flex>
                    {isMainboard && (
                      <SortMenu disabled={!isMainboard} filter={filter} setFilter={setFilter} />
                    )}
                    {hasAdminRole && isRegularBoard && (
                      <OptionsMenu
                        disabled={false}
                        title={title}
                        cards={cards}
                        cardText={cardText}
                        columnId={columnId}
                        boardId={boardId}
                        setOpenDialogName={handleDialogNameChange}
                        isDefaultText={isDefaultText}
                        color={color}
                      />
                    )}
                  </Flex>
                </Flex>
                <Separator css={{ backgroundColor: '$primary100', mb: '$20' }} />
                <Flex direction="column">
                  {!isSubmited && (
                    <Flex
                      align="center"
                      css={{
                        '&>*': { flex: '1 1 auto' },
                        '&>form': { px: '$20' },
                      }}
                    >
                      {addCards && (
                        <AddCardOrComment
                          isCard
                          boardId={boardId}
                          colId={columnId}
                          defaultOpen={countAllCards === 0}
                          isUpdate={false}
                          socketId={socketId}
                          anonymous={false}
                          cardText={cardText}
                          isDefaultText={isDefaultText ?? true}
                        />
                      )}
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
                      cards={filteredCards()}
                      colId={columnId}
                      color={color}
                      hideCards={hideCards}
                      isMainboard={isMainboard}
                      isSubmited={isSubmited}
                      maxVotes={maxVotes}
                      socketId={socketId}
                      userId={userId}
                      hasAdminRole={hasAdminRole}
                    />
                    {provided.placeholder}
                  </CardsContainer>
                </Flex>
              </Container>
            )}
          </Droppable>
        </OuterContainer>
        <UpdateColumnDialog
          boardId={boardId}
          isOpen={openDialogName}
          setIsOpen={setOpenDialogName}
          columnId={columnId}
          columnTitle={title}
          columnColor={color}
          cards={cards}
          cardText={cardText}
          isDefaultText={isDefaultText}
          type={dialogType}
        />
      </>
    );
  },
);
export default Column;
