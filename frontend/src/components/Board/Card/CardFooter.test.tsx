import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';

import { BoardUser } from 'types/board/board.user';
import CardType from 'types/card/card';
import CommentType from 'types/comment/comment';
import { BoardUserRoles } from 'utils/enums/board.user.roles';
import CardFooter from './CardFooter';

jest.mock('react-query');

const mockSession = {
	expires: 1,
	user: {
		id: '1',
		email: 'test@mail.com'
	}
};

jest.mock('next-auth/react', () => {
	return {
		useSession: jest.fn(() => {
			return {
				data: mockSession,
				status: 'authenticated'
			};
		})
	};
});

const mockedCard = {
	createdBy: {
		firstName: 'First',
		lastName: 'Last'
	},
	comments: [{}, {}],
	votes: ['any_id1', 'any_id2'],
	items: [
		{
			text: 'text1',
			createdBy: {
				firstName: 'First',
				lastName: 'Last'
			},
			comments: [{}, {}],
			votes: ['any_id1', 'any_id2']
		}
	]
} as CardType;

const initialProps = {
	boardId: 'any_id',
	socketId: 'any_id',
	userId: 'any_id',
	anonymous: false,
	card: mockedCard,
	teamName: mockedCard.createdByTeam,
	isItem: false,
	isMainboard: false,
	comments: [] as CommentType[],
	setOpenComments: () => {},
	isCommentsOpened: false,
	boardUser: {} as BoardUser,
	maxVotes: 6,
	hideCards: false
};

const mockedUseVotes = {
	addVote: {
		mutate: jest.fn()
	},
	deleteVote: {
		mutate: jest.fn()
	}
};

jest.mock('hooks/useVotes', () => ({
	__esModule: true,
	default: () => mockedUseVotes
}));

describe('CardFooter', () => {
	it('should render CardFooter and contains the name of whose created the card', async () => {
		const { getByText, getByTestId } = render(<CardFooter {...initialProps} />);

		const name = `${mockedCard.createdBy?.firstName} ${mockedCard.createdBy?.lastName}`;
		expect(getByText(name)).toBeInTheDocument();

		const initialsName = `${mockedCard.createdBy?.firstName.charAt(
			0
		)}${mockedCard.createdBy?.lastName.charAt(0)}`;
		expect(getByText(initialsName)).toBeInTheDocument();

		const lblTotalVotes = within(getByTestId('lbl_totalVotes'));
		expect(lblTotalVotes.getByText(mockedCard.votes.length)).toBeInTheDocument();
	});

	describe('addVote()', () => {
		it('should call addVote function when user click on btn_addVote', async () => {
			const spy = jest.spyOn(mockedUseVotes.addVote, 'mutate');

			render(<CardFooter {...initialProps} isMainboard />);

			const addVoteButton = screen.getByTestId('btn_addVote');
			await waitFor(() => fireEvent.click(addVoteButton));
			expect(spy).toHaveBeenCalledTimes(1);
			spy.mockRestore();
		});

		it('should not be possible to add more votes when user reached the max votes ', async () => {
			const spy = jest.spyOn(mockedUseVotes.addVote, 'mutate');

			const mockedBoardUser = {
				_id: mockSession.user.id,
				role: BoardUserRoles.MEMBER,
				votesCount: initialProps.maxVotes
			} as BoardUser;

			render(<CardFooter {...initialProps} isMainboard boardUser={mockedBoardUser} />);

			const addVoteButton = screen.getByTestId('btn_addVote');
			await waitFor(() => fireEvent.click(addVoteButton));
			expect(spy).not.toHaveBeenCalledTimes(1);
			spy.mockRestore();
		});
	});

	describe('deleteVote()', () => {
		it('should call deleteVote function when logged user can delete his own votes', async () => {
			const spy = jest.spyOn(mockedUseVotes.deleteVote, 'mutate');

			const mockedCardTemp = {
				...mockedCard,
				items: [
					{
						...mockedCard.items[0],
						votes: [mockSession.user.id]
					}
				]
			};

			render(
				<CardFooter
					{...initialProps}
					userId={mockSession.user.id}
					isMainboard
					card={mockedCardTemp}
				/>
			);

			const btnDeleteVote = screen.getByTestId('btn_deleteVote');
			await waitFor(() => fireEvent.click(btnDeleteVote));
			expect(spy).toHaveBeenCalledTimes(1);
			spy.mockRestore();
		});

		it('should not call deleteVote function if the logged user didnt vote on selected card', async () => {
			const spy = jest.spyOn(mockedUseVotes.deleteVote, 'mutate');

			render(<CardFooter {...initialProps} userId={mockSession.user.id} isMainboard />);

			const btnDeleteVote = screen.getByTestId('btn_deleteVote');
			await waitFor(() => fireEvent.click(btnDeleteVote));
			expect(spy).not.toHaveBeenCalledTimes(1);
			spy.mockRestore();
		});
	});
});
