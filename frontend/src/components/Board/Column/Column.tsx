import React, { useCallback, useEffect, useState } from 'react';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import Flex from '@/components/Primitives/Flex';
import Separator from '@/components/Primitives/Separator';
import Text from '@/components/Primitives/Text';
import { getCardVotes } from '@/helper/board/votes';
import { ColumnBoardType } from '@/types/column';
import { useSetRecoilState } from 'recoil';
import { filteredColumnsState } from '@/store/board/atoms/filterColumns';
import { countColumnCards } from '@/helper/board/countCards';
import Icon from '@/components/icons/Icon';
import AddCardOrComment from '../AddCardOrComment';
import CardsList from './CardsList';
import SortMenu from './partials/SortMenu';
import { CardsContainer, Container, OuterContainer, Title } from './styles';
import OptionsMenu from './partials/OptionsMenu';
import UpdateColumnDialog from './partials/UpdateColumnDialog';
import AlertDeleteColumn from './partials/AlertDeleteColumn';
import AlertDeleteAllCards from './partials/AlertDeleteAllCards';

type ColumMemoProps = {
  isRegularBoard?: boolean;
  hasAdminRole: boolean;
  addCards: boolean;
  postAnonymously: boolean;
  columnIndex: number;
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
    postAnonymously,
    columnIndex,
  }) => {
    const [filter, setFilter] = useState<'asc' | 'desc' | undefined>();
    const setFilteredColumns = useSetRecoilState(filteredColumnsState);
    const [openDialog, setOpenDialog] = useState({
      columnName: false,
      deleteColumn: false,
      deleteCards: false,
    });
    const [dialogType, setDialogType] = useState('ColumnName');

    const handleDialogNameChange = (open: boolean, type: string) => {
      setOpenDialog({ columnName: open, deleteColumn: false, deleteCards: false });
      setDialogType(type);
    };

    const handleDialogChange = (
      openName: boolean,
      openDeleteColumn: boolean,
      openDeleteCards: boolean,
    ) => {
      setOpenDialog({
        columnName: openName,
        deleteColumn: openDeleteColumn,
        deleteCards: openDeleteCards,
      });
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
        <Draggable
          key={columnId}
          draggableId={columnId}
          index={columnIndex}
          isDragDisabled={isMainboard || !hasAdminRole}
        >
          {(providedColumn) => (
            <OuterContainer ref={providedColumn.innerRef} {...providedColumn.draggableProps}>
              <Droppable isCombineEnabled droppableId={columnId} type="CARD">
                {(provided) => (
                  <Container direction="column" elevation="2">
                    <Flex css={{ pt: '$20', px: '$20', pb: '$16' }} justify="between">
                      <Flex>
                        {hasAdminRole && isRegularBoard && (
                          <Flex {...providedColumn.dragHandleProps}>
                            <Icon name="arrange" size={24} />
                          </Flex>
                        )}
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
                          {countColumnCards(cards)} cards
                        </Text>
                      </Flex>
                      <Flex>
                        {(isMainboard || isRegularBoard) && (
                          <SortMenu
                            disabled={!isMainboard && !isRegularBoard}
                            filter={filter}
                            setFilter={setFilter}
                          />
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
                            handleDialogChange={handleDialogChange}
                            isDefaultText={isDefaultText}
                            color={color}
                            socketId={socketId}
                          />
                        )}
                      </Flex>
                    </Flex>
                    <Separator css={{ mb: '$20' }} />
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
                              anonymous={undefined}
                              cardText={cardText}
                              isDefaultText={isDefaultText ?? true}
                              postAnonymously={postAnonymously}
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
                          postAnonymously={postAnonymously}
                          isRegularBoard={isRegularBoard}
                        />
                        {provided.placeholder}
                      </CardsContainer>
                    </Flex>
                  </Container>
                )}
              </Droppable>
            </OuterContainer>
          )}
        </Draggable>
        <UpdateColumnDialog
          boardId={boardId}
          isOpen={openDialog.columnName}
          setIsOpen={handleDialogChange}
          columnId={columnId}
          columnTitle={title}
          columnColor={color}
          cards={cards}
          cardText={cardText}
          isDefaultText={isDefaultText}
          type={dialogType}
          socketId={socketId}
        />
        <AlertDeleteColumn
          socketId={socketId}
          columnId={columnId}
          columnTitle={title}
          isOpen={openDialog.deleteColumn}
          handleDialogChange={handleDialogChange}
          postAnonymously={postAnonymously}
        />
        <AlertDeleteAllCards
          socketId={socketId}
          boardId={boardId}
          columnId={columnId}
          isOpen={openDialog.deleteCards}
          handleDialogChange={handleDialogChange}
        />
      </>
    );
  },
);
export default Column;
