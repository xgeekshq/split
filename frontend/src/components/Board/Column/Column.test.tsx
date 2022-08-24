import { useRouter } from 'next/router';
import { QueryClient, QueryClientProvider } from 'react-query';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DragDropContext, Droppable } from '@react-forked/dnd';

import Column from './Column';
import CardType from 'types/card/card';
import { BoardUser } from 'types/board/board.user';
import { BoardUserRoles } from 'utils/enums/board.user.roles';
import { CardsContainer } from './styles';

/*
MOCK DATA
*/
const columnId = '0';
const userId = '62f12917c81c816dd0cf77da';
const boardId = '62f12917c81c816dd0cf77c5';
const title = 'Went well';
const color = '$highlight1Light';
const socketId = 'J8AW864LR3ZIy5rxAAAb';
const isMainboard = true;
const maxVotes = 6;
const countAllCards = 3;
const isSubmited = false;
const hideCards = false;
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
const cards: CardType[] = [
	{
		text: 'Most Votes',
		items: [
			{
				text: 'Most Votes',
				votes: [
					'62f221dfc81c816dd0cf7826',
					'62f221dfc81c816dd0cf7826',
					'62f221dfc81c816dd0cf7826'
				],
				comments: [],
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
	},
	{
		text: 'Least Votes',
		items: [
			{
				text: 'Least Votes',
				votes: ['62f221dfc81c816dd0cf7826'],
				comments: [],
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
		_id: '62f221dfc81c816dd0cf7815'
	}
];

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
type WrapperProps = {};

const Wrapper = ({}: WrapperProps) => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false
			}
		}
	});

	return (
		<QueryClientProvider client={queryClient}>
			<DragDropContext onDragEnd={() => {}}>
				<Droppable isCombineEnabled droppableId="0" type="CARD">
					{(provided) => (
						<CardsContainer
							direction="column"
							ref={provided.innerRef}
							{...provided.droppableProps}
						>
							<Column
								index={0}
								columnId={columnId}
								cards={cards}
								userId={userId}
								boardId={boardId}
								title={title}
								color={color}
								socketId={socketId}
								isMainboard={isMainboard}
								boardUser={boardUser}
								maxVotes={maxVotes}
								countAllCards={countAllCards}
								isSubmited={isSubmited}
								hideCards={hideCards}
							/>
						</CardsContainer>
					)}
				</Droppable>
			</DragDropContext>
		</QueryClientProvider>
	);
};

describe('Colmun Component', () => {
	it('Renders without crashing', () => {
		render(<Wrapper />);
	});

	it('Renders the correct cards', () => {
		const { getByTestId } = render(<Wrapper />);

		const firstCard = getByTestId('card1');
		const secondCard = getByTestId('card2');

		expect(firstCard).toBeTruthy();
		expect(firstCard).toHaveTextContent('Most Votes');
		expect(secondCard).toBeTruthy();
		expect(secondCard).toHaveTextContent('Least Votes');
	});

	// POS MVP
	// it('Should short the the cards by ascending votes', () => {
	// 	const { getByTestId } = render(<Wrapper />);

	// 	userEvent.click(getByTestId('filterBtn'));
	// });
});
