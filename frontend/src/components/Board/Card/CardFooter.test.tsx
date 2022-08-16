import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useRouter } from 'next/router';
import { render } from '@testing-library/react';

import { BoardUser } from 'types/board/board.user';
import CardType from 'types/card/card';
import { BoardUserRoles } from 'utils/enums/board.user.roles';
import CardFooter from './CardFooter';

/*
MOCK DATA
*/
const boardId = '62f12917c81c816dd0cf77c5';
const hideCards = false;
const isItem = false;
const isMainboard = false;
const maxVotes = 6;
const socketId = 'J8AW864LR3ZIy5rxAAAb';
const teamName = '';
const userId = '62f12917c81c816dd0cf77da';
const comments: any[] = [
	{
		text: 'Comment #2',
		createdBy: {
			_id: '62f104ffc81c816dd0cf7765',
			firstName: 'FirstName',
			lastName: 'LastName',
			email: 'email@test.com',
			isSAdmin: false,
			joinedAt: ''
		},
		_id: '62f2250bc81c816dd0cf7872'
	},
	{
		text: 'Comment #2',
		createdBy: {
			_id: '62f104ffc81c816dd0cf7765',
			firstName: 'FirstName',
			lastName: 'LastName',
			email: 'email@test.com',
			isSAdmin: false,
			joinedAt: ''
		},
		_id: '62f2250bc81c816dd3cf7872'
	}
];
const card: CardType = {
	text: 'Test',
	items: [
		{
			text: 'Test',
			votes: [],
			comments: [
				{
					text: 'Comment #2',
					createdBy: {
						_id: '62f104ffc81c816dd0cf7765',
						firstName: 'FirstName',
						lastName: 'LastName',
						email: 'email@test.com',
						isSAdmin: false,
						joinedAt: ''
					},
					_id: '62f2250bc81c816dd0cf7872'
				},
				{
					text: 'Comment #2',
					createdBy: {
						_id: '62f104ffc81c816dd0cf7765',
						firstName: 'FirstName',
						lastName: 'LastName',
						email: 'email@test.com',
						isSAdmin: false,
						joinedAt: ''
					},
					_id: '62f2250bc81c816dd3cf7872'
				}
			],
			createdBy: {
				_id: '62f104ffc81c816dd0cf7765',
				firstName: 'FirstName',
				lastName: 'LastName',
				email: 'email@test.com',
				isSAdmin: false,
				joinedAt: ''
			},
			anonymous: true,
			_id: '62f221dfc81c816dd0cf7826'
		}
	],
	comments: [],
	votes: [],
	createdBy: {
		_id: '62f104ffc81c816dd0cf7765',
		firstName: 'FirstName',
		lastName: 'LastName',
		email: 'email@test.com',
		isSAdmin: false,
		joinedAt: ''
	},
	anonymous: true,
	_id: '62f221dfc81c816dd0cf7825'
};
const boardUser: BoardUser = {
	id: '62f12917c81c816dd0cf77da',
	_id: '62f12917c81c816dd0cf77da',
	role: BoardUserRoles.MEMBER,
	user: {
		_id: '62f104ffc81c816dd0cf7765',
		firstName: 'FirstName',
		lastName: 'LastName',
		email: 'email@test.com',
		isSAdmin: false,
		joinedAt: ''
	},
	votesCount: 6
};

/*
AUTH MOCK
*/
const mockSession = {
	expires: 10,
	user: {
		id: '62f104ffc81c816dd0cf7765',
		email: 'email@test.com'
	},
	isSAdmin: false,
	joinedAt: '',
	session: ''
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

jest.mock('next/router', () => ({
	useRouter: jest.fn()
}));

(useRouter as jest.Mock).mockImplementation(() => ({
	pathname: '/boards/62f12917c81c816dd0cf77c5',
	query: {
		boardId: '1'
	}
}));

/*
COMPONENT MOCK
*/
interface WrapperProps {
	anonymous: boolean;
}

const Wrapper = ({ anonymous }: WrapperProps) => {
	const [isCommentsOpened, setIsCommentsOpened] = useState(false);

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false
			}
		}
	});

	const handleOpenComments = () => setIsCommentsOpened(!isCommentsOpened);

	return (
		<QueryClientProvider client={queryClient}>
			<CardFooter
				anonymous={anonymous}
				boardId={boardId}
				boardUser={boardUser}
				card={card}
				comments={comments}
				hideCards={hideCards}
				isCommentsOpened={isCommentsOpened}
				isItem={isItem}
				isMainboard={isMainboard}
				maxVotes={maxVotes}
				setOpenComments={handleOpenComments}
				socketId={socketId}
				teamName={teamName}
				userId={userId}
			/>
		</QueryClientProvider>
	);
};

/* 
TESTS 
*/
describe('CardFooter Component', () => {
	it('Renders without crashing', () => {
		const anonymous = false;
		render(<Wrapper anonymous={anonymous} />);
	});

	it('Displays the name of the user who created if not anonymous', () => {
		const anonymous = false;
		const { getByTestId } = render(<Wrapper anonymous={anonymous} />);

		expect(getByTestId('createdByName')).toHaveTextContent(
			`${card.createdBy?.firstName} ${card.createdBy?.lastName}`
		);
	});

	it('Displays the right number of comments', () => {
		const anonymous = false;
		const { getByTestId } = render(<Wrapper anonymous={anonymous} />);

		expect(getByTestId('commentsLength')).toHaveTextContent(`${card.items[0].comments.length}`);
	});

	it('Should hide name if anonymous', () => {
		const anonymous = true;
		const { queryByText } = render(<Wrapper anonymous={anonymous} />);

		expect(queryByText(`${card.createdBy?.firstName}`)).toBeNull();
		expect(queryByText(`${card.createdBy?.lastName}`)).toBeNull();
	});
});
