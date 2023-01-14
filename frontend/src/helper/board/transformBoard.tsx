import { User } from 'next-auth';

import BoardType from '@/types/board/board';
import MergeCardsDto from '@/types/board/mergeCard.dto';
import CardType from '@/types/card/card';
import DeleteCardDto from '@/types/card/deleteCard.dto';
import RemoveFromCardGroupDto from '@/types/card/removeFromCardGroup.dto';
import UpdateCardDto from '@/types/card/updateCard.dto';
import UpdateCardPositionDto from '@/types/card/updateCardPosition.dto';
import AddCommentDto from '@/types/comment/addComment.dto';
import DeleteCommentDto from '@/types/comment/deleteComment.dto';
import UpdateCommentDto from '@/types/comment/updateComment.dto';
import { addElementAtIndex, removeElementAtIndex } from '@/utils/array';

// avoid read only error
const removeReadOnly = (board: BoardType): BoardType => JSON.parse(JSON.stringify(board));

export const handleNewCard = (board: BoardType, colIdToAdd: string, newCard: CardType) => {
  const boardData = removeReadOnly(board);

  const column = boardData.columns.find((col) => col._id === colIdToAdd);
  if (column) {
    column.cards = addElementAtIndex(column.cards, 0, newCard);
  }

  return boardData;
};

export const handleDeleteCard = (board: BoardType, data: DeleteCardDto): BoardType => {
  const boardData = removeReadOnly(board);

  boardData.columns.forEach((column) => {
    column.cards.forEach((card, index) => {
      if (card._id === data.cardId) {
        column.cards.splice(index, 1);
      }
    });
  });

  return boardData;
};

export const handleUpdateText = (board: BoardType, data: UpdateCardDto) => {
  const boardData = removeReadOnly(board);

  boardData.columns.forEach((col) => {
    col.cards.forEach((card) => {
      if (card._id === data.cardId) {
        card.text = data.text;
      }
      card.items.forEach((item) => {
        if (item._id === data.cardItemId) {
          item.text = data.text;
        }
      });
    });
  });
  return boardData;
};

export const handleUpdateCardPosition = (board: BoardType, changes: UpdateCardPositionDto) => {
  const boardData = removeReadOnly(board);
  const { targetColumnId, colIdOfCard, newPosition, cardPosition, cardId } = changes;
  let currentCardPosition: number | undefined = cardPosition;
  const colToRemove = boardData.columns.find((col) => col._id === colIdOfCard);
  const colToAdd = boardData.columns.find((col) => col._id === targetColumnId);

  currentCardPosition = colToRemove?.cards.findIndex((card) => card._id === cardId);

  if (currentCardPosition !== undefined) {
    const cardToAdd = colToRemove?.cards[currentCardPosition];

    if (cardToAdd && colToAdd && colToRemove) {
      try {
        colToRemove.cards = removeElementAtIndex(colToRemove.cards, currentCardPosition);
        colToAdd.cards = addElementAtIndex(colToAdd.cards, newPosition, cardToAdd);
      } catch (e) {
        return boardData;
      }
    }
  }
  return boardData;
};

export const handleMergeCard = (board: BoardType, changes: MergeCardsDto) => {
  const boardData = removeReadOnly(board);

  const { cardGroupId, cardId, colIdOfCardGroup, columnIdOfCard, cardPosition } = changes;
  let currentCardPosition: number | undefined = cardPosition;
  const targetColumn = boardData.columns.find((col) => col._id === colIdOfCardGroup);
  const cardGroup = targetColumn?.cards.find((card) => card._id === cardGroupId);
  const sourceColumn = boardData.columns.find((col) => col._id === columnIdOfCard);
  const selectedCard = sourceColumn?.cards.find((card) => card._id === cardId);
  currentCardPosition = sourceColumn?.cards.findIndex((card) => card._id === cardId);

  if (cardGroup && selectedCard && sourceColumn && currentCardPosition !== undefined) {
    try {
      cardGroup.comments = cardGroup.comments.concat(selectedCard.comments);
      cardGroup.votes = cardGroup.votes.concat(selectedCard.votes);
      sourceColumn.cards = removeElementAtIndex(sourceColumn.cards, currentCardPosition);
      selectedCard.items.forEach((_, idx) => {
        cardGroup.items = addElementAtIndex(cardGroup.items, cardGroup.items.length, {
          ...selectedCard.items[idx],
        });
      });
    } catch (e) {
      return boardData;
    }
  }

  return boardData;
};

