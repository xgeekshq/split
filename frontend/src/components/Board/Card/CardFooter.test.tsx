import { useRouter } from 'next/router';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { BoardUser } from 'types/board/board.user';
import CardType from 'types/card/card';
import CommentType from 'types/comment/comment';
import CardFooter from './CardFooter';

import * as UseVotes from 'hooks/useVotes';
import { debug } from 'webpack';

// const spy = jest.spyOn(UseVotes, 'default').mockImplementation(() => ({
//   ...mockedUseVotes as any,
//   addVote: {
//     mutate: () => 'teste'
//   } as any
// }));

jest.mock('react-query');

const mockSession = {
	expires: 1,
	user: { id: '1', username: 'user1' }
};

jest.mock('next-auth/react', () => {
	return {
		useSession: jest.fn(() => {
			return { data: mockSession, status: 'authenticated' };
		})
	};
});

jest.mock('next/router', () => ({
	useRouter: jest.fn()
}));

(useRouter as jest.Mock).mockImplementation(() => ({
	pathname: '/',
	query: {
		boardId: '1'
	}
}));

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

const mockedCard = {
	createdBy: {
		firstName: 'First',
		lastName: 'Last'
	},
	comments: [{}, {}],
	items: [
		{
			text: 'text1',
			createdBy: {
				firstName: 'First',
				lastName: 'Last'
			},
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
	hideCards: false,
};

describe('CardFooter', () => {
	it('should render CardFooter and contains the name of whose created the card', async () => {
		const { getByText } = render(
			<CardFooter
				{...initialProps}
			/>
		);
		
		const name = `${mockedCard.createdBy?.firstName} ${mockedCard.createdBy?.lastName}`;
		expect(getByText(name)).toBeInTheDocument();

		const initialsName = `${mockedCard.createdBy?.firstName.charAt(0)}${mockedCard.createdBy?.lastName.charAt(0)}`
		expect(getByText(initialsName)).toBeInTheDocument();
	});

	it('should call addVote function when user click on addVoteButton', async () => {
		const spy = jest.spyOn(mockedUseVotes.addVote, 'mutate');

		render(
			<CardFooter
				{...initialProps}
				isMainboard={true}
			/>
		);

		const addVoteButton = screen.getByTestId('btn_addVote');
		await waitFor(() => userEvent.click(addVoteButton));
		expect(spy).toHaveBeenCalledTimes(1);
		spy.mockRestore();
	});

	it('should call deleteVote function when logged user can delete his own votes', async () => {
		const spy = jest.spyOn(mockedUseVotes.deleteVote, 'mutate');
		const mockedCardTemp = {
			...mockedCard,
			items: [{
				...mockedCard.items[0],
				votes: [mockSession.user.id],
			}]
		};

		render(
			<CardFooter
				{...initialProps}
				userId={mockSession.user.id}
				isMainboard={true}
				card={mockedCardTemp}
			/>
		);

		const btnDeleteVote = screen.getByTestId('btn_delVote');
		await waitFor(() => userEvent.click(btnDeleteVote));
		expect(spy).toHaveBeenCalledTimes(1);
		spy.mockRestore();
	});

});
