import { BoardFactory } from 'src/libs/test-utils/mocks/factories/board-factory.mock';
import { CardFactory } from 'src/libs/test-utils/mocks/factories/card-factory.mock';
import { CardItemFactory } from 'src/libs/test-utils/mocks/factories/cardItem-factory.mock';
import { ColumnFactory } from 'src/libs/test-utils/mocks/factories/column-factory.mock';
import { CommentFactory } from 'src/libs/test-utils/mocks/factories/comment-factory.mock';
import { UserFactory } from 'src/libs/test-utils/mocks/factories/user-factory';
import { hideText } from 'src/libs/utils/hideText';
import Card from 'src/modules/cards/entities/card.schema';
import Column from 'src/modules/columns/entities/column.schema';
import Comment from 'src/modules/comments/entities/comment.schema';
import User from 'src/modules/users/entities/user.schema';
import { cleanBoard, replaceUser } from './clean-board';

const formatCreatedBy = (cardElement: User) => {
	return {
		_id: cardElement._id,
		firstName: cardElement.firstName,
		lastName: cardElement.lastName
	} as User;
};

const filterVotes = (votes: string[], userId: string) => {
	return votes.filter((vote) => String(vote) === String(userId));
};

export const hideVotes = (votes: string[], createdBy: string) => {
	return votes.map((vote) => {
		if (String(vote) !== String(createdBy)) {
			return hideText(String(vote));
		}

		return vote;
	});
};

const formatCreatedByOfCards = (cards: Card[]) => {
	return cards.map((card) => {
		card.createdBy = formatCreatedBy(card.createdBy as User);
		card.comments = card.comments.length != 0 ? formatCreatedByOfComments(card.comments) : [];
		card.items.forEach((cardItem) => {
			cardItem.createdBy = formatCreatedBy(cardItem.createdBy as User);
			cardItem.comments =
				cardItem.comments.length != 0 ? formatCreatedByOfComments(cardItem.comments) : [];
		});

		return card;
	});
};

const formatCreatedByOfComments = (comments: Comment[]) => {
	return comments.map((comment) => {
		comment.createdBy = formatCreatedBy(comment.createdBy as User);

		return comment;
	});
};

const formatColumns = (columns: Column[]) => {
	return columns.map((column) => {
		column.cards = formatCreatedByOfCards(column.cards);

		return column;
	});
};

