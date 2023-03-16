import { BoardFactory } from 'src/libs/test-utils/mocks/factories/board-factory.mock';
import { hideText } from 'src/libs/utils/hideText';
import Card from 'src/modules/cards/entities/card.schema';
import Column from 'src/modules/columns/entities/column.schema';
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

const hideVotes = (votes: string[], createdBy: string) => {
	return votes.map((vote) => {
		if (String(vote) !== String(createdBy)) {
			return hideText(String(vote));
		}

		return vote;
	});
};

describe('cleanBoard function', () => {
	test('cleanBoard should return votes hidden if they not belong to the user', () => {
		const board = BoardFactory.create({ hideCards: false, hideVotes: false });
		const createdByUser_1 = formatCreatedBy(board.columns[0].cards[0].createdBy as User);

		// Format board fields accordingly with conditions to test and format createdBy to only have the fields from formatCreatedBy
		board.columns.forEach((column) => {
			column.cards.forEach((card) => {
				card.anonymous = false;
				card.comments = [];
				card.createdByTeam = null;
				card.createdBy = formatCreatedBy(card.createdBy as User);
				card.items.forEach((cardItem) => {
					cardItem.anonymous = false;
					cardItem.createdBy = formatCreatedBy(cardItem.createdBy as User);
					cardItem.comments = [];
					cardItem.createdByTeam = null;
				});
			});
		});

		const boardResult = JSON.parse(JSON.stringify(board));

		/* Format boardResult fields accordingly with what should be returned by the function:
          - hide votes that are not from the user
        */
		boardResult.columns.forEach((column) => {
			column.cards.forEach((card) => {
				card.createdAt = new Date(card.createdAt);
				card.items.forEach((cardItem) => {
					cardItem.createdAt = new Date(cardItem.createdAt);
					cardItem.votes = hideVotes(cardItem.votes as string[], String(createdByUser_1._id));
				});
			});
		});

		expect(cleanBoard(board, createdByUser_1._id)).toEqual(boardResult);
	});

	test('cleanBoard should return cards with hidden text', () => {
		const board = BoardFactory.create({ hideCards: true, hideVotes: false });
		const createdByUser_1 = formatCreatedBy(board.columns[0].cards[0].createdBy as User);

		// Format board fields accordingly with conditions to test and format createdBy to only have the fields from formatCreatedBy
		board.columns.forEach((column) => {
			column.cards.forEach((card) => {
				card.anonymous = false;
				card.comments = [];
				card.createdByTeam = null;
				card.createdBy = formatCreatedBy(card.createdBy as User);
				card.items.forEach((cardItem) => {
					cardItem.anonymous = false;
					cardItem.comments = [];
					cardItem.createdByTeam = null;
					cardItem.createdBy = formatCreatedBy(cardItem.createdBy as User);
				});
			});
		});

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
		const board = BoardFactory.create({ hideCards: false, hideVotes: false });
		const createdByUser_1 = formatCreatedBy(board.columns[0].cards[0].createdBy as User);
		const createdByUser_2 = formatCreatedBy(board.columns[0].cards[1].createdBy as User);

		// Format board fields accordingly with conditions to test and format createdBy to only have the fields from formatCreatedBy
		board.columns.forEach((column) => {
			column.cards.forEach((card) => {
				card.createdBy = formatCreatedBy(card.createdBy as User);
				card.comments = [];
				card.anonymous = card.createdBy._id === createdByUser_2._id ? true : false;
				card.createdByTeam = card.createdBy._id === createdByUser_1._id ? card.createdByTeam : null;

				card.items.forEach((cardItem) => {
					cardItem.createdBy = formatCreatedBy(card.createdBy as User);
					cardItem.comments = [];
					cardItem.anonymous = cardItem.createdBy._id === createdByUser_2._id ? true : false;
					cardItem.createdByTeam =
						cardItem.createdBy._id === createdByUser_1._id ? cardItem.createdByTeam : null;
				});
			});
		});

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
		const board = BoardFactory.create({ hideCards: false, hideVotes: true });
		const createdByUser_1 = formatCreatedBy(board.columns[0].cards[0].createdBy as User);

		// Format board fields accordingly with conditions to test and format createdBy to only have the fields from formatCreatedBy
		board.columns.forEach((column) => {
			column.cards.forEach((card) => {
				card.anonymous = false;
				card.comments = [];
				card.createdByTeam = null;
				card.createdBy = formatCreatedBy(card.createdBy as User);
				card.items.forEach((cardItem) => {
					cardItem.anonymous = false;
					cardItem.comments = [];
					cardItem.createdByTeam = null;
					cardItem.createdBy = formatCreatedBy(cardItem.createdBy as User);
				});
			});
		});

		const boardResult = JSON.parse(JSON.stringify(board));

		/* Format boardResult fields accordingly with what should be returned by the function:
          - filter votes if hideVotes is true
          - hide votes that are not from the user
        */
		boardResult.columns.forEach((column) => {
			column.cards.forEach((card) => {
				card.createdAt = new Date(card.createdAt);
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

	test('cleanBoard should return cards and votes hidden if hideCards and hidVotes are true', () => {
		const board = BoardFactory.create({ hideCards: true, hideVotes: true });
		const createdByUser_1 = formatCreatedBy(board.columns[0].cards[0].createdBy as User);

		// Format board fields accordingly with conditions to test and format createdBy to only have the fields from formatCreatedBy
		board.columns.forEach((element) => {
			element.cards.forEach((card) => {
				card.anonymous = false;
				card.comments = [];
				card.createdByTeam = null;
				card.createdBy = formatCreatedBy(card.createdBy as User);
				card.items.forEach((cardItem) => {
					cardItem.anonymous = false;
					cardItem.comments = [];
					cardItem.createdByTeam = null;
					cardItem.createdBy = formatCreatedBy(cardItem.createdBy as User);
				});
			});
		});

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
		const board = BoardFactory.create({ hideCards: false, hideVotes: false });
		const createdByUser_1 = formatCreatedBy(board.columns[0].cards[0].createdBy as User);
		const createdByUser_2 = formatCreatedBy(board.columns[0].cards[1].createdBy as User);

		// Format board fields accordingly with conditions to test and format createdBy to only have the fields from formatCreatedBy and ensures that besides
		//of the comments above, all others are not anonymous
		board.columns.forEach((column) => {
			column.cards.forEach((card) => {
				card.createdByTeam = null;
				card.anonymous = false;
				card.createdBy = formatCreatedBy(card.createdBy as User);
				card.comments.forEach((comment) => {
					comment.createdBy = formatCreatedBy(comment.createdBy as User);
					comment.anonymous = comment.createdBy._id === createdByUser_2._id ? true : false;
				});
				card.items.forEach((cardItem) => {
					cardItem.createdByTeam = null;
					cardItem.anonymous = false;
					cardItem.createdBy = formatCreatedBy(cardItem.createdBy as User);
					cardItem.comments.forEach((commentItem) => {
						commentItem.createdBy = formatCreatedBy(commentItem.createdBy as User);
						commentItem.anonymous =
							commentItem.createdBy._id === createdByUser_2._id ? true : false;
					});
				});
			});
		});

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
		const board = BoardFactory.create({ hideCards: true, hideVotes: false });
		const createdByUser_1 = formatCreatedBy(board.columns[0].cards[0].createdBy as User);

		// Format board fields accordingly with conditions to test and format createdBy to only have the fields from formatCreatedBy and comment.anonymous to false
		board.columns.forEach((column) => {
			column.cards.forEach((card) => {
				card.createdByTeam = null;
				card.anonymous = false;
				card.createdBy = formatCreatedBy(card.createdBy as User);
				card.comments.forEach((comment) => {
					comment.createdBy = formatCreatedBy(comment.createdBy as User);
					comment.anonymous = false;
				});
				card.items.forEach((cardItem) => {
					cardItem.createdByTeam = null;
					cardItem.anonymous = false;
					cardItem.createdBy = formatCreatedBy(cardItem.createdBy as User);
					cardItem.comments.forEach((commentItem) => {
						commentItem.createdBy = formatCreatedBy(commentItem.createdBy as User);
						commentItem.anonymous = false;
					});
				});
			});
		});

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
