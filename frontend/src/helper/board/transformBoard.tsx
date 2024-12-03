import { User } from 'next-auth';

import BoardType from '@/types/board/board';
import { BoardUser } from '@/types/board/board.user';
import MergeCardsDto from '@/types/board/mergeCard.dto';
import AddCardDto from '@/types/card/addCard.dto';
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
export const removeReadOnly = (board: BoardType): BoardType => JSON.parse(JSON.stringify(board));

const generateNewCard = (newCardData: AddCardDto): CardType => {
  const idCard = `newCard${newCardData.card.text}${newCardData.user?._id}`;
  const newCard: CardType = {
    _id: idCard,
    text: newCardData.card.text,
    votes: [],
    comments: [],
    anonymous: newCardData.card.anonymous,
    createdBy: {
      _id: newCardData.user ? newCardData.user._id : '',
      firstName: newCardData.user ? newCardData.user.firstName : '',
      lastName: newCardData.user ? newCardData.user.lastName : '',
      email: '',
      joinedAt: '',
      isSAdmin: false,
    },
    items: [
      {
        _id: idCard,
        text: newCardData.card.text,
        votes: [],
        comments: [],
        anonymous: newCardData.card.anonymous,
        createdBy: {
          _id: newCardData.user ? newCardData.user._id : '',
          firstName: newCardData.user ? newCardData.user.firstName : '',
          lastName: newCardData.user ? newCardData.user.lastName : '',
          email: '',
          joinedAt: '',
          isSAdmin: false,
        },
      },
    ],
  };
  return newCard;
};

export const handleNewCard = (board: BoardType, colIdToAdd: string, cardDto: AddCardDto) => {
  const boardData = removeReadOnly(board);

  const { newCard, user } = cardDto;

  const column = boardData.columns.find((col) => col._id === colIdToAdd);
  if (column) {
    if (newCard && user) {
      const cardIdx = column.cards.findIndex(
        (card) => card._id === `newCard${cardDto.card.text}${cardDto.user?._id}`,
      );
      column.cards = removeElementAtIndex(column.cards, cardIdx);
    }
    column.cards = addElementAtIndex(column.cards, 0, cardDto.newCard ?? generateNewCard(cardDto));
  }

  return boardData;
};

export const handleNewBoardUser = (board: BoardType, boardUser: BoardUser) => {
  const boardData = removeReadOnly(board);

  const userExists = boardData.users.find((user) => user._id === boardUser._id);

  if (!userExists) {
    boardData.users.push(boardUser);
  }

  return boardData;
};

export const handleDeleteCard = (board: BoardType, data: DeleteCardDto): BoardType => {
  const boardData = removeReadOnly(board);

  const { columnId, cardId, cardItemId, isCardGroup, userId } = data;

  let votesOfUser = 0;
  const column = boardData.columns.find((col) => col._id === columnId);

  const cardIdx = column?.cards.findIndex((cardValue) => cardValue._id === cardId);

  if (!column || cardIdx === undefined) return boardData;

  if (isCardGroup) {
    votesOfUser = column.cards[cardIdx].items.reduce(
      (prev, current) => prev + current.votes.filter((vote) => vote === userId).length,
      column.cards[cardIdx].votes.filter((vote) => vote === userId).length,
    );

    column.cards.splice(cardIdx, 1);
  }

  if (!isCardGroup) {
    const cardItemIdx = column?.cards[cardIdx].items.findIndex((item) => item._id === cardItemId);

    votesOfUser = column.cards[cardIdx].items[cardItemIdx].votes.length;
    column.cards[cardIdx].items.splice(cardItemIdx, 1);

    if (column.cards[cardIdx].items.length === 1) {
      column.cards[cardIdx].text = column.cards[cardIdx].items[0].text;
      column.cards[cardIdx].items[0].comments = column.cards[cardIdx].items[0].comments.concat(
        column.cards[cardIdx].comments,
      );
      column.cards[cardIdx].items[0].votes = column.cards[cardIdx].items[0].votes.concat(
        column.cards[cardIdx].votes,
      );
      column.cards[cardIdx].comments = [];
      column.cards[cardIdx].votes = [];
    }
  }

  const boardUserIdx = boardData.users.findIndex((bUser) => bUser.user._id === userId);

  if (boardUserIdx > -1) {
    boardData.users[boardUserIdx].votesCount -= votesOfUser;
  }

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
      } catch {
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
    } catch {
      return boardData;
    }
  }

  return boardData;
};

export const handleUnMergeCard = (board: BoardType, changes: RemoveFromCardGroupDto) => {
  const boardData = removeReadOnly(board);

  const { columnId, cardGroupId, cardId, newPosition, newCardItemId } = changes;
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

      if (newCardItemId) {
        const card = column?.cards.find((cardFound) => cardFound._id === cardId);
        if (card && newCardItemId) {
          card.items[0]._id = newCardItemId;
        }
      }
    } catch {
      return boardData;
    }
  }

  return boardData;
};

export const handleAddComments = (board: BoardType, changes: AddCommentDto, user: User) => {
  // avoid read only error
  const boardData: BoardType = JSON.parse(JSON.stringify(board));
  const { cardId, cardItemId, text, anonymous, isCardGroup, newComment, columnId, fromSocket } =
    changes;
  const columnIndex = boardData.columns.findIndex((col) => col._id === columnId);

  const card = boardData.columns[columnIndex].cards.find((c) => c._id === cardId);
  const cardItem = card?.items.find((c) => c._id === cardItemId);
  const placehodlerId = `newComment${text}${user.id}`;

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

  if (!isCardGroup && cardItem) {
    if (newComment && !fromSocket) {
      const commentIdx = cardItem.comments.findIndex(
        (comment) => comment._id === `newComment${text}${user.id}`,
      );
      cardItem.comments = removeElementAtIndex(cardItem.comments, commentIdx);
    }
    cardItem.comments = addElementAtIndex(cardItem.comments, 0, newComment || commentObj);
  } else if (card && isCardGroup) {
    if (newComment && !fromSocket) {
      const commentIdx = card.comments.findIndex(
        (comment) => comment._id === `newComment${text}${user.id}`,
      );

      card.comments = removeElementAtIndex(card.comments, commentIdx);
    }
    card.comments = addElementAtIndex(card.comments, 0, newComment || commentObj);
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
    if (cardItem) {
      cardItem?.comments.splice(commentIndex, 1);
    } else {
      card?.comments.splice(commentIndex, 1);
    }
  }

  return boardData;
};

export const handleUpdateCardItemIdOfUnmergedCard = (
  board: BoardType,
  variables: RemoveFromCardGroupDto,
): BoardType => {
  const mappedBoard = removeReadOnly(board);
  const column = mappedBoard.columns.find((col) => col._id === variables.columnId);
  const card = column?.cards.find((cardFound) => cardFound._id === variables.cardId);
  if (card && variables.newCardItemId) {
    card.items[0]._id = variables.newCardItemId;
  }

  return mappedBoard;
};