export const handleUnMergeCard = (board: BoardType, changes: RemoveFromCardGroupDto) => {
  const boardData = removeReadOnly(board);

  const { columnId, cardGroupId, cardId, newPosition } = changes;
  const column = boardData.columns.find((col) => col._id === columnId);
  const cardGroup = column?.cards.find((card) => card._id === cardGroupId);
  const selectedCard = cardGroup?.items.find((item) => item._id === cardId);

  if (column && cardGroup && selectedCard) {
    try {
      cardGroup.items = cardGroup.items.filter((item) => item._id !== selectedCard._id);
      if (cardGroup.items.length === 1) {
        cardGroup.text = cardGroup.items[0].text;
        cardGroup.items[0].comments = cardGroup.items[0].comments.concat(cardGroup.comments);
        cardGroup.items[0].votes = cardGroup.items[0].votes.concat(cardGroup.votes);
        cardGroup.anonymous = cardGroup.items[0].anonymous;
        cardGroup.createdBy = cardGroup.items[0].createdBy;
        cardGroup.createdByTeam = cardGroup.items[0].createdByTeam;
        cardGroup.comments = [];
        cardGroup.votes = [];
      }
      column.cards = addElementAtIndex(column.cards, newPosition, {
        ...selectedCard,
        comments: [],
        votes: [],
        items: [selectedCard],
      });
    } catch (e) {
      return boardData;
    }
  }

  return boardData;
};

export const handleAddComments = (board: BoardType, changes: AddCommentDto, user: User) => {
  // avoid read only error
  const boardData: BoardType = JSON.parse(JSON.stringify(board));
  const { cardId, cardItemId, text, anonymous, isCardGroup } = changes;
  let columnIndex = 0;

  boardData.columns.forEach((item, index) => {
    if (item.cards.find((col) => col._id === cardId) !== undefined) {
      columnIndex = index;
    }
  });

  const card = boardData.columns[columnIndex].cards.find((c) => c._id === cardId);
  const cardItem = card!.items.find((c) => c._id === cardItemId);
  const placehodlerId = (Math.random() + 1).toString(36).substring(7);

  const commentObj = {
    text,
    createdBy: {
      _id: !anonymous ? user.id : '12345',
      firstName: !anonymous ? user.firstName : 'aaaaaa',
      lastName: !anonymous ? user.lastName : 'aaaaaa',
      email: '',
      isSAdmin: false,
      joinedAt: '',
    },
    anonymous,
    _id: placehodlerId,
    id: placehodlerId,
    createdAt: new Date().toISOString(),
  };

  if (!isCardGroup) {
    cardItem?.comments.push(commentObj);
  } else {
    card?.comments.push(commentObj);
  }

  return boardData;
};

export const handleUpdateComments = (board: BoardType, changes: UpdateCommentDto) => {
  // avoid read only error
  const boardData: BoardType = JSON.parse(JSON.stringify(board));
  const { cardId, cardItemId, commentId, text, isCardGroup, anonymous } = changes;
  let columnIndex = 0;

  boardData.columns.forEach((item, index) => {
    if (item.cards.find((col) => col._id === cardId) !== undefined) {
      columnIndex = index;
    }
  });

  const card = boardData.columns[columnIndex].cards.find((c) => c._id === cardId);
  const cardItem = card?.items.find((c) => c._id === cardItemId);
  let comment = !isCardGroup
    ? cardItem?.comments.find((c) => c._id === commentId)
    : card?.comments.find((c) => c._id === commentId);

  if (!comment) {
    comment = cardItem?.comments.find((c) => c._id === commentId);
  }

  if (comment) {
    comment.text = text;
    comment.anonymous = anonymous;
  }

  return boardData;
};

export const handleDeleteComments = (board: BoardType, changes: DeleteCommentDto) => {
  // avoid read only error
  const boardData: BoardType = JSON.parse(JSON.stringify(board));
  const { cardId, cardItemId, commentId } = changes;
  let columnIndex = 0;

  boardData.columns.forEach((item, index) => {
    if (item.cards.find((col) => col._id === cardId) !== undefined) {
      columnIndex = index;
    }
  });

  const card = boardData.columns[columnIndex].cards.find((c) => c._id === cardId);
  const cardItem = card?.items.find((c) => c._id === cardItemId);

  let commentIndex = cardItem?.comments.findIndex((c) => c._id === commentId);
  if (commentIndex === undefined) {
    commentIndex = card?.comments.findIndex((c) => c._id === commentId);
  }

  if (commentIndex !== undefined) {
    cardItem ? cardItem?.comments.splice(commentIndex, 1) : card?.comments.splice(commentIndex, 1);
  }

  return boardData;
};
