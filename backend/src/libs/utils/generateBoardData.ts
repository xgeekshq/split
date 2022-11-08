import BoardDto from 'modules/boards/dto/board.dto';
import BoardUserDto from 'modules/boards/dto/board.user.dto';
import { CreateBoardDto } from 'modules/boards/services/create.board.service';

export const generateSubBoardDtoData = (index: number, users: BoardUserDto[] = []): BoardDto => {
	return {
		title: `Sub-team board ${index}`,
		columns: [
			{ title: 'Went well', color: '$highlight1Light', cards: [] },
			{ title: 'To improve', color: '$highlight4Light', cards: [] },
			{ title: 'Action points', color: '$highlight3Light', cards: [] }
		],
		isPublic: false,
		dividedBoards: [],
		recurrent: false,
		users,
		team: null,
		isSubBoard: true,
		maxVotes: undefined,
		hideCards: false,
		hideVotes: false
	};
};

export const generateBoardDtoData = (title: string): CreateBoardDto => {
	return {
		users: [],
		team: null,
		maxUsers: 2,
		board: {
			title,
			columns: [
				{ title: 'Went well', color: '$highlight1Light', cards: [] },
				{ title: 'To improve', color: '$highlight4Light', cards: [] },
				{ title: 'Action points', color: '$highlight3Light', cards: [] }
			],
			isPublic: false,
			maxVotes: undefined,
			dividedBoards: [],
			recurrent: true,
			users: [],
			team: null,
			isSubBoard: false,
			hideCards: false,
			hideVotes: false
		}
	};
};
