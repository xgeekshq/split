import BoardType from 'types/board/board';
import UpdateCardPositionDto from 'types/card/updateCardPosition.dto';
import AddCommentDto from 'types/comment/addComment.dto';
import DeleteCommentDto from 'types/comment/deleteComment.dto';
import UpdateCommentDto from 'types/comment/updateComment.dto';
import { addElementAtIndex, removeElementAtIndex } from 'utils/array';

export const handleUpdateCardPosition = (board: BoardType, changes: UpdateCardPositionDto) => {
	// avoid read only error
	const boardData: BoardType = JSON.parse(JSON.stringify(board));

	const { targetColumnId, colIdOfCard, newPosition, cardPosition } = changes;
	const colToRemove = boardData.columns.find((col) => col._id === colIdOfCard);
	const colToAdd = boardData.columns.find((col) => col._id === targetColumnId);
	const cardToAdd = colToRemove?.cards[cardPosition];

	if (cardToAdd && colToAdd && colToRemove) {
		colToRemove.cards = removeElementAtIndex(colToRemove.cards, cardPosition);
		colToAdd.cards = addElementAtIndex(colToAdd.cards, newPosition, cardToAdd);
	}
	return boardData;
};

export const handleAddComments = (board: BoardType, changes: AddCommentDto, user: any) => {
	// avoid read only error
	const boardData: BoardType = JSON.parse(JSON.stringify(board));
	const { cardId, cardItemId, text } = changes;
	let columnIndex = 0;

	boardData.columns.forEach((item, index) => {
		if (item.cards.find((col) => col._id === cardId) !== undefined) {
			return (columnIndex = index);
		}
	});

	const card = boardData.columns[columnIndex].cards.find((card) => card._id === cardId);
	const cardItem = card!.items.find((cardItem) => cardItem._id === cardItemId);
	const placehodlerId = (Math.random() + 1).toString(36).substring(7);

	const commentObj = {
		text: text,
		createdBy: {
			_id: user.id,
			firstName: user.firstName,
			lastName: user.lastName,
			email: '',
			isSAdmin: false,
			joinedAt: ''
		},
		_id: placehodlerId,
		id: placehodlerId
	};

	cardItem?.comments.push(commentObj);

	return boardData;
};

export const handleDeleteComments = (board: BoardType, changes: DeleteCommentDto) => {
	// avoid read only error
	const boardData: BoardType = JSON.parse(JSON.stringify(board));
	const { cardId, cardItemId, commentId } = changes;
	let columnIndex = 0;

	boardData.columns.forEach((item, index) => {
		if (item.cards.find((col) => col._id === cardId) !== undefined) {
			return (columnIndex = index);
		}
	});

	const card = boardData.columns[columnIndex].cards.find((card) => card._id === cardId);
	const cardItem = card!.items.find((cardItem) => cardItem._id === cardItemId);
	const comment = cardItem!.comments.find((comment) => comment._id === commentId);
	const commentIndex = cardItem?.comments.indexOf(comment!, 0);

	cardItem?.comments.splice(commentIndex!, 1);

	return boardData;
};

export const handleUpdateComments = (board: BoardType, changes: UpdateCommentDto) => {
	// avoid read only error
	const boardData: BoardType = JSON.parse(JSON.stringify(board));
	const { cardId, cardItemId, commentId, text } = changes;
	let columnIndex = 0;

	boardData.columns.forEach((item, index) => {
		if (item.cards.find((col) => col._id === cardId) !== undefined) {
			return (columnIndex = index);
		}
	});

	const card = boardData.columns[columnIndex].cards.find((card) => card._id === cardId);
	const cardItem = card!.items.find((cardItem) => cardItem._id === cardItemId);
	const comment = cardItem!.comments.find((comment) => comment._id === commentId);

	comment!.text = text;

	return boardData;
};
