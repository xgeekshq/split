import { useRouter } from 'next/router';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { BoardUser } from 'types/board/board.user';
import CardType from 'types/card/card';
import CommentType from 'types/comment/comment';
import CardFooter from './CardFooter';

jest.mock('react-query');
jest.mock('next-auth/react', () => {
	const mockSession = {
		expires: 1,
		user: { id: '1', username: 'user1' }
	};
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
jest.mock('hooks/useVotes', () => {
	return () => {
		return mockedUseVotes;
	};
});

describe('CardFooter', () => {
	beforeEach(() => {
		mockedUseVotes.addVote.mutate.mockRestore();
	});

	it('should render CardFooter', async () => {
		const boardId = '1';
		const socketId = '1';
		const userId = '1';
		const anonymous = false;
		const isItem = false;
		const isMainboard = false;
		const isCommentOpened = false;
		const maxVotes = 6;
		const hideCards = false;

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
					votes: ['id_1', 'id_2']
				}
			]
		} as CardType;

		const mockedComments = [] as CommentType[];

		const mockedBoardUser = {} as BoardUser;

		// const spy = jest.spyOn(mockedUseVotes, 'addVote');

		const { debug, getByText } = render(
			<CardFooter
				boardId={boardId}
				socketId={socketId}
				userId={userId}
				anonymous={anonymous}
				card={mockedCard}
				teamName={mockedCard.createdByTeam}
				isItem={isItem}
				isMainboard={isMainboard}
				comments={mockedComments}
				setOpenComments={() => {}}
				isCommentsOpened={isCommentOpened}
				boardUser={mockedBoardUser}
				maxVotes={maxVotes}
				hideCards={hideCards}
			/>
		);

		const addVoteButton = screen.getByTestId('custom-element');
		await waitFor(() => userEvent.click(addVoteButton));
		expect(mockedUseVotes.addVote.mutate).toHaveBeenCalledTimes(1);

		expect(getByText('First Last')).toBeInTheDocument();
		expect(getByText('FL')).toBeInTheDocument();
		expect(getByText('2')).toBeInTheDocument();
	});
});
