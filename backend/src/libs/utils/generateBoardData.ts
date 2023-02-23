import BoardDto from 'src/modules/boards/dto/board.dto';
import BoardUserDto from 'src/modules/boards/dto/board.user.dto';
import { CreateBoardDto } from 'src/modules/boards/services/create.board.service';

export const generateSubBoardDtoData = (index: number, users: BoardUserDto[] = []): BoardDto => {
	return {
		title: `Sub-team board ${index}`,
		columns: [
			{
				title: 'Went well',
				color: '$highlight1Light',
				cards: [],
				cardText: 'Write your comment here...',
				isDefaultText: true
			},
			{
				title: 'To improve',
				color: '$highlight4Light',
				cards: [],
				cardText: `Description: \n\nHow to improve:`,
				isDefaultText: true
			},
			{
				title: 'Action points',
				color: '$highlight3Light',
				cards: [],
				cardText: 'Write your comment here...',
				isDefaultText: true
			}
		],
		isPublic: false,
		dividedBoards: [],
		recurrent: false,
		users,
		team: null,
		boardNumber: index,
		maxVotes: undefined,
		hideCards: false,
		hideVotes: false,
		responsibles: [],
		phase: 'addcards'
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
				{
					title: 'Went well',
					color: '$highlight1Light',
					cards: [],
					cardText: 'Write your comment here...',
					isDefaultText: true
				},
				{
					title: 'To improve',
					color: '$highlight4Light',
					cards: [],
					cardText: `Description: \n\nHow to improve:`,
					isDefaultText: true
				},
				{
					title: 'Action points',
					color: '$highlight3Light',
					cards: [],
					cardText: 'Write your comment here...',
					isDefaultText: true
				}
			],
			isPublic: false,
			maxVotes: undefined,
			dividedBoards: [],
			recurrent: true,
			users: [],
			team: null,
			boardNumber: 0,
			hideCards: false,
			hideVotes: false,
			responsibles: [],
			phase: 'addcards'
		}
	};
};
