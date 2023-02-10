import { LeanDocument } from 'mongoose';
import { boardVotesIdHidden } from 'src/libs/utils/boardVotesIdHidden';
import { hideText } from 'src/libs/utils/hideText';
import CardItem from 'src/modules/cards/schemas/card.item.schema';
import Card from 'src/modules/cards/schemas/card.schema';
import Comment from 'src/modules/comments/schemas/comment.schema';
import { UserDocument } from 'src/modules/users/entities/user.schema';
import Board from '../schemas/board.schema';

/**
 * Method to (if flags are true) replace cards/comments or hide votes
 * @param input Board
 * @param userId Current Logged User
 * @returns Board
 */
export const cleanBoard = (input: Board, userId: string): Board => {
	const { hideCards = false, hideVotes = false, columns: boardColumns } = input;
	// Columns
	input.columns = boardColumns.map((column) => {
		const cards = column.cards.map((card) => {
			const items = card.items.map((item) => {
				return replaceCard(item, userId, hideCards, hideVotes);
			});

			return {
				...replaceCard(card, userId, hideCards, hideVotes),
				items
			};
		});

		return {
			...column,
			cards
		};
	});

	return boardVotesIdHidden(input, userId);
};

/**
 * Replace card from other users, using the methods created before
 * @param input Card or a Card Item
 * @param userId current logged user
 * @param hideCards option from database
 * @param hideVotes option from database
 * @returns Card or a Card Item
 */
export const replaceCard = (
	input: Card | CardItem,
	userId: string,
	hideCards: boolean,
	hideVotes: boolean
): Card | CardItem => {
	let { text, comments, votes, createdBy } = input;
	const { anonymous, createdByTeam } = input;
	const createdByAsUserDocument = createdBy as UserDocument;

	if (hideCards && String(createdByAsUserDocument?._id) !== String(userId)) {
		text = hideText(input.text);
		createdBy = createdByAsUserDocument ? replaceUser(createdByAsUserDocument, userId) : null;
	}

	if (comments?.length > 0) {
		comments = replaceComments(hideCards, createdByAsUserDocument, input.comments, userId);
	}

	if (anonymous || createdByTeam) {
		createdBy = replaceUser(createdByAsUserDocument, userId);
	}

	if (hideVotes) {
		votes = filterVotes(input, userId);
	}

	return {
		...input,
		text,
		votes,
		comments,
		createdBy
	};
};

/**
 * Filter an array of votes and return only the votes from current user
 * @param input Array of Votes
 * @param userId Current Logged User
 * @returns Array of Votes (filtered)
 */
export const filterVotes = (input: Card | CardItem, userId: string) => {
	return (input.votes as UserDocument[]).filter((vote) => String(vote._id) === String(userId));
};

/**
 * Replace user name (first and last) by "a"
 * @param input Card or a Card Item
 * @param userId current logged user
 * @param anonymous boolean to used when card is anonymous
 * @returns Created By User with first/last name replaced by "a"
 */
export const replaceUser = (input: UserDocument, userId: string): LeanDocument<UserDocument> => {
	return {
		...input,
		_id: String(userId) === String(input?._id) ? input?._id : undefined,
		firstName: hideText(input?.firstName),
		lastName: hideText(input?.lastName)
	};
};

/**
 * Replace comments from other users
 * @param input array of comments
 * @param userId current logged user
 * @returns array of comments
 */
export const replaceComments = (
	hideCards: boolean,
	createdByAsUserDocument: UserDocument,
	input: Comment[],
	userId: string
): Comment[] => {
	return input.map((comment) => {
		const { anonymous, text } = comment;

		if (anonymous && String(createdByAsUserDocument._id) !== String(userId)) {
			return {
				...comment,
				text: hideCards ? hideText(text) : comment.text,
				createdBy: replaceUser(comment.createdBy as UserDocument, userId)
			};
		}

		if (hideCards && String(createdByAsUserDocument._id) !== String(userId)) {
			return {
				...comment,
				createdBy:
					comment.createdBy && userId
						? replaceUser(comment.createdBy as UserDocument, userId)
						: null,
				text: hideText(text)
			};
		}

		return { ...comment };
	});
};
