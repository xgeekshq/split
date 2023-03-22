import { BoardFactory } from 'src/libs/test-utils/mocks/factories/board-factory.mock';
import { mergeCardsFromSubBoardColumnsIntoMainBoard } from './merge-cards-from-subboard';

describe('mergeCardsFromSubboard function', () => {
	test('should return the columns with the cards from the subBoards', () => {
		const subBoard = BoardFactory.create({ isSubBoard: true });
		const mainBoard = BoardFactory.create({ isSubBoard: false, dividedBoards: [subBoard] });

		const mainBoardColumnsResult = [...mainBoard.columns];

		for (let i = 0; i < mainBoardColumnsResult.length; i++) {
			mainBoardColumnsResult[i].cards = [
				...mainBoardColumnsResult[i].cards,
				...subBoard.columns[i].cards
			];
		}

		expect(mergeCardsFromSubBoardColumnsIntoMainBoard(mainBoard.columns, subBoard.columns)).toEqual(
			mainBoardColumnsResult
		);
	});
});
