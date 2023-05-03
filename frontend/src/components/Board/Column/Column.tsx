import React, { useCallback, useEffect, useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { useResizeDetector } from 'react-resize-detector';
import { useSetRecoilState } from 'recoil';

import AddCardOrComment from '@/components/Board/AddCardOrComment';
import CardsList from '@/components/Board/Column/CardsList';
import OptionsMenu from '@/components/Board/Column/partials/OptionsMenu';
import SortMenu from '@/components/Board/Column/partials/SortMenu';
import UpdateColumnDialog from '@/components/Board/Column/partials/UpdateColumnDialog';
import {
  CardsContainer,
  Container,
  OuterContainer,
  Title,
  TitleContainer,
} from '@/components/Board/Column/styles';
import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Separator from '@/components/Primitives/Separator/Separator';
import Tooltip from '@/components/Primitives/Tooltips/Tooltip/Tooltip';
import { countColumnCards } from '@/helper/board/countCards';
import { getCardVotes } from '@/helper/board/votes';
import { filteredColumnsState } from '@/store/board/atoms/filterColumns';
import { ColumnBoardType } from '@/types/column';
import Badge from '@components/Primitives/Badge/Badge';

type ColumMemoProps = {
  isRegularBoard?: boolean;
  hasAdminRole: boolean;
  addCards: boolean;
  postAnonymously: boolean;
  columnIndex: number;
  isSubBoard?: boolean;
  phase?: string;
  hasMoreThanThreeColumns: boolean;
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
    isSubBoard,
    phase,
    hasMoreThanThreeColumns,
  }) => {
    const [filter, setFilter] = useState<'asc' | 'desc' | undefined>();
    const setFilteredColumns = useSetRecoilState(filteredColumnsState);
    const [openDialog, setOpenDialog] = useState({
      columnName: false,
    });
    const [dialogType, setDialogType] = useState('ColumnName');
    const [showTooltip, setShowTooltip] = useState(false);
    const { width, ref } = useResizeDetector({ handleWidth: true });

    const handleDialogNameChange = (open: boolean, type: string) => {
      setOpenDialog({ columnName: open });
      setDialogType(type);
    };

    const handleDialogChange = (openName: boolean) => {
      setOpenDialog({
        columnName: openName,
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

    useEffect(() => {
      setShowTooltip(false);

      if (ref.current && ref.current.offsetWidth < ref.current?.scrollWidth) {
        setShowTooltip(true);
      }
    }, [ref, width]);

    return (
      <>
        <Draggable
          key={columnId}
          draggableId={columnId}
          index={columnIndex}
          isDragDisabled={isMainboard || !hasAdminRole || isSubBoard}
        >
          {(providedColumn) => (
            <OuterContainer ref={providedColumn.innerRef} {...providedColumn.draggableProps}>
              <Droppable isCombineEnabled droppableId={columnId} type="CARD">
                {(provided) => (
                  <Container direction="column" elevation="2">
                    <Flex css={{ pt: '$20', px: '$20', pb: '$16' }} justify="between">
                      <Flex css={{ width: '100%' }}>
                        {hasAdminRole && isRegularBoard && (
                          <Flex {...providedColumn.dragHandleProps}>
                            <Icon name="arrange" size={24} />
                          </Flex>
                        )}
                        <TitleContainer
                          css={{
                            width: hasMoreThanThreeColumns ? '$130' : '$237',
                          }}
                        >
                          {showTooltip ? (
                            <Tooltip content={title}>
                              <Title heading="4" ref={ref}>
                                {title}
                              </Title>
                            </Tooltip>
                          ) : (
                            <Title heading="4" ref={ref}>
                              {title}
                            </Title>
                          )}
                        </TitleContainer>
                        <Badge size="xs">{countColumnCards(cards)} cards</Badge>
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
                            boardId={boardId}
                            cardText={cardText}
                            cards={cards}
                            color={color}
                            columnId={columnId}
                            disabled={false}
                            isDefaultText={isDefaultText}
                            postAnonymously={postAnonymously}
                            setOpenDialogName={handleDialogNameChange}
                            socketId={socketId}
                            title={title}
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
                              anonymous={undefined}
                              boardId={boardId}
                              cardTextDefault={cardText}
                              colId={columnId}
                              columnName={title}
                              defaultOpen={countAllCards === 0}
                              isDefaultText={isDefaultText ?? true}
                              isRegularBoard={isRegularBoard}
                              isUpdate={false}
                              postAnonymously={postAnonymously}
                              socketId={socketId}
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
                          cardTextDefault={cardText}
                          cards={filteredCards()}
                          colId={columnId}
                          color={color}
                          hasAdminRole={hasAdminRole}
                          hideCards={hideCards}
                          isMainboard={isMainboard}
                          isRegularBoard={isRegularBoard}
                          isSubmited={isSubmited}
                          maxVotes={maxVotes}
                          phase={phase}
                          postAnonymously={postAnonymously}
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
          )}
        </Draggable>
        <UpdateColumnDialog
          boardId={boardId}
          cardText={cardText}
          cards={cards}
          columnColor={color}
          columnId={columnId}
          columnTitle={title}
          isDefaultText={isDefaultText}
          isOpen={openDialog.columnName}
          setIsOpen={handleDialogChange}
          socketId={socketId}
          type={dialogType}
        />
      </>
    );
  },
);
export default Column;