describe('cleanBoard function', () => {
	test('cleanBoard should return votes hidden if they not belong to the user', () => {
		const cardUsers = UserFactory.createMany(2);
		const board = BoardFactory.create({
			hideCards: false,
			hideVotes: false,
			columns: ColumnFactory.createMany(3, () => ({
				cards: CardFactory.createMany(2, [
					{
						votes: [cardUsers[0]._id],
						createdBy: cardUsers[0],
						anonymous: false,
						createdByTeam: null,
						comments: [],
						items: [
							CardItemFactory.create({
								createdBy: cardUsers[0],
								anonymous: false,
								comments: [],
								createdByTeam: null,
								votes: [cardUsers[0]._id, cardUsers[1]._id]
							})
						]
					},
					{
						createdBy: cardUsers[1],
						anonymous: false,
						comments: [],
						createdByTeam: null,
						votes: [cardUsers[1]._id],
						items: [
							CardItemFactory.create({
								createdBy: cardUsers[0],
								anonymous: false,
								comments: [],
								createdByTeam: null,
								votes: [cardUsers[0]._id, cardUsers[1]._id]
							})
						]
					}
				])
			}))
		});

		const createdByUser_1 = formatCreatedBy(board.columns[0].cards[0].createdBy as User);

		// Format board fields accordingly with conditions to test and format createdBy to only have the fields from formatCreatedBy
		board.columns = formatColumns(board.columns);

		const boardResult = JSON.parse(JSON.stringify(board));

		/* Format boardResult fields accordingly with what should be returned by the function:
          - hide votes that are not from the user
        */
		boardResult.columns.forEach((column) => {
			column.cards.forEach((card) => {
				card.createdAt = new Date(card.createdAt);
				card.votes = hideVotes(card.votes as string[], String(createdByUser_1._id));
				card.items.forEach((cardItem) => {
					cardItem.createdAt = new Date(cardItem.createdAt);
					cardItem.votes = hideVotes(cardItem.votes as string[], String(createdByUser_1._id));
				});
			});
		});

		expect(cleanBoard(board, createdByUser_1._id)).toEqual(boardResult);
	});

	test('cleanBoard should return cards with hidden text', () => {
		const cardUsers = UserFactory.createMany(2);
		const board = BoardFactory.create({
			hideCards: true,
			hideVotes: false,
			columns: ColumnFactory.createMany(3, () => ({
				cards: CardFactory.createMany(2, [
					{
						createdBy: cardUsers[0],
						anonymous: false,
						createdByTeam: null,
						comments: [],
						votes: [cardUsers[1]._id],
						items: [
							CardItemFactory.create({
								createdBy: cardUsers[0],
								anonymous: false,
								comments: [],
								createdByTeam: null,
								votes: [cardUsers[1]._id]
							})
						]
					},
					{
						createdBy: cardUsers[1],
						anonymous: false,
						comments: [],
						createdByTeam: null,
						votes: [cardUsers[0]._id],
						items: [
							CardItemFactory.create({
								createdBy: cardUsers[0],
								anonymous: false,
								comments: [],
								createdByTeam: null,
								votes: [cardUsers[0]._id, cardUsers[1]._id]
							})
						]
					}
				])
			}))
		});
		const createdByUser_1 = formatCreatedBy(board.columns[0].cards[0].createdBy as User);

		// Format board fields accordingly with conditions to test and format createdBy to only have the fields from formatCreatedBy
		board.columns = formatColumns(board.columns);

		const boardResult = JSON.parse(JSON.stringify(board));

		/* Format boardResult fields accordingly with what should be returned by the function:
          - hide text and replace user when card/cardItem if it is created by a user different form the arg userId and hideCards is true
          - hide votes that are not from the user
          */
		boardResult.columns.forEach((column) => {
			column.cards.forEach((card: Card) => {
				const createdByAsUser = card.createdBy as User;

				if (createdByAsUser._id !== createdByUser_1._id) {
					card.text = hideText(card.text);
					card.createdBy = replaceUser(createdByAsUser, createdByUser_1._id);
				}
				card.createdAt = new Date(card.createdAt);
				card.votes = hideVotes(card.votes as string[], String(createdByUser_1._id));
				card.items.forEach((cardItem) => {
					const createdByAsUserItem = cardItem.createdBy as User;

					if (createdByAsUserItem._id !== createdByUser_1._id) {
						cardItem.text = hideText(cardItem.text);
						cardItem.createdBy = replaceUser(createdByAsUserItem, createdByUser_1._id);
					}
					cardItem.createdAt = new Date(cardItem.createdAt);
					cardItem.votes = hideVotes(cardItem.votes as string[], String(createdByUser_1._id));
				});
			});
		});

		expect(cleanBoard(board, createdByUser_1._id)).toEqual(boardResult);
	});

	test('cleanBoard should return createdBy with hidden text if anonymous or createdByTeam are true', () => {
		const cardUsers = UserFactory.createMany(2);
		const board = BoardFactory.create({
			hideCards: false,
			hideVotes: false,
			columns: ColumnFactory.createMany(3, () => ({
				cards: CardFactory.createMany(2, [
					{
						createdBy: cardUsers[0],
						anonymous: false,
						comments: [],
						votes: [cardUsers[1]._id],
						items: [
							CardItemFactory.create({
								createdBy: cardUsers[0],
								anonymous: false,
								comments: [],
								votes: [cardUsers[1]._id]
							})
						]
					},
					{
						createdBy: cardUsers[1],
						anonymous: true,
						comments: [],
						createdByTeam: null,
						votes: [cardUsers[1]._id],
						items: [
							CardItemFactory.create({
								createdBy: cardUsers[1],
								anonymous: true,
								comments: [],
								createdByTeam: null,
								votes: [cardUsers[0]._id, cardUsers[0]._id]
							})
						]
					}
				])
			}))
		});
		const createdByUser_1 = formatCreatedBy(board.columns[0].cards[0].createdBy as User);

		// Format board fields accordingly with conditions to test and format createdBy to only have the fields from formatCreatedBy
		board.columns = formatColumns(board.columns);

		const boardResult = JSON.parse(JSON.stringify(board));

		/* Format boardResult fields accordingly with what should be returned by the function:
          - replace user when card/cardItem if card is anonymous or is createdByTeam
          - hide votes that are not from the user
          */
		boardResult.columns.forEach((column) => {
			column.cards.forEach((card) => {
				const createdByAsUser = card.createdBy as User;

				if (card.anonymous || card.createdByTeam) {
					card.createdBy = replaceUser(createdByAsUser, createdByUser_1._id);
				}

				card.createdAt = new Date(card.createdAt);
				card.votes = hideVotes(card.votes as string[], String(createdByUser_1._id));
				card.items.forEach((cardItem) => {
					const createdByAsUserItem = cardItem.createdBy as User;

					if (cardItem.anonymous || cardItem.createdByTeam) {
						cardItem.createdBy = replaceUser(createdByAsUserItem, createdByUser_1._id);
					}
					cardItem.createdAt = new Date(cardItem.createdAt);
					cardItem.votes = hideVotes(cardItem.votes as string[], String(createdByUser_1._id));
				});
			});
		});

		expect(cleanBoard(board, createdByUser_1._id)).toEqual(boardResult);
	});

	test('cleanBoard should return votes user only ', () => {
		const cardUsers = UserFactory.createMany(2);
		const board = BoardFactory.create({
			hideCards: false,
			hideVotes: true,
			columns: ColumnFactory.createMany(3, () => ({
				cards: CardFactory.createMany(2, [
					{
						votes: [cardUsers[1]._id],
						createdBy: cardUsers[0],
						anonymous: false,
						comments: [],
						createdByTeam: null,
						items: [
							CardItemFactory.create({
								createdBy: cardUsers[0],
								anonymous: false,
								comments: [],
								createdByTeam: null,
								votes: [cardUsers[1]._id, cardUsers[1]._id]
							})
						]
					},
					{
						createdBy: cardUsers[1],
						anonymous: false,
						comments: [],
						createdByTeam: null,
						votes: [cardUsers[1]._id],
						items: [
							CardItemFactory.create({
								createdBy: cardUsers[1],
								anonymous: false,
								comments: [],
								createdByTeam: null,
								votes: [cardUsers[0]._id, cardUsers[1]._id]
							})
						]
					}
				])
			}))
		});
		const createdByUser_1 = formatCreatedBy(board.columns[0].cards[0].createdBy as User);

		// Format board fields accordingly with conditions to test and format createdBy to only have the fields from formatCreatedBy
		board.columns = formatColumns(board.columns);

		const boardResult = JSON.parse(JSON.stringify(board));

		/* Format boardResult fields accordingly with what should be returned by the function:
          - filter votes if hideVotes is true
          - hide votes that are not from the user
        */
		boardResult.columns.forEach((column) => {
			column.cards.forEach((card) => {
				card.createdAt = new Date(card.createdAt);
				card.votes = hideVotes(
					filterVotes(card.votes as string[], String(createdByUser_1._id)),
					String(createdByUser_1._id)
				);
				card.items.forEach((cardItem) => {
					cardItem.createdAt = new Date(cardItem.createdAt);
					cardItem.votes = hideVotes(
						filterVotes(cardItem.votes as string[], String(createdByUser_1._id)),
						String(createdByUser_1._id)
					);
				});
			});
		});

		expect(cleanBoard(board, createdByUser_1._id)).toEqual(boardResult);
	});

	test('cleanBoard should return cards and votes hidden if hideCards and hideVotes are true', () => {
		const cardUsers = UserFactory.createMany(2);
		const board = BoardFactory.create({
			hideCards: true,
			hideVotes: true,
			columns: ColumnFactory.createMany(3, () => ({
				cards: CardFactory.createMany(2, [
					{
						createdBy: cardUsers[0],
						anonymous: false,
						comments: [],
						createdByTeam: null,
						votes: [cardUsers[0]._id, cardUsers[1]._id],
						items: [
							CardItemFactory.create({
								createdBy: cardUsers[0],
								anonymous: false,
								comments: [],
								createdByTeam: null,
								votes: [cardUsers[0]._id, cardUsers[1]._id]
							})
						]
					},
					{
						createdBy: cardUsers[1],
						anonymous: false,
						comments: [],
						createdByTeam: null,
						votes: [cardUsers[0]._id],
						items: [
							CardItemFactory.create({
								createdBy: cardUsers[1],
								anonymous: false,
								comments: [],
								createdByTeam: null,
								votes: [cardUsers[0]._id, cardUsers[1]._id]
							})
						]
					}
				])
			}))
		});
		const createdByUser_1 = formatCreatedBy(board.columns[0].cards[0].createdBy as User);

		// Format board fields accordingly with conditions to test and format createdBy to only have the fields from formatCreatedBy
		board.columns = formatColumns(board.columns);

		const boardResult = JSON.parse(JSON.stringify(board));

		/* Format boardResult fields accordingly with what should be returned by the function:
        - hide text and replace user when card/cardItem if it is created by a user different form the arg userId and hideCards is true
        - filter votes if hideVotes is true
        - hide votes that are not from the user
        */
		boardResult.columns.forEach((column) => {
			column.cards.forEach((card) => {
				const createdByAsUser = card.createdBy as User;

				if (createdByAsUser._id !== createdByUser_1._id) {
					card.text = hideText(card.text);
					card.createdBy = replaceUser(createdByAsUser, createdByUser_1._id);
				}
				card.createdAt = new Date(card.createdAt);
				card.votes = hideVotes(
					filterVotes(card.votes as string[], String(createdByUser_1._id)),
					String(createdByUser_1._id)
				);
				card.items.forEach((cardItem) => {
					const createdByAsUserItem = cardItem.createdBy as User;

					if (createdByAsUserItem._id !== createdByUser_1._id) {
						cardItem.text = hideText(cardItem.text);
						cardItem.createdBy = replaceUser(createdByAsUserItem, createdByUser_1._id);
					}
					cardItem.createdAt = new Date(cardItem.createdAt);
					cardItem.votes = hideVotes(
						filterVotes(cardItem.votes as string[], String(createdByUser_1._id)),
						String(createdByUser_1._id)
					);
				});
			});
		});

		expect(cleanBoard(board, createdByUser_1._id)).toEqual(boardResult);
	});

	test('cleanBoard should return comments hidden if they are anonymous', () => {
		const cardUsers = UserFactory.createMany(2);
		const board = BoardFactory.create({
			hideCards: false,
			hideVotes: false,
			columns: ColumnFactory.createMany(3, () => ({
				cards: CardFactory.createMany(2, [
					{
						votes: [cardUsers[0]._id, cardUsers[1]._id],
						createdBy: cardUsers[0],
						anonymous: false,
						comments: CommentFactory.createMany(2, [
							{ createdBy: cardUsers[0], anonymous: false },
							{ createdBy: cardUsers[1], anonymous: true }
						]),
						createdByTeam: null,
						items: [
							CardItemFactory.create({
								createdBy: cardUsers[0],
								anonymous: false,
								comments: CommentFactory.createMany(2, [
									{ createdBy: cardUsers[0], anonymous: false },
									{ createdBy: cardUsers[1], anonymous: true }
								]),
								votes: [cardUsers[0]._id, cardUsers[1]._id],
								createdByTeam: null
							})
						]
					},
					{
						createdBy: cardUsers[1],
						anonymous: false,
						votes: [cardUsers[0]._id, cardUsers[1]._id],
						comments: [],
						createdByTeam: null,
						items: [
							CardItemFactory.create({
								createdBy: cardUsers[1],
								anonymous: false,
								comments: [],
								createdByTeam: null,
								votes: [cardUsers[0]._id, cardUsers[1]._id]
							})
						]
					}
				])
			}))
		});
		const createdByUser_1 = formatCreatedBy(board.columns[0].cards[0].createdBy as User);

		// Format board fields accordingly with conditions to test and format createdBy to only have the fields from formatCreatedBy and ensures that besides
		//of the comments above, all others are not anonymous
		board.columns = formatColumns(board.columns);

		const boardResult = JSON.parse(JSON.stringify(board));

		/* Format boardResult fields accordingly with what should be returned by the function:
        - enters on replaceComments
        - hide text if hideCards is true and replace user of card/cardItem if it is created by a user different form the arg userId
        - hide votes that are not from the user
          */
		boardResult.columns.forEach((column: Column) => {
			column.cards.forEach((card: Card) => {
				const createdByAsUser = card.createdBy as User;
				card.comments.forEach((comment) => {
					if (comment.anonymous && createdByAsUser._id !== createdByUser_1._id) {
						comment.text = board.hideCards ? hideText(comment.text) : comment.text;
						comment.createdBy = replaceUser(comment.createdBy as User, createdByUser_1._id);
					}
				});

				card.createdAt = new Date(card.createdAt);
				card.votes = hideVotes(card.votes as string[], String(createdByUser_1._id));
				card.items.forEach((cardItem) => {
					const createdByAsUserItem = cardItem.createdBy as User;
					cardItem.comments.forEach((commentItem) => {
						if (commentItem.anonymous && createdByAsUserItem._id !== createdByUser_1._id) {
							commentItem.text = board.hideCards ? hideText(commentItem.text) : commentItem.text;
							commentItem.createdBy = replaceUser(
								commentItem.createdBy as User,
								createdByUser_1._id
							);
						}
					});

					cardItem.createdAt = new Date(cardItem.createdAt);
					cardItem.votes = hideVotes(cardItem.votes as string[], String(createdByUser_1._id));
				});
			});
		});

		expect(cleanBoard(board, createdByUser_1._id)).toEqual(boardResult);
	});

	test('cleanBoard should return comments with text hidden if hideCards is true', () => {
		const cardUsers = UserFactory.createMany(2);
		const board = BoardFactory.create({
			hideCards: true,
			hideVotes: false,
			columns: ColumnFactory.createMany(3, () => ({
				cards: CardFactory.createMany(2, [
					{
						createdBy: cardUsers[0],
						anonymous: false,
						comments: CommentFactory.createMany(2, [
							{ createdBy: cardUsers[0], anonymous: false },
							{ createdBy: cardUsers[1], anonymous: false }
						]),
						votes: [cardUsers[0]._id, cardUsers[1]._id],
						createdByTeam: null,
						items: [
							CardItemFactory.create({
								createdBy: cardUsers[0],
								anonymous: false,
								comments: CommentFactory.createMany(2, [
									{ createdBy: cardUsers[0], anonymous: false },
									{ createdBy: cardUsers[1], anonymous: false }
								]),
								createdByTeam: null,
								votes: [cardUsers[0]._id, cardUsers[1]._id]
							})
						]
					},
					{
						createdBy: cardUsers[1],
						anonymous: false,
						comments: [],
						votes: [cardUsers[0]._id, cardUsers[1]._id],
						createdByTeam: null,
						items: [
							CardItemFactory.create({
								createdBy: cardUsers[1],
								anonymous: false,
								comments: [],
								createdByTeam: null,
								votes: [cardUsers[0]._id, cardUsers[1]._id]
							})
						]
					}
				])
			}))
		});
		const createdByUser_1 = formatCreatedBy(board.columns[0].cards[0].createdBy as User);

		// Format board fields accordingly with conditions to test and format createdBy to only have the fields from formatCreatedBy and comment.anonymous to false
		board.columns = formatColumns(board.columns);

		const boardResult = JSON.parse(JSON.stringify(board));

		/* Format boardResult fields accordingly with what should be returned by the function:
          - hide text if hideCards is true and replace user when comment if it is created by a user different form the arg userId
          - hide votes that are not from the user
          */
		boardResult.columns.forEach((column: Column) => {
			column.cards.forEach((card: Card) => {
				const createdByAsUserDocument = card.createdBy as User;

				if (createdByAsUserDocument._id !== createdByUser_1._id) {
					card.text = hideText(card.text);
					card.createdBy = replaceUser(card.createdBy as User, createdByUser_1._id);
				}

				card.comments.forEach((comment) => {
					if (board.hideCards && createdByAsUserDocument._id !== createdByUser_1._id) {
						comment.text = hideText(comment.text);
						comment.createdBy =
							comment.createdBy && createdByUser_1._id
								? replaceUser(comment.createdBy as User, createdByUser_1._id)
								: null;
					}
				});
				card.createdAt = new Date(card.createdAt);
				card.votes = hideVotes(card.votes as string[], String(createdByUser_1._id));
				card.items.forEach((cardItem) => {
					const createdByAsUserDocumentItem = cardItem.createdBy as User;

					if (createdByAsUserDocumentItem._id !== createdByUser_1._id) {
						cardItem.text = hideText(cardItem.text);
						cardItem.createdBy = replaceUser(cardItem.createdBy as User, createdByUser_1._id);
					}

					cardItem.comments.forEach((commentItem) => {
						if (board.hideCards && createdByAsUserDocumentItem._id !== createdByUser_1._id) {
							commentItem.text = hideText(commentItem.text);
							commentItem.createdBy =
								commentItem.createdBy && createdByUser_1._id
									? replaceUser(commentItem.createdBy as User, createdByUser_1._id)
									: null;
						}
					});
					cardItem.createdAt = new Date(cardItem.createdAt);
					cardItem.votes = hideVotes(cardItem.votes as string[], String(createdByUser_1._id));
				});
			});
		});

		expect(cleanBoard(board, createdByUser_1._id)).toEqual(boardResult);
	});
});
